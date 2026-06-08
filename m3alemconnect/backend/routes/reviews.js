const router = require('express').Router();
const { body, validationResult } = require('express-validator');
const db = require('../config/database');
const { authenticate, requireRole } = require('../middleware/auth');

// GET /api/reviews/artisan/:artisanUserId
router.get('/artisan/:artisanUserId', async (req, res) => {
  const [profile] = await db.query('SELECT id FROM artisan_profiles WHERE user_id = ?', [req.params.artisanUserId]);
  if (!profile.length) return res.status(404).json({ error: 'Artisan introuvable' });

  const [reviews] = await db.query(`
    SELECT r.id, r.rating, r.comment, r.created_at,
      u.first_name, u.last_name, u.avatar_url
    FROM reviews r JOIN users u ON u.id = r.client_id
    WHERE r.artisan_id = ? AND r.is_approved = TRUE
    ORDER BY r.created_at DESC`, [profile[0].id]);

  res.json(reviews);
});

// POST /api/reviews/artisan/:artisanUserId
router.post('/artisan/:artisanUserId', authenticate, requireRole('client'), [
  body('rating').isInt({ min: 1, max: 5 }),
  body('comment').optional().trim().isLength({ max: 1000 }),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const [profile] = await db.query('SELECT id FROM artisan_profiles WHERE user_id = ?', [req.params.artisanUserId]);
  if (!profile.length) return res.status(404).json({ error: 'Artisan introuvable' });

  const artisanProfileId = profile[0].id;
  const { rating, comment } = req.body;

  try {
    await db.query(
      'INSERT INTO reviews (artisan_id, client_id, rating, comment) VALUES (?,?,?,?)',
      [artisanProfileId, req.user.id, rating, comment || null]
    );
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Vous avez déjà laissé un avis pour cet artisan' });
    }
    throw err;
  }

  const [stats] = await db.query(
    'SELECT AVG(rating) as avg, COUNT(*) as cnt FROM reviews WHERE artisan_id = ? AND is_approved = TRUE',
    [artisanProfileId]
  );
  await db.query(
    'UPDATE artisan_profiles SET rating_avg = ?, rating_count = ? WHERE id = ?',
    [parseFloat(stats[0].avg).toFixed(2), stats[0].cnt, artisanProfileId]
  );

  res.status(201).json({ message: 'Avis publié avec succès' });
});

// DELETE /api/reviews/:id (admin or author)
router.delete('/:id', authenticate, async (req, res) => {
  const [review] = await db.query('SELECT * FROM reviews WHERE id = ?', [req.params.id]);
  if (!review.length) return res.status(404).json({ error: 'Avis introuvable' });

  if (req.user.role !== 'admin' && review[0].client_id !== req.user.id) {
    return res.status(403).json({ error: 'Accès refusé' });
  }

  await db.query('DELETE FROM reviews WHERE id = ?', [req.params.id]);

  const [stats] = await db.query(
    'SELECT AVG(rating) as avg, COUNT(*) as cnt FROM reviews WHERE artisan_id = ? AND is_approved = TRUE',
    [review[0].artisan_id]
  );
  await db.query(
    'UPDATE artisan_profiles SET rating_avg = ?, rating_count = ? WHERE id = ?',
    [parseFloat(stats[0].avg || 0).toFixed(2), stats[0].cnt, review[0].artisan_id]
  );

  res.json({ message: 'Avis supprimé' });
});

module.exports = router;
