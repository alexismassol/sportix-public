import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import app from '../../src/index.js';

const UID = Date.now();

describe('User — Integration Tests', () => {
  let server;
  let authToken;

  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    server = await new Promise((resolve) => {
      const s = app.listen(0, () => resolve(s));
    });

    // Register a user and get token
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: `usertest-${UID}@test.com`,
        password: 'TestPassword123!',
        firstName: 'User',
        lastName: 'Test'
      });

    authToken = res.body.data.token;
  });

  afterAll((done) => {
    server.close(done);
  });

  describe('GET /api/user/dashboard', () => {
    it('should return dashboard data for authenticated user', async () => {
      const res = await request(app)
        .get('/api/user/dashboard')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.stats).toBeDefined();
      expect(res.body.data.stats).toHaveProperty('ticketsBought');
      expect(res.body.data.stats).toHaveProperty('eventsAttended');
      expect(res.body.data.stats).toHaveProperty('creditsBalance');
      expect(res.body.data.stats).toHaveProperty('loyaltyPoints');
    });

    it('should reject unauthenticated request', async () => {
      const res = await request(app).get('/api/user/dashboard');
      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/user/profile', () => {
    it('should return profile for authenticated user', async () => {
      const res = await request(app)
        .get('/api/user/profile')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.email).toBe(`usertest-${UID}@test.com`);
      expect(res.body.data.firstName).toBe('User');
      expect(res.body.data.stats).toBeDefined();
    });

    it('should reject unauthenticated request', async () => {
      const res = await request(app).get('/api/user/profile');
      expect(res.status).toBe(401);
    });
  });
});
