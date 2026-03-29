import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { getTestDatabase } from '../../src/database/db.js';

describe('Scan - Unit Tests', () => {
  let db;

  beforeAll(() => {
    db = getTestDatabase();

    // Create user
    db.prepare('INSERT INTO users (id, email, password, firstName, lastName, role) VALUES (?, ?, ?, ?, ?, ?)').run(
      'user-1', 'spectateur@sport-ix.com', 'hashed', 'Jean', 'Dupont', 'spectator'
    );
    db.prepare('INSERT INTO users (id, email, password, firstName, lastName, role, clubName) VALUES (?, ?, ?, ?, ?, ?, ?)').run(
      'club-1', 'club@sport-ix.com', 'hashed', 'Admin', 'Club', 'club', 'RC Toulon'
    );

    // Create event
    db.prepare('INSERT INTO events (id, title, sportType, date, location, clubName, ticketsSold, maxCapacity, price, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').run(
      'evt-1', 'Match Test', 'Rugby', '2026-04-15T20:00:00Z', 'Stade', 'RC Toulon', 100, 500, 25, 'upcoming'
    );

    // Create tickets with various statuses
    db.prepare('INSERT INTO tickets (id, eventId, userId, qrCode, status, holderName, seatInfo) VALUES (?, ?, ?, ?, ?, ?, ?)').run(
      'ticket-valid', 'evt-1', 'user-1', 'QR-VALID-001', 'valid', 'Jean Dupont', 'Tribune A - Rang 5'
    );
    db.prepare('INSERT INTO tickets (id, eventId, userId, qrCode, status, holderName, seatInfo, scannedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)').run(
      'ticket-scanned', 'evt-1', 'user-1', 'QR-SCANNED-001', 'scanned', 'Jean Dupont', 'Tribune B - Rang 3', '2026-04-15T19:30:00Z'
    );
    db.prepare('INSERT INTO tickets (id, eventId, userId, qrCode, status, holderName, seatInfo) VALUES (?, ?, ?, ?, ?, ?, ?)').run(
      'ticket-refunded', 'evt-1', 'user-1', 'QR-REFUNDED-001', 'refunded', 'Jean Dupont', 'Tribune C - Rang 10'
    );

    // Create credit
    db.prepare('INSERT INTO credits (id, userId, balance, qrCode) VALUES (?, ?, ?, ?)').run(
      'credit-1', 'user-1', 45.50, 'QR-CREDIT-001'
    );
  });

  afterAll(() => {
    db.close();
  });

  describe('Ticket Scan', () => {
    it('should find a valid ticket by QR code', () => {
      const ticket = db.prepare('SELECT * FROM tickets WHERE qrCode = ?').get('QR-VALID-001');
      expect(ticket).toBeDefined();
      expect(ticket.status).toBe('valid');
      expect(ticket.holderName).toBe('Jean Dupont');
    });

    it('should detect already scanned ticket', () => {
      const ticket = db.prepare('SELECT * FROM tickets WHERE qrCode = ?').get('QR-SCANNED-001');
      expect(ticket).toBeDefined();
      expect(ticket.status).toBe('scanned');
      expect(ticket.scannedAt).toBeDefined();
    });

    it('should detect refunded ticket', () => {
      const ticket = db.prepare('SELECT * FROM tickets WHERE qrCode = ?').get('QR-REFUNDED-001');
      expect(ticket).toBeDefined();
      expect(ticket.status).toBe('refunded');
    });

    it('should return undefined for invalid QR code', () => {
      const ticket = db.prepare('SELECT * FROM tickets WHERE qrCode = ?').get('QR-INVALID-999');
      expect(ticket).toBeUndefined();
    });

    it('should mark ticket as scanned', () => {
      const now = new Date().toISOString();
      db.prepare('UPDATE tickets SET status = ?, scannedAt = ? WHERE id = ?').run('scanned', now, 'ticket-valid');

      const ticket = db.prepare('SELECT * FROM tickets WHERE id = ?').get('ticket-valid');
      expect(ticket.status).toBe('scanned');
      expect(ticket.scannedAt).toBe(now);
    });
  });

  describe('Credit Scan', () => {
    it('should find credit by QR code', () => {
      const credit = db.prepare('SELECT * FROM credits WHERE qrCode = ?').get('QR-CREDIT-001');
      expect(credit).toBeDefined();
      expect(credit.balance).toBe(45.50);
    });

    it('should debit credit balance', () => {
      const credit = db.prepare('SELECT * FROM credits WHERE qrCode = ?').get('QR-CREDIT-001');
      const newBalance = credit.balance - 5.0;
      db.prepare('UPDATE credits SET balance = ? WHERE id = ?').run(newBalance, credit.id);

      const updated = db.prepare('SELECT * FROM credits WHERE id = ?').get(credit.id);
      expect(updated.balance).toBe(40.50);
    });

    it('should detect insufficient balance', () => {
      const credit = db.prepare('SELECT * FROM credits WHERE qrCode = ?').get('QR-CREDIT-001');
      const amount = 999;
      expect(credit.balance < amount).toBe(true);
    });

    it('should return undefined for invalid credit QR', () => {
      const credit = db.prepare('SELECT * FROM credits WHERE qrCode = ?').get('QR-INVALID-CREDIT');
      expect(credit).toBeUndefined();
    });
  });
});
