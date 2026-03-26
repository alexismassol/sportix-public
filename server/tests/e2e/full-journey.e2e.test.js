import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import app from '../../src/index.js';

const UID = Date.now();

describe('Full Journey — E2E Tests', () => {
  let server;
  let spectatorToken;
  let clubToken;

  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    server = await new Promise((resolve) => {
      const s = app.listen(0, () => resolve(s));
    });
  });

  afterAll((done) => {
    server.close(done);
  });

  it('Step 1: Health check', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('ok');
  });

  it('Step 2: Get global stats', async () => {
    const res = await request(app).get('/api/stats');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('Step 3: List events', async () => {
    const res = await request(app).get('/api/events');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('Step 4: Register as spectator', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: `e2e-spec-${UID}@test.com`,
        password: 'E2ETest2024!',
        firstName: 'E2E',
        lastName: 'Spectator'
      });

    expect(res.status).toBe(201);
    spectatorToken = res.body.data.token;
  });

  it('Step 5: Login as seeded club account', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'club@sport-ix.com', password: 'Club2024!' });

    expect(res.status).toBe(200);
    expect(res.body.data.user.role).toBe('club');
    clubToken = res.body.data.token;
  });

  it('Step 6: Get spectator profile', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${spectatorToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.email).toBe(`e2e-spec-${UID}@test.com`);
  });

  it('Step 7: Get spectator dashboard', async () => {
    const res = await request(app)
      .get('/api/user/dashboard')
      .set('Authorization', `Bearer ${spectatorToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.stats).toBeDefined();
  });

  it('Step 8: Scan invalid ticket', async () => {
    const res = await request(app)
      .post('/api/scan/ticket')
      .set('Authorization', `Bearer ${clubToken}`)
      .send({ qrCode: 'SUJQRUNtRVZFTlRfUExBTk5FRA==' }); // Base64 valide mais ticket inexistant

    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('invalid');
  });

  it('Step 9: Scan invalid credit', async () => {
    const res = await request(app)
      .post('/api/scan/credit')
      .set('Authorization', `Bearer ${clubToken}`)
      .send({ qrCode: 'Q1JFSURUQ1JFQRlWRU5U' }); // Base64 valide mais crédit inexistant

    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('invalid');
  });

  it('Step 10: 404 for unknown route', async () => {
    const res = await request(app).get('/api/unknown');
    expect(res.status).toBe(404);
  });
});
