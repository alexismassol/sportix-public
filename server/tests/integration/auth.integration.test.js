import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import app from '../../src/index.js';

const UID = Date.now();

describe('Auth — Integration Tests', () => {
  let server;

  beforeAll((done) => {
    process.env.NODE_ENV = 'test';
    server = app.listen(0, done);
  });

  afterAll((done) => {
    server.close(done);
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const email = `newuser-${UID}@test.com`;
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email,
          password: 'TestPassword123!',
          firstName: 'Test',
          lastName: 'User'
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
      expect(res.body.data.user.email).toBe(email);
      expect(res.body.data.user.role).toBe('spectator');
    });

    it('should reject registration with missing fields', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ email: `incomplete-${UID}@test.com` });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should reject registration with short password', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: `short-${UID}@test.com`,
          password: '123',
          firstName: 'Short',
          lastName: 'Pass'
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should reject duplicate email', async () => {
      const dupEmail = `dup-${UID}@test.com`;
      // First registration
      await request(app)
        .post('/api/auth/register')
        .send({
          email: dupEmail,
          password: 'TestPassword123!',
          firstName: 'First',
          lastName: 'User'
        });

      // Duplicate
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: dupEmail,
          password: 'TestPassword123!',
          firstName: 'Second',
          lastName: 'User'
        });

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login with valid credentials', async () => {
      const email = `login-${UID}@test.com`;
      // Register first
      await request(app)
        .post('/api/auth/register')
        .send({
          email,
          password: 'TestPassword123!',
          firstName: 'Login',
          lastName: 'User'
        });

      const res = await request(app)
        .post('/api/auth/login')
        .send({ email, password: 'TestPassword123!' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
      expect(res.body.data.user.email).toBe(email);
    });

    it('should reject invalid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: `login-${UID}@test.com`,
          password: 'WrongPassword!'
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should reject login with missing fields', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({});

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/auth/me', () => {
    it('should return user profile with valid token', async () => {
      const email = `me-${UID}@test.com`;
      const regRes = await request(app)
        .post('/api/auth/register')
        .send({
          email,
          password: 'TestPassword123!',
          firstName: 'Me',
          lastName: 'User'
        });

      const token = regRes.body.data.token;

      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.email).toBe(email);
    });

    it('should reject request without token', async () => {
      const res = await request(app)
        .get('/api/auth/me');

      expect(res.status).toBe(401);
    });

    it('should reject request with invalid token', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token');

      expect(res.status).toBe(403);
    });
  });
});
