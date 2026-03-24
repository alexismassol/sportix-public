#!/bin/bash
# ═══════════════════════════════════════════════════════════════════════════
# Setup Script — Sportix
# ═══════════════════════════════════════════════════════════════════════════
#
# Usage: ./scripts/setup.sh
#
# INSTALLATION:
#   - Node.js 22+ requis
#   - npm 10+ requis
#   - Angular CLI 21+ (optionnel, installé globalement)
#
# COMPOSANTS INSTALLÉS:
#   - Backend  : Node.js 22 + Express 4 + SQLite (better-sqlite3)
#   - Frontend : Angular 21.2.5 + TailwindCSS 3.4.1
#   - Tests    : Jest (backend) + Playwright (frontend)
#
# STRUCTURE:
#   - server/  : Backend API Express
#   - front/   : Frontend Angular
#   - docker/  : Configuration Docker
#   - scripts/ : Scripts d'automatisation
#
# APRÈS INSTALLATION:
#   - npm start                    : Lance backend + frontend
#   - npm run start:backend        : Backend seul
#   - npm run start:frontend       : Frontend seul
#   - ./scripts/start-docker.sh    : Version Docker
#
# ═══════════════════════════════════════════════════════════════════════════

set -e

echo "🏟️ Sportix - Installation"
echo "======================================="

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

echo ""
echo "📦 Installation des dépendances root..."
cd "$ROOT_DIR"
npm install

echo ""
echo "📦 Installation des dépendances backend..."
cd "$ROOT_DIR/server"
npm install

echo ""
echo "📦 Installation des dépendances frontend..."
cd "$ROOT_DIR/front"
npm install

echo ""
echo "🗄️  Initialisation de la base de données..."
cd "$ROOT_DIR/server"
node src/database/seed.js

echo ""
echo "✅ Installation terminée !"
echo ""
echo "Lancer l'application :"
echo "  cd $ROOT_DIR && npm start"
echo ""
echo "  Backend  → http://localhost:3000"
echo "  Frontend → http://localhost:4200"
