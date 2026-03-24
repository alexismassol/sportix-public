-- ============================================
-- Schema SQLite — Sportix
-- ============================================

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  firstName TEXT NOT NULL,
  lastName TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'spectator',
  clubName TEXT,
  createdAt TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS events (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  sportType TEXT NOT NULL,
  date TEXT NOT NULL,
  location TEXT NOT NULL,
  clubName TEXT NOT NULL,
  ticketsSold INTEGER NOT NULL DEFAULT 0,
  maxCapacity INTEGER NOT NULL DEFAULT 500,
  price REAL NOT NULL DEFAULT 20.0,
  status TEXT NOT NULL DEFAULT 'upcoming',
  description TEXT,
  imageUrl TEXT
);

CREATE TABLE IF NOT EXISTS tickets (
  id TEXT PRIMARY KEY,
  eventId TEXT NOT NULL,
  userId TEXT NOT NULL,
  qrCode TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'valid',
  holderName TEXT,
  seatInfo TEXT,
  scannedAt TEXT,
  createdAt TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (eventId) REFERENCES events(id),
  FOREIGN KEY (userId) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS credits (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL,
  balance REAL NOT NULL DEFAULT 0,
  qrCode TEXT NOT NULL UNIQUE,
  FOREIGN KEY (userId) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS stats (
  key TEXT PRIMARY KEY,
  value INTEGER NOT NULL,
  label TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS scan_logs (
  id TEXT PRIMARY KEY,
  ticketId TEXT,
  creditId TEXT,
  eventId TEXT NOT NULL,
  scannerId TEXT NOT NULL,
  type TEXT NOT NULL,
  result TEXT NOT NULL,
  scannedAt TEXT NOT NULL DEFAULT (datetime('now'))
);
