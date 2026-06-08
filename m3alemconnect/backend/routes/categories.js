const router = require('express').Router();
const db = require('../config/database');

// GET /api/categories
router.get('/', async (req, res) => {
  const [rows] = await db.query(
    'SELECT * FROM categories ORDER BY artisan_count DESC, name_fr ASC'
  );
  res.json(rows);
});

// GET /api/categories/:slug
router.get('/:slug', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM categories WHERE slug = ?', [req.params.slug]);
  if (!rows.length) return res.status(404).json({ error: 'Catégorie introuvable' });
  res.json(rows[0]);
});

module.exports = router;
