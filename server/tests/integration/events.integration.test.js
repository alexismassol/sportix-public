import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import app from '../../src/index.js';

describe('Events — Integration Tests', () => {
  let server;

  beforeAll((done) => {
    process.env.NODE_ENV = 'test';
    server = app.listen(0, done);
  });

  afterAll((done) => {
    server.close(done);
  });

  describe('GET /api/events', () => {
    it('should return a list of events', async () => {
      const res = await request(app).get('/api/events');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('should filter events by sport type', async () => {
      const res = await request(app).get('/api/events?sport=Rugby');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      for (const event of res.body.data) {
        expect(event.sportType).toBe('Rugby');
      }
    });

    it('should filter events by status', async () => {
      const res = await request(app).get('/api/events?status=upcoming');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      for (const event of res.body.data) {
        expect(event.status).toBe('upcoming');
      }
    });
  });

  describe('GET /api/events/:id', () => {
    it('should return 404 for unknown event', async () => {
      const res = await request(app).get('/api/events/unknown-id');

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });
});
