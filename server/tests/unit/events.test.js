import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { getTestDatabase } from '../../src/database/db.js';

describe('Events — Unit Tests', () => {
  let db;

  beforeAll(() => {
    db = getTestDatabase();

    const insertEvent = db.prepare(
      'INSERT INTO events (id, title, sportType, date, location, clubName, ticketsSold, maxCapacity, price, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
    );

    insertEvent.run('evt-1', 'RC Toulon vs Stade Français', 'Rugby', '2026-04-15T20:00:00Z', 'Stade Mayol, Toulon', 'RC Toulon', 12800, 15000, 25, 'upcoming');
    insertEvent.run('evt-2', 'ASSE vs OL', 'Football', '2026-04-20T21:00:00Z', 'Geoffroy-Guichard', 'ASSE', 38200, 42000, 35, 'upcoming');
    insertEvent.run('evt-3', 'Meeting Athlétisme', 'Athlétisme', '2026-05-01T15:00:00Z', 'Charléty', 'Stade Charléty', 4200, 5000, 20, 'completed');
  });

  afterAll(() => {
    db.close();
  });

  it('should list all events', () => {
    const events = db.prepare('SELECT * FROM events ORDER BY date ASC').all();
    expect(events).toHaveLength(3);
  });

  it('should filter events by sport type', () => {
    const rugbyEvents = db.prepare('SELECT * FROM events WHERE sportType = ?').all('Rugby');
    expect(rugbyEvents).toHaveLength(1);
    expect(rugbyEvents[0].title).toBe('RC Toulon vs Stade Français');
  });

  it('should filter events by status', () => {
    const upcomingEvents = db.prepare('SELECT * FROM events WHERE status = ?').all('upcoming');
    expect(upcomingEvents).toHaveLength(2);

    const completedEvents = db.prepare('SELECT * FROM events WHERE status = ?').all('completed');
    expect(completedEvents).toHaveLength(1);
  });

  it('should find event by id', () => {
    const event = db.prepare('SELECT * FROM events WHERE id = ?').get('evt-1');
    expect(event).toBeDefined();
    expect(event.title).toBe('RC Toulon vs Stade Français');
    expect(event.price).toBe(25);
  });

  it('should return undefined for unknown event id', () => {
    const event = db.prepare('SELECT * FROM events WHERE id = ?').get('unknown-id');
    expect(event).toBeUndefined();
  });

  it('should have correct schema fields', () => {
    const event = db.prepare('SELECT * FROM events WHERE id = ?').get('evt-1');
    expect(event).toHaveProperty('id');
    expect(event).toHaveProperty('title');
    expect(event).toHaveProperty('sportType');
    expect(event).toHaveProperty('date');
    expect(event).toHaveProperty('location');
    expect(event).toHaveProperty('clubName');
    expect(event).toHaveProperty('ticketsSold');
    expect(event).toHaveProperty('maxCapacity');
    expect(event).toHaveProperty('price');
    expect(event).toHaveProperty('status');
  });
});
