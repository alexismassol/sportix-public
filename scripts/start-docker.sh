#!/bin/bash
# ═══════════════════════════════════════════════════════════════════════════
# Docker Start Script - Sportix
# ═══════════════════════════════════════════════════════════════════════════
#
# Usage: ./scripts/start-docker.sh [OPTIONS]
#
# OPTIONS:
#   -d, --detach    : Lance en arrière-plan (détaché)
#   --build-only    : Build seulement, ne lance pas
#   --no-build      : Lance sans rebuild (plus rapide)
#   --frontend      : Lance seulement le frontend
#   --backend       : Lance seulement le backend
#   --dev           : Mode développement (rebuild automatique)
#   --prod          : Mode production (build optimisé)
#
# MODE PAR DÉFAUT: Interactif (avec Ctrl+C pour arrêter)
#   - docker-compose up --build
#   - Logs visibles en direct
#
# MODE DÉTACHÉ: Arrière-plan
#   - docker-compose up --build -d
#   - Conteneurs persistants
#
# MODE SÉLECTIF:
#   - --frontend  : Uniquement frontend Angular
#   - --backend   : Uniquement backend Node.js
#
# SERVICES:
#   - backend  : Node.js 22 + Express (port 3000)
#   - frontend : Angular 21.2.5 (port 4200)
#
# RÉSEAUX:
#   - Backend accessible depuis mobile: http://IP_LOCALE:3000
#   - Frontend accessible depuis mobile: http://IP_LOCALE:4200
#   - Communication inter-conteneurs: http://backend:3000
#
# VOLUMES:
#   - sportix-data : Persiste la base SQLite
#   - front/dist   : Build Angular pour développement
#
# ENVIRONNEMENT:
#   - API_URL=http://backend:3000 (pour le frontend)
#   - NODE_ENV=development (pour le backend)
#
# ═══════════════════════════════════════════════════════════════════════════

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

echo ""
echo "🐳 Sportix - Docker"
echo "================================"
echo ""

# Detect local IP for Flutter / mobile
LOCAL_IP=$(ifconfig 2>/dev/null | grep "inet " | grep -v 127.0.0.1 | head -1 | awk '{print $2}' || hostname -I 2>/dev/null | awk '{print $1}' || echo "")

echo "📋 Configuration :"
echo "  Backend  → http://localhost:3000"
echo "  Frontend → http://localhost:4200"
if [ -n "$LOCAL_IP" ]; then
  echo "  Réseau   → http://$LOCAL_IP:3000  (pour Flutter / mobile)"
fi
echo ""

cd "$ROOT_DIR/docker"

# Parse options
DETACH=false
BUILD_ONLY=false
NO_BUILD=false
FRONTEND_ONLY=false
BACKEND_ONLY=false
COMPOSE_SERVICES=""

for arg in "$@"; do
  case $arg in
    -d|--detach)
      DETACH=true
      ;;
    --build-only)
      BUILD_ONLY=true
      ;;
    --no-build)
      NO_BUILD=true
      ;;
    --frontend)
      FRONTEND_ONLY=true
      COMPOSE_SERVICES="frontend"
      ;;
    --backend)
      BACKEND_ONLY=true
      COMPOSE_SERVICES="backend"
      ;;
    --dev)
      echo "🔧 Mode développement activé"
      ;;
    --prod)
      echo "🚀 Mode production activé"
      ;;
  esac
done

# Build only mode
if [ "$BUILD_ONLY" = true ]; then
  echo "🔨 Build seulement..."
  if [ -n "$COMPOSE_SERVICES" ]; then
    docker-compose build $COMPOSE_SERVICES
  else
    docker-compose build
  fi
  exit 0
fi

# Service selection
if [ -n "$COMPOSE_SERVICES" ]; then
  echo "🎯 Lancement du service: $COMPOSE_SERVICES"
  if [ "$DETACH" = true ]; then
    if [ "$NO_BUILD" = true ]; then
      docker-compose up -d $COMPOSE_SERVICES
    else
      docker-compose up --build -d $COMPOSE_SERVICES
    fi
  else
    if [ "$NO_BUILD" = true ]; then
      docker-compose up $COMPOSE_SERVICES
    else
      docker-compose up --build $COMPOSE_SERVICES
    fi
  fi
  exit 0
fi

# Mode détaché avec -d, sinon interactif
if [ "$DETACH" = true ]; then
  echo "🔨 Build et lancement en arrière-plan..."
  if [ "$NO_BUILD" = true ]; then
    docker-compose up -d
  else
    docker-compose up --build -d
  fi
  echo ""
  echo "✅ Conteneurs lancés en arrière-plan !"
  echo ""
  echo "Commandes utiles :"
  echo "  docker-compose -f $ROOT_DIR/docker/docker-compose.yml logs -f   # Voir les logs"
  echo "  docker-compose -f $ROOT_DIR/docker/docker-compose.yml down       # Arrêter"
else
  echo "🔨 Build et lancement des conteneurs..."
  echo "   (Ctrl+C pour arrêter)"
  echo ""
  if [ "$NO_BUILD" = true ]; then
    docker-compose up
  else
    docker-compose up --build
  fi
fi
