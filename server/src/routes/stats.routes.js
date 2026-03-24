import { Router } from 'express';
import { getDatabase } from '../database/db.js';

const router = Router();

// GET /api/stats
router.get('/', (req, res) => {
  try {
    const db = getDatabase();
    const stats = db.prepare('SELECT key, value, label FROM stats').all();

    const statsMap = {};
    for (const stat of stats) {
      statsMap[stat.key] = { value: stat.value, label: stat.label };
    }

    res.json({ success: true, data: statsMap });
  } catch (err) {
    console.error('Stats error:', err);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

export default router;
