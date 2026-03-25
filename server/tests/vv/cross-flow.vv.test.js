/**
 * V&V (Validation & Verification) — Cross-Flow Tests
 *
 * Validates that the full business logic chain works correctly:
 * - Register → Login → Access protected routes → Scan ticket → Scan credit
 * - Data consistency between services (user balance, ticket status, scan logs)
 * - Spec-to-code traceability: each test maps to a functional requirement
 *
 * VV-REQ-01: Auth flow must produce valid JWT usable on all protected routes
 * VV-REQ-02: Ticket scan must update ticket status and create scan log
 * VV-REQ-03: Credit scan must debit balance atomically and create scan log
 * VV-REQ-04: Double-scan of same ticket must return already_scanned
 * VV-REQ-05: Insufficient credit must not debit and must return error
 * VV-REQ-06: Stats endpoint must reflect real data from database
 * VV-REQ-07: Unauthenticated access must be rejected on all protected routes
 */
import { describe, it, expect, afterAll } from '@jest/globals';
import app from '../../src/index.js';
import { getDatabase, closeDatabase } from '../../src/database/db.js';
import request from 'supertest';

let clubToken;
let spectatorToken;

afterAll(() => {
  closeDatabase();
});

describe('V&V — Cross-Flow Validation', () => {

  // =========================================================================
  // VV-REQ-01: Auth flow produces valid JWT for all protected routes
  // =========================================================================
  describe('VV-REQ-01: Auth → JWT → Protected Routes', () => {
    it('should login as club (seeded demo account) and obtain a valid token', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'club@sport-ix.com', password: 'Club2024!' });

      expect(res.status).toBe(200);
      expect(res.body.data.token).toBeDefined();
      expect(res.body.data.user.role).toBe('club');
      expect(res.body.data.user.clubName).toBe('RC Toulon');
      clubToken = res.body.data.token;
    });

    it('should login as spectator (seeded demo account) and obtain a valid token', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'spectateur@sport-ix.com', password: 'Spectateur2024!' });

      expect(res.status).toBe(200);
      expect(res.body.data.token).toBeDefined();
      expect(res.body.data.user.role).toBe('spectator');
      spectatorToken = res.body.data.token;
    });

    it('should register a new user via /api/auth/register', async () => {
      const uniqueEmail = `vv-new-${Date.now()}@test.com`;
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: uniqueEmail,
          password: 'VvNew2024!',
          firstName: 'VV',
          lastName: 'NewUser',
        });

      expect(res.status).toBe(201);
      expect(res.body.data.token).toBeDefined();
      expect(res.body.data.user.role).toBe('spectator');
      expect(res.body.data.user.email).toBe(uniqueEmail);
    });

    it('should access /auth/me with club token', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${clubToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.email).toBe('club@sport-ix.com');
      expect(res.body.data.role).toBe('club');
    });

    it('should access /user/dashboard with spectator token', async () => {
      const res = await request(app)
        .get('/api/user/dashboard')
        .set('Authorization', `Bearer ${spectatorToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('should access /user/profile with spectator token', async () => {
      const res = await request(app)
        .get('/api/user/profile')
        .set('Authorization', `Bearer ${spectatorToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.email).toBe('spectateur@sport-ix.com');
    });
  });

  // =========================================================================
  // VV-REQ-02: Ticket scan updates status + creates scan log
  // =========================================================================
  describe('VV-REQ-02: Ticket Scan → Status Update + Scan Log', () => {
    it('should scan DEMO-VALID-TICKET and get valid status', async () => {
      // Re-seed the demo ticket to 'valid' status for this test
      const db = getDatabase();
      db.prepare("UPDATE tickets SET status = 'valid', scannedAt = NULL WHERE qrCode = 'REVNTy1WQUxJRC1USUNLRVQ='").run();

      const res = await request(app)
        .post('/api/scan/ticket')
        .set('Authorization', `Bearer ${clubToken}`)
        .send({ qrCode: 'REVNTy1WQUxJRC1USUNLRVQ=' }); // Base64 de 'DEMO-VALID-TICKET'

      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe('valid');
      expect(res.body.data.holderName).toBe('Jean Dupont');
      expect(res.body.data.seatInfo).toContain('Tribune A');
      expect(res.body.data.scannedAt).toBeDefined();

      // Verify DB state changed
      const ticket = db.prepare("SELECT status FROM tickets WHERE qrCode = 'REVNTy1WQUxJRC1USUNLRVQ='").get();
      expect(ticket.status).toBe('scanned');
    });

    it('should create a scan_log entry after scan', async () => {
      const db = getDatabase();
      const logs = db.prepare("SELECT * FROM scan_logs WHERE type = 'ticket' AND result = 'valid' ORDER BY id DESC LIMIT 1").get();
      expect(logs).toBeDefined();
      expect(logs.type).toBe('ticket');
      expect(logs.result).toBe('valid');
    });
  });

  // =========================================================================
  // VV-REQ-03: Credit scan debits balance atomically + creates scan log
  // =========================================================================
  describe('VV-REQ-03: Credit Scan → Atomic Debit + Scan Log', () => {
    it('should debit DEMO-CREDIT-OK and return correct balances', async () => {
      // Reset balance for deterministic test
      const db = getDatabase();
      db.prepare("UPDATE credits SET balance = 45.50 WHERE qrCode = 'REVNTy1DUkVESVQtT0s='").run();

      const res = await request(app)
        .post('/api/scan/credit')
        .set('Authorization', `Bearer ${clubToken}`)
        .send({ qrCode: 'REVNTy1DUkVESVQtT0s=', debitAmount: 10 }); // Base64 de 'DEMO-CREDIT-OK'

      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe('valid');
      expect(res.body.data.previousBalance).toBe(45.50);
      expect(res.body.data.newBalance).toBe(35.50);
      expect(res.body.data.amount).toBe(10);

      // Verify DB
      const credit = db.prepare("SELECT balance FROM credits WHERE qrCode = 'REVNTy1DUkVESVQtT0s='").get();
      expect(credit.balance).toBe(35.50);
    });

    it('should create a scan_log entry for credit scan', async () => {
      const db = getDatabase();
      // Get the most recent credit scan log for DEMO-CREDIT-OK
      const log = db.prepare(`
        SELECT * FROM scan_logs 
        WHERE type = 'credit' AND creditId = (SELECT id FROM credits WHERE qrCode = 'REVNTy1DUkVESVQtT0s=')
        ORDER BY id DESC LIMIT 1
      `).get();
      expect(log).toBeDefined();
      expect(log.result).toBe('valid');
      expect(log.type).toBe('credit');
    });
  });

  // =========================================================================
  // VV-REQ-04: Double-scan returns already_scanned
  // =========================================================================
  describe('VV-REQ-04: Double Scan → Rejection', () => {
    it('should reject a ticket that was already scanned', async () => {
      const res = await request(app)
        .post('/api/scan/ticket')
        .set('Authorization', `Bearer ${clubToken}`)
        .send({ qrCode: 'REVNTy1TQ0FOTkVELVRJQ0tFVA==' }); // Base64 de 'DEMO-SCANNED-TICKET'

      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe('already_scanned');
      expect(res.body.data.holderName).toBe('Jean Dupont');
    });
  });

  // =========================================================================
  // VV-REQ-05: Insufficient credit → no debit + error
  // =========================================================================
  describe('VV-REQ-05: Insufficient Credit → No Debit', () => {
    it('should reject credit scan when balance is too low', async () => {
      const db = getDatabase();
      const before = db.prepare("SELECT balance FROM credits WHERE qrCode = 'REVNTy1DUkVESVQtTE9X'").get();

      const res = await request(app)
        .post('/api/scan/credit')
        .set('Authorization', `Bearer ${clubToken}`)
        .send({ qrCode: 'REVNTy1DUkVESVQtTE9X', debitAmount: 100 }); // Base64 de 'DEMO-CREDIT-LOW'

      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe('insufficient');

      // Verify balance unchanged
      const after = db.prepare("SELECT balance FROM credits WHERE qrCode = 'REVNTy1DUkVESVQtTE9X'").get();
      expect(after.balance).toBe(before.balance);
    });
  });

  // =========================================================================
  // VV-REQ-06: Stats reflect real data
  // =========================================================================
  describe('VV-REQ-06: Stats Consistency', () => {
    it('should return stats from database', async () => {
      const res = await request(app).get('/api/stats');
      expect(res.status).toBe(200);

      const data = res.body.data;
      expect(data.tickets_sold).toBeDefined();
      expect(data.tickets_sold.value).toBeGreaterThan(0);
      expect(data.clubs_partners).toBeDefined();
      expect(data.spectators_registered).toBeDefined();
    });

    it('should return correct event count', async () => {
      const db = getDatabase();
      const dbCount = db.prepare('SELECT COUNT(*) as count FROM events').get().count;

      const res = await request(app).get('/api/events');
      expect(res.body.data.length).toBe(dbCount);
    });
  });

  // =========================================================================
  // VV-REQ-07: Unauthenticated access rejected everywhere
  // =========================================================================
  describe('VV-REQ-07: Auth Guard on All Protected Routes', () => {
    const protectedRoutes = [
      { method: 'get', path: '/api/auth/me' },
      { method: 'get', path: '/api/user/dashboard' },
      { method: 'get', path: '/api/user/profile' },
      { method: 'post', path: '/api/scan/ticket' },
      { method: 'post', path: '/api/scan/credit' },
    ];

    for (const route of protectedRoutes) {
      it(`should reject unauthenticated ${route.method.toUpperCase()} ${route.path}`, async () => {
        const res = await request(app)[route.method](route.path);
        expect([401, 403]).toContain(res.status);
      });
    }

    it('should reject requests with tampered token', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid.token.here');

      expect([401, 403]).toContain(res.status);
    });
  });
});
