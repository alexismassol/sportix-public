#!/bin/bash
# ═══════════════════════════════════════════════════════════════════════════
# Docker Clean Script — Sportix
# ═══════════════════════════════════════════════════════════════════════════
#
# Usage: ./scripts/clean-docker.sh [OPTIONS]
#
# OPTIONS:
#   --all           : Nettoyage complet (images + volumes + cache)
#   --images        : Nettoyage des images seulement
#   --volumes       : Nettoyage des volumes seulement
#   --cache         : Nettoyage du cache build seulement
#   --force         : Force le nettoyage sans confirmation
#
# MODE PAR DÉFAUT: Nettoyage modéré
#   - Conteneurs arrêtés
#   - Images non utilisées
#   - Cache build
#
# MODE AGRESSIF (--all):
#   - Supprime TOUT ce qui est lié au projet
#   - Y compris les volumes de données (attention !)
#
# ═══════════════════════════════════════════════════════════════════════════

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

echo ""
echo "🧹 Sportix — Nettoyage Docker"
echo "========================================="
echo ""

cd "$ROOT_DIR/docker"

# Parse options
CLEAN_ALL=false
CLEAN_IMAGES=false
CLEAN_VOLUMES=false
CLEAN_CACHE=false
FORCE=false

for arg in "$@"; do
  case $arg in
    --all)
      CLEAN_ALL=true
      ;;
    --images)
      CLEAN_IMAGES=true
      ;;
    --volumes)
      CLEAN_VOLUMES=true
      ;;
    --cache)
      CLEAN_CACHE=true
      ;;
    --force)
      FORCE=true
      ;;
  esac
done

# Confirmation pour nettoyage agressif
if [ "$CLEAN_ALL" = true ] && [ "$FORCE" = false ]; then
  echo "⚠️  ATTENTION: --all va supprimer TOUT y compris les données !"
  echo "   Les volumes de données seront perdus."
  echo ""
  read -p "   Confirmer ? (y/N): " -n 1 -r
  echo ""
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Annulé"
    exit 0
  fi
fi

echo "🔄 Nettoyage en cours..."

# Arrêter et supprimer les conteneurs
echo "  📦 Arrêt des conteneurs..."
docker-compose down --remove-orphans 2>/dev/null || true

# Nettoyage sélectif
if [ "$CLEAN_ALL" = true ]; then
  echo "  🗑️  Nettoyage complet (--all)..."
  docker-compose down --rmi all --volumes --remove-orphans 2>/dev/null || true
  docker system prune -af --volumes 2>/dev/null || true
elif [ "$CLEAN_IMAGES" = true ]; then
  echo "  🖼️  Nettoyage des images..."
  docker-compose down --rmi all 2>/dev/null || true
  docker image prune -af 2>/dev/null || true
elif [ "$CLEAN_VOLUMES" = true ]; then
  echo "  💾 Nettoyage des volumes..."
  docker-compose down --volumes 2>/dev/null || true
  docker volume prune -f 2>/dev/null || true
elif [ "$CLEAN_CACHE" = true ]; then
  echo "  🗄️  Nettoyage du cache..."
  docker builder prune -af 2>/dev/null || true
else
  echo "  🧹 Nettoyage modéré..."
  docker-compose down --rmi local 2>/dev/null || true
  docker system prune -f 2>/dev/null || true
fi

echo ""
echo "✅ Nettoyage terminé !"
echo ""

# Espace libéré
echo "📊 Espace disque libéré :"
docker system df 2>/dev/null || echo "   (Docker non disponible)"

echo ""
echo "🔧 Commandes utiles :"
echo "  docker system df                    # Voir l'utilisation"
echo "  docker system prune -f             # Nettoyage léger"
echo "  docker system prune -af --volumes  # Nettoyage agressif"
echo ""
