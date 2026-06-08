const router = require('express').Router();
const db = require('../config/database');
const { authenticate, requireRole } = require('../middleware/auth');

// GET /api/subscriptions/plans
router.get('/plans', async (req, res) => {
  const [plans] = await db.query('SELECT * FROM subscription_plans WHERE is_active = TRUE ORDER BY price ASC');
  res.json(plans.map(p => ({ ...p, features: typeof p.features === 'string' ? JSON.parse(p.features) : p.features })));
});

// GET /api/subscriptions/my
router.get('/my', authenticate, requireRole('artisan'), async (req, res) => {
  const [profile] = await db.query('SELECT id FROM artisan_profiles WHERE user_id = ?', [req.user.id]);
  if (!profile.length) return res.status(404).json({ error: 'Profil introuvable' });

  const [sub] = await db.query(`
    SELECT asub.*, sp.name as plan_name, sp.features, sp.price
    FROM artisan_subscriptions asub
    JOIN subscription_plans sp ON sp.id = asub.plan_id
    WHERE asub.artisan_id = ? AND asub.is_active = TRUE AND asub.ends_at > NOW()
    ORDER BY asub.ends_at DESC LIMIT 1`, [profile[0].id]);

  res.json(sub.length ? { ...sub[0], features: typeof sub[0].features === 'string' ? JSON.parse(sub[0].features) : sub[0].features } : null);
});

// POST /api/subscriptions/subscribe
router.post('/subscribe', authenticate, requireRole('artisan'), async (req, res) => {
  const { plan_id } = req.body;
  if (!plan_id) return res.status(400).json({ error: 'Plan requis' });

  const [profile] = await db.query('SELECT id FROM artisan_profiles WHERE user_id = ?', [req.user.id]);
  if (!profile.length) return res.status(404).json({ error: 'Profil introuvable' });

  const [plan] = await db.query('SELECT * FROM subscription_plans WHERE id = ? AND is_active = TRUE', [plan_id]);
  if (!plan.length) return res.status(404).json({ error: 'Plan introuvable' });

  await db.query(
    'UPDATE artisan_subscriptions SET is_active = FALSE WHERE artisan_id = ?',
    [profile[0].id]
  );

  const starts_at = new Date();
  const ends_at = new Date(starts_at.getTime() + plan[0].duration_days * 24 * 60 * 60 * 1000);

  await db.query(
    'INSERT INTO artisan_subscriptions (artisan_id, plan_id, starts_at, ends_at) VALUES (?,?,?,?)',
    [profile[0].id, plan_id, starts_at, ends_at]
  );

  const isPremium = plan[0].price > 0;
  await db.query('UPDATE artisan_profiles SET is_premium = ? WHERE id = ?', [isPremium, profile[0].id]);

  res.status(201).json({ message: `Abonnement ${plan[0].name} activé jusqu'au ${ends_at.toLocaleDateString('fr-FR')}` });
});

module.exports = router;
