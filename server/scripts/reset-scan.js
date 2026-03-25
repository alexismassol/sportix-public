#!/usr/bin/env node

// ============================================
// Reset Scan Script
// Réinitialise les tickets ET crédits démo pour les tests
// ============================================

import { getDatabase } from '../src/database/db.js';

console.log('🔄 Réinitialisation des tickets ET crédits démo...');

const db = getDatabase();

// Reset les tickets démo à 'valid'
const demoTickets = [
  'REVNTy1WQUxJRC1USUNLRVQ=',  // DEMO-VALID-TICKET
  'U1BPUlRJWC1USUNLRVQtVkFMSUQtMg==', // SPORTIX-TICKET-VALID-2
];

try {
  for (const qrCode of demoTickets) {
    const result = db.prepare(`
      UPDATE tickets 
      SET status = 'valid', scannedAt = NULL 
      WHERE qrCode = ?
    `).run(qrCode);
    
    console.log(`  ✅ Ticket ${qrCode.substring(0, 15)}... réinitialisé`);
  }
  
  // Reset crédits démo
  db.prepare("UPDATE credits SET balance = 45.50 WHERE qrCode = 'REVNTy1DUkVESVQtT0s='").run();
  db.prepare("UPDATE credits SET balance = 2.00 WHERE qrCode = 'REVNTy1DUkVESVQtTE9X'").run();
  
  console.log('  ✅ Crédits démo réinitialisés');
  console.log('\n🎯 Tickets ET crédits démo prêts pour de nouveaux scans !');
  
} catch (err) {
  console.error('❌ Erreur lors de la réinitialisation des scans :', err);
  process.exit(1);
}

process.exit(0);
