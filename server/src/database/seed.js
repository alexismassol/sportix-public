import { getDatabase, closeDatabase } from './db.js';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

const SALT_ROUNDS = 10;

async function seed() {
  console.log('🌱 Seeding database...');

  const db = getDatabase();

  // Clear existing data
  db.exec('DELETE FROM scan_logs');
  db.exec('DELETE FROM credits');
  db.exec('DELETE FROM tickets');
  db.exec('DELETE FROM events');
  db.exec('DELETE FROM users');
  db.exec('DELETE FROM stats');

  // === Users ===
  const spectatorId = uuidv4();
  const clubId = uuidv4();

  const spectatorPassword = await bcrypt.hash('Spectateur2024!', SALT_ROUNDS);
  const clubPassword = await bcrypt.hash('Club2024!', SALT_ROUNDS);

  const insertUser = db.prepare(
    'INSERT INTO users (id, email, password, firstName, lastName, role, clubName) VALUES (?, ?, ?, ?, ?, ?, ?)'
  );

  insertUser.run(spectatorId, 'spectateur@sport-ix.com', spectatorPassword, 'Jean', 'Dupont', 'spectator', null);
  insertUser.run(clubId, 'club@sport-ix.com', clubPassword, 'Admin', 'Club', 'club', 'RC Toulon');

  console.log('  ✅ 2 utilisateurs créés');

  // === Events ===
  const events = [
    { title: 'RC Toulon vs Stade Français', sportType: 'Rugby', date: '2026-04-15T20:00:00Z', location: 'Stade Mayol, Toulon', clubName: 'RC Toulon', ticketsSold: 12800, maxCapacity: 15000, price: 25, status: 'upcoming' },
    { title: 'ASSE vs OL — Derby', sportType: 'Football', date: '2026-04-20T21:00:00Z', location: 'Geoffroy-Guichard, Saint-Étienne', clubName: 'AS Saint-Étienne', ticketsSold: 38200, maxCapacity: 42000, price: 35, status: 'upcoming' },
    { title: 'PSG Handball vs Montpellier', sportType: 'Handball', date: '2026-04-22T20:30:00Z', location: 'Stade Pierre de Coubertin, Paris', clubName: 'PSG Handball', ticketsSold: 3400, maxCapacity: 4500, price: 15, status: 'upcoming' },
    { title: 'Étoile de Bessèges — Étape 3', sportType: 'Cyclisme', date: '2026-04-25T14:00:00Z', location: 'Bessèges', clubName: 'Organisation Bessèges', ticketsSold: 800, maxCapacity: 2000, price: 10, status: 'upcoming' },
    { title: 'Tournoi Open de Tennis', sportType: 'Tennis', date: '2026-04-28T10:00:00Z', location: 'Roland Garros, Paris', clubName: 'FFT', ticketsSold: 8900, maxCapacity: 15000, price: 45, status: 'upcoming' },
    { title: 'Meeting d\'Athlétisme', sportType: 'Athlétisme', date: '2026-05-01T15:00:00Z', location: 'Stade Charléty, Paris', clubName: 'Stade Charléty', ticketsSold: 4200, maxCapacity: 5000, price: 20, status: 'upcoming' },
    { title: 'France vs Angleterre', sportType: 'Rugby', date: '2026-05-05T21:00:00Z', location: 'Stade de France, Paris', clubName: 'FFR', ticketsSold: 78500, maxCapacity: 80000, price: 55, status: 'upcoming' },
    { title: 'Finale Coupe de France', sportType: 'Football', date: '2026-05-10T21:00:00Z', location: 'Stade de France, Paris', clubName: 'FFF', ticketsSold: 72000, maxCapacity: 80000, price: 40, status: 'upcoming' },
  ];

  const insertEvent = db.prepare(
    'INSERT INTO events (id, title, sportType, date, location, clubName, ticketsSold, maxCapacity, price, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
  );

  const eventIds = [];
  for (const event of events) {
    const id = uuidv4();
    eventIds.push(id);
    insertEvent.run(id, event.title, event.sportType, event.date, event.location, event.clubName, event.ticketsSold, event.maxCapacity, event.price, event.status);
  }

  console.log(`  ✅ ${events.length} événements créés`);

  // === Tickets (for the spectator, on the first 3 events) ===
  const insertTicket = db.prepare(
    'INSERT INTO tickets (id, eventId, userId, qrCode, status, holderName, seatInfo) VALUES (?, ?, ?, ?, ?, ?, ?)'
  );

  const demoTickets = [
    { qrCode: 'DEMO-VALID-TICKET', status: 'valid', seatInfo: 'Tribune A — Rang 5, Place 12', eventIndex: 0 },
    { qrCode: 'DEMO-SCANNED-TICKET', status: 'scanned', seatInfo: 'Tribune B — Rang 3, Place 8', eventIndex: 1 },
    { qrCode: 'DEMO-REFUNDED-TICKET', status: 'refunded', seatInfo: 'Tribune C — Rang 10, Place 22', eventIndex: 2 },
    { qrCode: 'SPORTIX-TICKET-VALID-2', status: 'valid', seatInfo: 'Pelouse — Entrée libre', eventIndex: 0 },
    { qrCode: 'SPORTIX-TICKET-VIP', status: 'valid', seatInfo: 'VIP — Loge 4', eventIndex: 1 },
  ];

  for (const t of demoTickets) {
    const ticketId = uuidv4();
    insertTicket.run(ticketId, eventIds[t.eventIndex], spectatorId, t.qrCode, t.status, 'Jean Dupont', t.seatInfo);
  }

  console.log('  ✅ 5 billets créés');

  // === Credits (for the spectator) ===
  const creditId = uuidv4();
  db.prepare('INSERT INTO credits (id, userId, balance, qrCode) VALUES (?, ?, ?, ?)').run(creditId, spectatorId, 45.50, 'DEMO-CREDIT-OK');

  // Second credit wallet with low balance for demo
  const creditId2 = uuidv4();
  db.prepare('INSERT INTO credits (id, userId, balance, qrCode) VALUES (?, ?, ?, ?)').run(creditId2, spectatorId, 2.00, 'DEMO-CREDIT-LOW');

  console.log('  ✅ 1 crédit wallet créé (45.50€)');

  // === Stats ===
  const insertStat = db.prepare('INSERT INTO stats (key, value, label) VALUES (?, ?, ?)');
  insertStat.run('tickets_sold', 12500, 'Billets vendus');
  insertStat.run('clubs_partners', 45, 'Clubs partenaires');
  insertStat.run('spectators_registered', 8200, 'Spectateurs inscrits');
  insertStat.run('events_organized', 320, 'Événements organisés');
  insertStat.run('satisfaction_rate', 98, 'Taux de satisfaction (%)');

  console.log('  ✅ 5 statistiques créées');

  closeDatabase();
  console.log('\n✅ Seed terminé avec succès !');
}

seed().catch(err => {
  console.error('❌ Erreur lors du seed :', err);
  process.exit(1);
});
