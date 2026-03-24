import { Router } from 'express';
import { getDatabase } from '../database/db.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = Router();

// GET /api/user/dashboard
router.get('/dashboard', authenticateToken, (req, res) => {
  try {
    const db = getDatabase();
    const userId = req.user.id;

    const ticketCount = db.prepare('SELECT COUNT(*) as count FROM tickets WHERE userId = ?').get(userId);
    const eventsAttended = db.prepare('SELECT COUNT(*) as count FROM tickets WHERE userId = ? AND status = ?').get(userId, 'scanned');
    const credit = db.prepare('SELECT balance FROM credits WHERE userId = ?').get(userId);

    const upcomingTickets = db.prepare(`
      SELECT t.id, t.status, t.seatInfo, e.title, e.date, e.location, e.sportType
      FROM tickets t
      JOIN events e ON t.eventId = e.id
      WHERE t.userId = ? AND e.status = 'upcoming'
      ORDER BY e.date ASC
      LIMIT 5
    `).all(userId);

    res.json({
      success: true,
      data: {
        stats: {
          ticketsBought: ticketCount?.count || 0,
          eventsAttended: eventsAttended?.count || 0,
          creditsBalance: credit?.balance || 0,
          loyaltyPoints: (ticketCount?.count || 0) * 50
        },
        upcomingTickets
      }
    });
  } catch (err) {
    console.error('Dashboard error:', err);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// GET /api/user/profile
router.get('/profile', authenticateToken, (req, res) => {
  try {
    const db = getDatabase();
    const user = db.prepare('SELECT id, email, firstName, lastName, role, clubName, createdAt FROM users WHERE id = ?').get(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, error: 'Utilisateur non trouvé' });
    }

    const ticketCount = db.prepare('SELECT COUNT(*) as count FROM tickets WHERE userId = ?').get(req.user.id);
    const credit = db.prepare('SELECT balance FROM credits WHERE userId = ?').get(req.user.id);

    res.json({
      success: true,
      data: {
        ...user,
        stats: {
          totalTickets: ticketCount?.count || 0,
          creditsBalance: credit?.balance || 0
        }
      }
    });
  } catch (err) {
    console.error('Profile error:', err);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

export default router;
