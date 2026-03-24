#!/bin/bash
# ═══════════════════════════════════════════════════════════════════════════
# Docker Stop Script — Sportix Public Demo
# ═══════════════════════════════════════════════════════════════════════════
#
# Usage: ./scripts/stop-docker.sh [OPTIONS]
#
# OPTIONS:
#   -c, --clean     : Arrête + nettoie les images Docker
#   --volumes       : Arrête + supprime les volumes
#   --all           : Arrête + nettoie tout (images + volumes)
#
# MODE PAR DÉFAUT: Arrêt simple
#   - docker-compose down
#   - Préserve les images et volumes
#
# MODE CLEAN: Nettoyage complet
#   - docker-compose down --rmi all
#   - Supprime les images buildées
#
# MODE VOLUMES: Nettoyage des données
#   - docker-compose down --volumes
#   - Supprime la base SQLite (attention !)
#
# SERVICES:
#   - backend  : Node.js 22 + Express
#   - frontend : Angular 21.2.5
#
# VOLUMES IMPACTÉS:
#   - sportix-data : Contient la base SQLite sportix.db
#
# ═══════════════════════════════════════════════════════════════════════════

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

echo ""
echo "🛑 Sportix Public Demo — Arrêt Docker"
echo "======================================"
echo ""

cd "$ROOT_DIR/docker"

# Vérifier si des conteneurs sont en cours
if docker-compose ps -q | grep -q .; then
  echo "🔄 Arrêt des conteneurs en cours..."
  docker-compose down
  
  echo ""
  echo "✅ Conteneurs arrêtés avec succès !"
  echo ""
  
  # Option : nettoyer les images si demandé
  if [ "$1" = "--clean" ] || [ "$1" = "-c" ]; then
    echo "🧹 Nettoyage des images Docker (option --clean)..."
    docker-compose down --rmi all
    echo "✅ Images nettoyées !"
    echo ""
  fi
  
  echo "📋 État des conteneurs :"
  docker-compose ps
else
  echo "ℹ️  Aucun conteneur en cours d'exécution"
fi

echo ""
echo "🔧 Commandes utiles :"
echo "  docker-compose ps                    # Voir l'état"
echo "  docker-compose logs -f               # Voir les logs"
echo "  docker-compose down --volumes        # Arrêter + supprimer volumes"
echo "  docker system prune -f               # Nettoyer tout Docker"
echo ""
