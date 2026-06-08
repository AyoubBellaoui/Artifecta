const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const db = require('../config/database');
const { authenticate } = require('../middleware/auth');

const generateToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

// POST /api/auth/register
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }),
  body('first_name').trim().notEmpty(),
  body('last_name').trim().notEmpty(),
  body('role').isIn(['client', 'artisan']),
  body('phone').optional().isMobilePhone(),
  body('city').optional().trim(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { email, password, first_name, last_name, role, phone, city, category_id, bio_fr, years_experience, hourly_rate } = req.body;

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const [existing] = await conn.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length) {
      await conn.rollback();
      return res.status(409).json({ error: 'Cet email est déjà utilisé' });
    }

    const password_hash = await bcrypt.hash(password, 12);
    const [result] = await conn.query(
      'INSERT INTO users (email, password_hash, role, first_name, last_name, phone, city) VALUES (?,?,?,?,?,?,?)',
      [email, password_hash, role, first_name, last_name, phone || null, city || null]
    );
    const userId = result.insertId;

    if (role === 'artisan') {
      if (!category_id) {
        await conn.rollback();
        return res.status(400).json({ error: 'La catégorie est requise pour un artisan' });
      }
      await conn.query(
        'INSERT INTO artisan_profiles (user_id, category_id, bio_fr, years_experience, hourly_rate) VALUES (?,?,?,?,?)',
        [userId, category_id, bio_fr || null, years_experience || 0, hourly_rate || null]
      );
      await conn.query(
        'UPDATE categories SET artisan_count = artisan_count + 1 WHERE id = ?',
        [category_id]
      );
    }

    await conn.commit();
    const token = generateToken(userId);
    const [user] = await db.query(
      'SELECT id, email, role, first_name, last_name, phone, city, avatar_url, is_verified FROM users WHERE id = ?',
      [userId]
    );
    res.status(201).json({ token, user: user[0] });
  } catch (err) {
    await conn.rollback();
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  } finally {
    conn.release();
  }
});

// POST /api/auth/login
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { email, password } = req.body;
  const [rows] = await db.query('SELECT * FROM users WHERE email = ? AND is_active = TRUE', [email]);
  if (!rows.length) return res.status(401).json({ error: 'Email ou mot de passe incorrect' });

  const user = rows[0];
  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) return res.status(401).json({ error: 'Email ou mot de passe incorrect' });

  const token = generateToken(user.id);
  const { password_hash, ...safeUser } = user;
  res.json({ token, user: safeUser });
});

// GET /api/auth/me
router.get('/me', authenticate, async (req, res) => {
  const [rows] = await db.query(
    `SELECT u.id, u.email, u.role, u.first_name, u.last_name, u.phone, u.city, u.avatar_url, u.is_verified, u.created_at,
      ap.id as artisan_profile_id, ap.category_id, ap.bio_fr, ap.years_experience, ap.hourly_rate,
      ap.is_available, ap.is_premium, ap.is_verified as artisan_verified, ap.total_jobs,
      ap.rating_avg, ap.rating_count, ap.service_areas, ap.views_count,
      c.name_fr as category_name, c.slug as category_slug, c.icon as category_icon
    FROM users u
    LEFT JOIN artisan_profiles ap ON ap.user_id = u.id
    LEFT JOIN categories c ON c.id = ap.category_id
    WHERE u.id = ?`,
    [req.user.id]
  );
  if (!rows.length) return res.status(404).json({ error: 'Utilisateur introuvable' });
  res.json(rows[0]);
});

// PUT /api/auth/profile
router.put('/profile', authenticate, [
  body('first_name').optional().trim().notEmpty(),
  body('last_name').optional().trim().notEmpty(),
  body('phone').optional().isMobilePhone(),
  body('city').optional().trim(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { first_name, last_name, phone, city } = req.body;
  await db.query(
    'UPDATE users SET first_name=COALESCE(?,first_name), last_name=COALESCE(?,last_name), phone=COALESCE(?,phone), city=COALESCE(?,city) WHERE id=?',
    [first_name, last_name, phone, city, req.user.id]
  );
  res.json({ message: 'Profil mis à jour' });
});

module.exports = router;
