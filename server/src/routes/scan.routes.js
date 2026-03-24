import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getDatabase } from '../database/db.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = Router();

// POST /api/scan/ticket
router.post('/ticket', authenticateToken, (req, res) => {
  try {
    const { qrCode, eventId } = req.body;

    if (!qrCode) {
      return res.status(400).json({ success: false, error: 'QR code requis' });
    }

    const db = getDatabase();
    const ticket = db.prepare('SELECT t.*, u.firstName, u.lastName FROM tickets t JOIN users u ON t.userId = u.id WHERE t.qrCode = ?').get(qrCode);

    if (!ticket) {
      // Log the scan
      db.prepare('INSERT INTO scan_logs (id, eventId, scannerId, type, result) VALUES (?, ?, ?, ?, ?)').run(
        uuidv4(), eventId || 'unknown', req.user.id, 'ticket', 'invalid'
      );

      return res.json({
        success: true,
        data: {
          status: 'invalid',
          message: 'QR code non reconnu — billet invalide'
        }
      });
    }

    if (ticket.status === 'refunded') {
      db.prepare('INSERT INTO scan_logs (id, ticketId, eventId, scannerId, type, result) VALUES (?, ?, ?, ?, ?, ?)').run(
        uuidv4(), ticket.id, ticket.eventId, req.user.id, 'ticket', 'refunded'
      );

      return res.json({
        success: true,
        data: {
          status: 'refunded',
          message: 'Ce billet a été remboursé — entrée refusée',
          ticketId: ticket.id,
          holderName: `${ticket.firstName} ${ticket.lastName}`
        }
      });
    }

    if (ticket.status === 'scanned') {
      return res.json({
        success: true,
        data: {
          status: 'already_scanned',
          message: 'Ce billet a déjà été scanné',
          ticketId: ticket.id,
          holderName: `${ticket.firstName} ${ticket.lastName}`,
          scannedAt: ticket.scannedAt,
          seatInfo: ticket.seatInfo
        }
      });
    }

    // Valid ticket — mark as scanned
    const now = new Date().toISOString();
    db.prepare('UPDATE tickets SET status = ?, scannedAt = ? WHERE id = ?').run('scanned', now, ticket.id);

    db.prepare('INSERT INTO scan_logs (id, ticketId, eventId, scannerId, type, result) VALUES (?, ?, ?, ?, ?, ?)').run(
      uuidv4(), ticket.id, ticket.eventId, req.user.id, 'ticket', 'valid'
    );

    res.json({
      success: true,
      data: {
        status: 'valid',
        message: 'Entrée autorisée — bienvenue !',
        ticketId: ticket.id,
        holderName: `${ticket.firstName} ${ticket.lastName}`,
        seatInfo: ticket.seatInfo,
        scannedAt: now
      }
    });
  } catch (err) {
    console.error('Scan ticket error:', err);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// POST /api/scan/credit
router.post('/credit', authenticateToken, (req, res) => {
  try {
    const { qrCode, amount, eventId } = req.body;

    if (!qrCode) {
      return res.status(400).json({ success: false, error: 'QR code requis' });
    }

    const debitAmount = amount || 5.0;

    const db = getDatabase();
    const credit = db.prepare('SELECT c.*, u.firstName, u.lastName FROM credits c JOIN users u ON c.userId = u.id WHERE c.qrCode = ?').get(qrCode);

    if (!credit) {
      db.prepare('INSERT INTO scan_logs (id, eventId, scannerId, type, result) VALUES (?, ?, ?, ?, ?)').run(
        uuidv4(), eventId || 'unknown', req.user.id, 'credit', 'invalid'
      );

      return res.json({
        success: true,
        data: {
          status: 'invalid',
          message: 'QR code non reconnu'
        }
      });
    }

    if (credit.balance < debitAmount) {
      return res.json({
        success: true,
        data: {
          status: 'insufficient',
          message: 'Solde insuffisant',
          currentBalance: credit.balance,
          requiredAmount: debitAmount,
          holderName: `${credit.firstName} ${credit.lastName}`
        }
      });
    }

    // Debit
    const newBalance = credit.balance - debitAmount;
    db.prepare('UPDATE credits SET balance = ? WHERE id = ?').run(newBalance, credit.id);

    db.prepare('INSERT INTO scan_logs (id, creditId, eventId, scannerId, type, result) VALUES (?, ?, ?, ?, ?, ?)').run(
      uuidv4(), credit.id, eventId || 'unknown', req.user.id, 'credit', 'valid'
    );

    res.json({
      success: true,
      data: {
        status: 'valid',
        message: `${debitAmount.toFixed(2)}€ débités avec succès`,
        previousBalance: credit.balance,
        newBalance,
        amount: debitAmount,
        holderName: `${credit.firstName} ${credit.lastName}`
      }
    });
  } catch (err) {
    console.error('Scan credit error:', err);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

export default router;
