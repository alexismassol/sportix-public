import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getTestDatabase } from '../../src/database/db.js';

const JWT_SECRET = 'sportix-demo-jwt-secret-2024';

describe('Auth - Unit Tests', () => {
  let db;

  beforeAll(async () => {
    db = getTestDatabase();
    const hashedPassword = await bcrypt.hash('Spectateur2024!', 10);
    db.prepare('INSERT INTO users (id, email, password, firstName, lastName, role) VALUES (?, ?, ?, ?, ?, ?)').run(
      'test-user-1', 'spectateur@sport-ix.com', hashedPassword, 'Jean', 'Dupont', 'spectator'
    );
  });

  afterAll(() => {
    db.close();
  });

  it('should hash passwords with bcrypt', async () => {
    const hash = await bcrypt.hash('Spectateur2024!', 10);
    expect(hash).toBeDefined();
    expect(hash).not.toBe('Spectateur2024!');
    expect(hash.startsWith('$2a$') || hash.startsWith('$2b$')).toBe(true);
  });

  it('should compare passwords correctly', async () => {
    const hash = await bcrypt.hash('Spectateur2024!', 10);
    const isValid = await bcrypt.compare('Spectateur2024!', hash);
    const isInvalid = await bcrypt.compare('wrongpassword', hash);
    expect(isValid).toBe(true);
    expect(isInvalid).toBe(false);
  });

  it('should generate valid JWT tokens', () => {
    const payload = { id: 'test-user-1', email: 'spectateur@sport-ix.com', role: 'spectator' };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
    expect(token).toBeDefined();

    const decoded = jwt.verify(token, JWT_SECRET);
    expect(decoded.id).toBe('test-user-1');
    expect(decoded.email).toBe('spectateur@sport-ix.com');
    expect(decoded.role).toBe('spectator');
  });

  it('should reject invalid JWT tokens', () => {
    expect(() => {
      jwt.verify('invalid-token', JWT_SECRET);
    }).toThrow();
  });

  it('should find user by email in database', () => {
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get('spectateur@sport-ix.com');
    expect(user).toBeDefined();
    expect(user.firstName).toBe('Jean');
    expect(user.lastName).toBe('Dupont');
    expect(user.role).toBe('spectator');
  });

  it('should return null for unknown email', () => {
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get('unknown@test.com');
    expect(user).toBeUndefined();
  });
});
