import { Router } from 'express';
import { getDatabase } from '../database/db.js';

const router = Router();

// GET /api/events
router.get('/', (req, res) => {
  try {
    const db = getDatabase();
    const { sport, status } = req.query;

    let query = 'SELECT * FROM events';
    const params = [];
    const conditions = [];

    if (sport) {
      conditions.push('sportType = ?');
      params.push(sport);
    }
    if (status) {
      conditions.push('status = ?');
      params.push(status);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY date ASC';

    const events = db.prepare(query).all(...params);

    res.json({ success: true, data: events });
  } catch (err) {
    console.error('Events error:', err);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// GET /api/events/:id
router.get('/:id', (req, res) => {
  try {
    const db = getDatabase();
    const event = db.prepare('SELECT * FROM events WHERE id = ?').get(req.params.id);

    if (!event) {
      return res.status(404).json({ success: false, error: 'Événement non trouvé' });
    }

    res.json({ success: true, data: event });
  } catch (err) {
    console.error('Event detail error:', err);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

export default router;
