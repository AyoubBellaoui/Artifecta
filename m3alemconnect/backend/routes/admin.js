const router = require('express').Router();
const db = require('../config/database');
const { authenticate, requireRole } = require('../middleware/auth');

const adminOnly = [authenticate, requireRole('admin')];

// GET /api/admin/stats
router.get('/stats', ...adminOnly, async (req, res) => {
  const [[users]] = await db.query('SELECT COUNT(*) as total FROM users WHERE role != "admin"');
  const [[artisans]] = await db.query('SELECT COUNT(*) as total FROM artisan_profiles');
  const [[clients]] = await db.query('SELECT COUNT(*) as total FROM users WHERE role = "client"');
  const [[quotes]] = await db.query('SELECT COUNT(*) as total FROM quote_requests');
  const [[reviews]] = await db.query('SELECT COUNT(*) as total FROM reviews');
  const [[premium]] = await db.query('SELECT COUNT(*) as total FROM artisan_profiles WHERE is_premium = TRUE');
  const [recentUsers] = await db.query(
    'SELECT id, first_name, last_name, email, role, city, created_at FROM users WHERE role != "admin" ORDER BY created_at DESC LIMIT 5'
  );
  res.json({ users: users.total, artisans: artisans.total, clients: clients.total, quotes: quotes.total, reviews: reviews.total, premium: premium.total, recentUsers });
});

// GET /api/admin/users
router.get('/users', ...adminOnly, async (req, res) => {
  const { role, search, page = 1, limit = 20 } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);
  const params = [];
  let where = 'WHERE role != "admin"';
  if (role) { where += ' AND role = ?'; params.push(role); }
  if (search) { where += ' AND (first_name LIKE ? OR last_name LIKE ? OR email LIKE ?)'; params.push(`%${search}%`, `%${search}%`, `%${search}%`); }

  const [rows] = await db.query(
    `SELECT id, email, role, first_name, last_name, phone, city, is_verified, is_active, created_at FROM users ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
    [...params, parseInt(limit), offset]
  );
  const [[count]] = await db.query(`SELECT COUNT(*) as total FROM users ${where}`, params);
  res.json({ users: rows, total: count.total });
});

// PUT /api/admin/users/:id/toggle-active
router.put('/users/:id/toggle-active', ...adminOnly, async (req, res) => {
  await db.query('UPDATE users SET is_active = NOT is_active WHERE id = ?', [req.params.id]);
  res.json({ message: 'Statut mis à jour' });
});

// PUT /api/admin/users/:id/verify
router.put('/users/:id/verify', ...adminOnly, async (req, res) => {
  await db.query('UPDATE users SET is_verified = TRUE WHERE id = ?', [req.params.id]);
  await db.query('UPDATE artisan_profiles SET is_verified = TRUE WHERE user_id = ?', [req.params.id]);
  res.json({ message: 'Artisan vérifié' });
});

// GET /api/admin/reviews — pending moderation
router.get('/reviews', ...adminOnly, async (req, res) => {
  const [rows] = await db.query(`
    SELECT r.*, u.first_name, u.last_name,
      au.first_name as artisan_first, au.last_name as artisan_last
    FROM reviews r
    JOIN users u ON u.id = r.client_id
    JOIN artisan_profiles ap ON ap.id = r.artisan_id
    JOIN users au ON au.id = ap.user_id
    ORDER BY r.created_at DESC LIMIT 50`);
  res.json(rows);
});

// PUT /api/admin/reviews/:id/approve
router.put('/reviews/:id/approve', ...adminOnly, async (req, res) => {
  await db.query('UPDATE reviews SET is_approved = TRUE WHERE id = ?', [req.params.id]);
  res.json({ message: 'Avis approuvé' });
});

// DELETE /api/admin/reviews/:id
router.delete('/reviews/:id', ...adminOnly, async (req, res) => {
  await db.query('DELETE FROM reviews WHERE id = ?', [req.params.id]);
  res.json({ message: 'Avis supprimé' });
});

// GET /api/admin/quotes
router.get('/quotes', ...adminOnly, async (req, res) => {
  const [rows] = await db.query(`
    SELECT qr.id, qr.description, qr.status, qr.created_at, qr.city,
      c.first_name as client_fn, c.last_name as client_ln,
      a.first_name as artisan_fn, a.last_name as artisan_ln
    FROM quote_requests qr
    JOIN users c ON c.id = qr.client_id
    JOIN artisan_profiles ap ON ap.id = qr.artisan_id
    JOIN users a ON a.id = ap.user_id
    ORDER BY qr.created_at DESC LIMIT 50`);
  res.json(rows);
});

module.exports = router;
