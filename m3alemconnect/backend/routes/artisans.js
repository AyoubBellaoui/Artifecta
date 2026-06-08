const router = require('express').Router();
const { body, query, validationResult } = require('express-validator');
const db = require('../config/database');
const { authenticate, requireRole } = require('../middleware/auth');
const upload = require('../middleware/upload');

// GET /api/artisans — search & filter
router.get('/', async (req, res) => {
  const { category, city, search, min_rating, available, sort = 'rating', page = 1, limit = 12 } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);
  const params = [];
  let where = 'WHERE u.is_active = TRUE AND u.role = "artisan"';

  if (category) { where += ' AND c.slug = ?'; params.push(category); }
  if (city) { where += ' AND (u.city LIKE ? OR ap.service_areas LIKE ?)'; params.push(`%${city}%`, `%${city}%`); }
  if (search) { where += ' AND (u.first_name LIKE ? OR u.last_name LIKE ? OR ap.bio_fr LIKE ?)'; params.push(`%${search}%`, `%${search}%`, `%${search}%`); }
  if (min_rating) { where += ' AND ap.rating_avg >= ?'; params.push(parseFloat(min_rating)); }
  if (available === 'true') { where += ' AND ap.is_available = TRUE'; }

  const orderMap = { rating: 'ap.rating_avg DESC', jobs: 'ap.total_jobs DESC', newest: 'ap.created_at DESC', premium: 'ap.is_premium DESC, ap.rating_avg DESC' };
  const orderBy = orderMap[sort] || orderMap.rating;

  const sql = `
    SELECT u.id, u.first_name, u.last_name, u.city, u.avatar_url, u.is_verified,
      ap.id as artisan_profile_id, ap.years_experience, ap.hourly_rate, ap.is_available,
      ap.is_premium, ap.is_verified as artisan_verified, ap.total_jobs,
      ap.rating_avg, ap.rating_count, ap.bio_fr, ap.views_count,
      c.id as category_id, c.name_fr as category_name, c.slug as category_slug, c.icon as category_icon
    FROM users u
    JOIN artisan_profiles ap ON ap.user_id = u.id
    JOIN categories c ON c.id = ap.category_id
    ${where}
    ORDER BY ap.is_premium DESC, ${orderBy}
    LIMIT ? OFFSET ?`;

  const countSql = `
    SELECT COUNT(*) as total FROM users u
    JOIN artisan_profiles ap ON ap.user_id = u.id
    JOIN categories c ON c.id = ap.category_id
    ${where}`;

  const [rows] = await db.query(sql, [...params, parseInt(limit), offset]);
  const [countRows] = await db.query(countSql, params);
  const total = countRows[0].total;

  res.json({ artisans: rows, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
});

// GET /api/artisans/:id
router.get('/:id', async (req, res) => {
  const [rows] = await db.query(`
    SELECT u.id, u.first_name, u.last_name, u.city, u.phone, u.avatar_url, u.is_verified, u.created_at,
      ap.id as artisan_profile_id, ap.category_id, ap.bio_fr, ap.years_experience, ap.hourly_rate,
      ap.is_available, ap.is_premium, ap.is_verified as artisan_verified, ap.total_jobs,
      ap.rating_avg, ap.rating_count, ap.service_areas, ap.views_count,
      c.name_fr as category_name, c.slug as category_slug, c.icon as category_icon
    FROM users u
    JOIN artisan_profiles ap ON ap.user_id = u.id
    JOIN categories c ON c.id = ap.category_id
    WHERE u.id = ? AND u.is_active = TRUE`, [req.params.id]);

  if (!rows.length) return res.status(404).json({ error: 'Artisan introuvable' });

  const artisan = rows[0];
  await db.query('UPDATE artisan_profiles SET views_count = views_count + 1 WHERE user_id = ?', [req.params.id]);

  const [photos] = await db.query('SELECT * FROM portfolio_photos WHERE artisan_id = ? ORDER BY created_at DESC', [artisan.artisan_profile_id]);
  const [skills] = await db.query('SELECT skill_name FROM artisan_skills WHERE artisan_id = ?', [artisan.artisan_profile_id]);
  const [reviews] = await db.query(`
    SELECT r.*, u.first_name, u.last_name, u.avatar_url
    FROM reviews r JOIN users u ON u.id = r.client_id
    WHERE r.artisan_id = ? AND r.is_approved = TRUE
    ORDER BY r.created_at DESC LIMIT 10`, [artisan.artisan_profile_id]);

  res.json({ ...artisan, photos, skills: skills.map(s => s.skill_name), reviews });
});

// PUT /api/artisans/profile — artisan updates own profile
router.put('/profile', authenticate, requireRole('artisan'), [
  body('bio_fr').optional().trim(),
  body('years_experience').optional().isInt({ min: 0, max: 60 }),
  body('hourly_rate').optional().isFloat({ min: 0 }),
  body('is_available').optional().isBoolean(),
  body('service_areas').optional().trim(),
  body('skills').optional().isArray(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { bio_fr, years_experience, hourly_rate, is_available, service_areas, skills, category_id } = req.body;

  const [profile] = await db.query('SELECT id FROM artisan_profiles WHERE user_id = ?', [req.user.id]);
  if (!profile.length) return res.status(404).json({ error: 'Profil artisan introuvable' });
  const profileId = profile[0].id;

  await db.query(
    `UPDATE artisan_profiles SET
      bio_fr=COALESCE(?,bio_fr), years_experience=COALESCE(?,years_experience),
      hourly_rate=COALESCE(?,hourly_rate), is_available=COALESCE(?,is_available),
      service_areas=COALESCE(?,service_areas), category_id=COALESCE(?,category_id)
    WHERE user_id=?`,
    [bio_fr, years_experience, hourly_rate, is_available, service_areas, category_id, req.user.id]
  );

  if (Array.isArray(skills)) {
    await db.query('DELETE FROM artisan_skills WHERE artisan_id = ?', [profileId]);
    if (skills.length) {
      const values = skills.map(s => [profileId, s]);
      await db.query('INSERT INTO artisan_skills (artisan_id, skill_name) VALUES ?', [values]);
    }
  }

  res.json({ message: 'Profil mis à jour avec succès' });
});

// POST /api/artisans/photos — upload portfolio photo
router.post('/photos', authenticate, requireRole('artisan'), upload.single('photo'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Aucune image fournie' });

  const [profile] = await db.query('SELECT id FROM artisan_profiles WHERE user_id = ?', [req.user.id]);
  if (!profile.length) return res.status(404).json({ error: 'Profil introuvable' });

  const photoUrl = `/uploads/${req.file.filename}`;
  const [result] = await db.query(
    'INSERT INTO portfolio_photos (artisan_id, photo_url, caption) VALUES (?,?,?)',
    [profile[0].id, photoUrl, req.body.caption || null]
  );
  res.status(201).json({ id: result.insertId, photo_url: photoUrl });
});

// DELETE /api/artisans/photos/:id
router.delete('/photos/:id', authenticate, requireRole('artisan'), async (req, res) => {
  const [profile] = await db.query('SELECT id FROM artisan_profiles WHERE user_id = ?', [req.user.id]);
  if (!profile.length) return res.status(404).json({ error: 'Profil introuvable' });

  const [result] = await db.query(
    'DELETE FROM portfolio_photos WHERE id = ? AND artisan_id = ?',
    [req.params.id, profile[0].id]
  );
  if (!result.affectedRows) return res.status(404).json({ error: 'Photo introuvable' });
  res.json({ message: 'Photo supprimée' });
});

// POST /api/artisans/avatar
router.post('/avatar', authenticate, upload.single('avatar'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Aucune image fournie' });
  const avatarUrl = `/uploads/${req.file.filename}`;
  await db.query('UPDATE users SET avatar_url = ? WHERE id = ?', [avatarUrl, req.user.id]);
  res.json({ avatar_url: avatarUrl });
});

module.exports = router;
