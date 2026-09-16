const router = require('express').Router();
const { body, validationResult } = require('express-validator');
const db = require('../config/database');
const { authenticate, requireRole } = require('../middleware/auth');

// POST /api/quotes — client sends a quote request
router.post('/', authenticate, requireRole('client'), [
  body('artisan_user_id').isInt(),
  body('description').trim().isLength({ min: 10, max: 2000 }),
  body('city').optional().trim(),
  body('budget_min').optional().isFloat({ min: 0 }),
  body('budget_max').optional().isFloat({ min: 0 }),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { artisan_user_id, description, city, budget_min, budget_max } = req.body;

  const [profile] = await db.query('SELECT id FROM artisan_profiles WHERE user_id = ?', [artisan_user_id]);
  if (!profile.length) return res.status(404).json({ error: 'Artisan introuvable' });

  const [result] = await db.query(
    'INSERT INTO quote_requests (artisan_id, client_id, description, city, budget_min, budget_max) VALUES (?,?,?,?,?,?)',
    [profile[0].id, req.user.id, description, city || null, budget_min || null, budget_max || null]
  );
  res.status(201).json({ id: result.insertId, message: 'Devis envoyé avec succès' });
});

// GET /api/quotes/mine — client sees their sent quotes
router.get('/mine', authenticate, requireRole('client'), async (req, res) => {
  const [rows] = await db.query(`
    SELECT qr.*, u.id as artisan_user_id, u.first_name, u.last_name, u.avatar_url, c.name_fr as category_name, c.slug as category_slug, c.icon
    FROM quote_requests qr
    JOIN artisan_profiles ap ON ap.id = qr.artisan_id
    JOIN users u ON u.id = ap.user_id
    JOIN categories c ON c.id = ap.category_id
    WHERE qr.client_id = ?
    ORDER BY qr.created_at DESC`, [req.user.id]);
  res.json(rows);
});

// GET /api/quotes/inbox — artisan sees received quotes
router.get('/inbox', authenticate, requireRole('artisan'), async (req, res) => {
  const [profile] = await db.query('SELECT id FROM artisan_profiles WHERE user_id = ?', [req.user.id]);
  if (!profile.length) return res.status(404).json({ error: 'Profil introuvable' });

  const [rows] = await db.query(`
    SELECT qr.*, u.first_name, u.last_name, u.city as client_city, u.phone, u.avatar_url
    FROM quote_requests qr
    JOIN users u ON u.id = qr.client_id
    WHERE qr.artisan_id = ?
    ORDER BY qr.created_at DESC`, [profile[0].id]);

  await db.query(
    'UPDATE quote_requests SET status = "viewed" WHERE artisan_id = ? AND status = "pending"',
    [profile[0].id]
  );
  res.json(rows);
});

// PUT /api/quotes/:id/respond — artisan responds
router.put('/:id/respond', authenticate, requireRole('artisan'), [
  body('artisan_response').trim().isLength({ min: 5 }),
  body('artisan_price').optional().isFloat({ min: 0 }),
  body('status').isIn(['responded', 'rejected']),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const [profile] = await db.query('SELECT id FROM artisan_profiles WHERE user_id = ?', [req.user.id]);
  if (!profile.length) return res.status(404).json({ error: 'Profil introuvable' });

  const [result] = await db.query(
    'UPDATE quote_requests SET artisan_response=?, artisan_price=?, status=? WHERE id=? AND artisan_id=?',
    [req.body.artisan_response, req.body.artisan_price || null, req.body.status, req.params.id, profile[0].id]
  );
  if (!result.affectedRows) return res.status(404).json({ error: 'Devis introuvable' });
  res.json({ message: 'Réponse envoyée' });
});

// PUT /api/quotes/:id/complete — client marks job complete
router.put('/:id/complete', authenticate, requireRole('client'), async (req, res) => {
  const [result] = await db.query(
    'UPDATE quote_requests SET status="completed" WHERE id=? AND client_id=? AND status="accepted"',
    [req.params.id, req.user.id]
  );
  if (!result.affectedRows) return res.status(404).json({ error: 'Devis introuvable ou non accepté' });

  const [qr] = await db.query('SELECT artisan_id FROM quote_requests WHERE id = ?', [req.params.id]);
  await db.query('UPDATE artisan_profiles SET total_jobs = total_jobs + 1 WHERE id = ?', [qr[0].artisan_id]);
  res.json({ message: 'Travail marqué comme terminé' });
});

module.exports = router;
