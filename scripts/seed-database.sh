#!/bin/bash
# ═══════════════════════════════════════════════════════════════════════════
# Seed Database Script — Sportix Public Demo
# ═══════════════════════════════════════════════════════════════════════════
#
# Usage: ./scripts/seed-database.sh
#
# BASE DE DONNÉES:
#   - SQLite avec better-sqlite3
#   - Fichier: server/src/data/sportix.db
#
# DONNÉES DÉMO CRÉÉES:
#   - 2 utilisateurs démo:
#     * spectateur@sport-ix.com / Spectateur2024!
#     * club@sport-ix.com / Club2024!
#   - 5 événements sportifs variés
#   - Clubs et billets de démonstration
#
# TABLES:
#   - users      : Utilisateurs (spectateurs, clubs)
#   - events     : Événements sportifs
#   - tickets    : Billets achetés
#   - credits    : Crédits club
#
# SÉCURITÉ:
#   - Mots de passe hashés avec bcryptjs
#   - JWT secret configuré
#
# APRÈS SEED:
#   - Base prête pour démo
#   - Connexion possible avec comptes démo
#   - API fonctionnelle
#
# ═══════════════════════════════════════════════════════════════════════════

set -e

echo "🗄️  Sportix Public Demo — Seed Database"
echo "========================================="

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

cd "$ROOT_DIR/server"

echo ""
echo "📦 Vérification des dépendances..."
if [ ! -d "node_modules" ]; then
  echo "⚠️  node_modules manquant, installation..."
  npm install
fi

echo ""
echo "🌱 Seed de la base de données..."
node src/database/seed.js

echo ""
echo "✅ Base de données initialisée !"
echo "   Fichier : server/src/data/sportix-demo.db"
