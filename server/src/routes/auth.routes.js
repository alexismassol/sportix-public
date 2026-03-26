import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { getDatabase } from '../database/db.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = '24h';
const SALT_ROUNDS = 10;

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email et mot de passe requis' });
    }

    const db = getDatabase();
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);

    if (!user) {
      return res.status(401).json({ success: false, error: 'Identifiants incorrects' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ success: false, error: 'Identifiants incorrects' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, clubName: user.clubName },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    const { password: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      data: {
        token,
        user: userWithoutPassword
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ success: false, error: 'Tous les champs sont requis' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, error: 'Email invalide' });
    }

    if (password.length < 8) {
      return res.status(400).json({ success: false, error: 'Le mot de passe doit contenir au moins 8 caractères' });
    }

    const db = getDatabase();
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);

    if (existing) {
      return res.status(409).json({ success: false, error: 'Cet email est déjà utilisé' });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const id = uuidv4();

    db.prepare(
      'INSERT INTO users (id, email, password, firstName, lastName, role) VALUES (?, ?, ?, ?, ?, ?)'
    ).run(id, email, hashedPassword, firstName, lastName, 'spectator');

    const token = jwt.sign(
      { id, email, role: 'spectator', clubName: null },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.status(201).json({
      success: true,
      data: {
        token,
        user: { id, email, firstName, lastName, role: 'spectator', clubName: null }
      }
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// GET /api/auth/me
router.get('/me', authenticateToken, (req, res) => {
  try {
    const db = getDatabase();
    const user = db.prepare('SELECT id, email, firstName, lastName, role, clubName, createdAt FROM users WHERE id = ?').get(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, error: 'Utilisateur non trouvé' });
    }

    res.json({ success: true, data: user });
  } catch (err) {
    console.error('Me error:', err);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

export default router;
