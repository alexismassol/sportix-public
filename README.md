# Sportix

**Projet démo** de la plateforme de billetterie sportive **Sport IX** — développé par **Alexis MASSOL**.

> Application web complète : Angular 21.2.5 (frontend) + Node.js 22 (backend) + SQLite (base de données).

> **AVERTISSEMENT** : Ce projet est une **version de démonstration** destinée à un usage éducatif et portfolio uniquement. Il n'est **PAS conçu pour la production** : il ne contient pas les optimisations de performance, la sécurité avancée, ni l'architecture distribuée de la plateforme Sport IX originale. Voir [LICENSE](./LICENSE) pour les conditions d'utilisation.

---

## Présentation

**Sport IX** (https://sport-ix.com) est une plateforme de billetterie sportive digitale permettant aux clubs sportifs de vendre des billets en ligne et aux spectateurs d'accéder aux événements via QR code sur mobile.

Ce dépôt est une **version démo avec code source disponible** qui présente :
- L'architecture frontend/backend découplée
- Le système de design réutilisable (tokens CSS, mixins, animations)
- L'authentification JWT
- Le système de scan de billets et crédits (simulation)
- Les tests unitaires, d'intégration et end-to-end
- La conteneurisation Docker
- **Angular 21** avec composants standalone et signals
- **Node.js 22** avec Express 4
- **SQLite** avec better-sqlite3

---

## Démarrage rapide

### Prérequis
- **Node.js** ≥ 22.0.0
- **npm** ≥ 10
- **Angular CLI** : `npm install -g @angular/cli`

### Installation

```bash
# Cloner le dépôt
git clone https://github.com/alexismassol/sportix-public.git
cd sportix-public

# Configurer les variables d'environnement
cp server/.env.example server/.env

# Installer toutes les dépendances (front + back)
./scripts/setup.sh
# ou manuellement :
cd server && npm install && cd ../front && npm install && cd ..

# Initialiser la base de données avec les données démo
./scripts/seed-database.sh
# ou : cd server && node src/database/seed.js
```

### Lancement

```bash
# Démarrer le backend ET le frontend simultanément
npm start
# → Backend : http://localhost:3000
# → Frontend : http://localhost:4200

# Ou séparément :
npm run start:backend    # Backend seul (port 3000)
npm run start:frontend   # Frontend seul (port 4200)
```

### Avec Docker

```bash
# Créer le fichier .env si pas encore fait
cp server/.env.example server/.env

# Démarrer les conteneurs Docker
./scripts/start-docker.sh
# ou en arrière-plan :
./scripts/start-docker.sh -d

# Arrêter les conteneurs Docker
./scripts/stop-docker.sh
# ou avec nettoyage des images :
./scripts/stop-docker.sh --clean

# Manuellement :
cd docker && docker-compose up --build
cd docker && docker-compose down
# → Backend : http://localhost:3000
# → Frontend : http://localhost:4200
```

---

## Comptes démo

| Rôle | Email | Mot de passe |
|------|-------|-------------|
| Spectateur | `spectateur@sport-ix.com` | `Spectateur2024!` |
| Club | `club@sport-ix.com` | `Club2024!` |

---

## Structure du projet

```
sportix-public/
├── front/          # Frontend Angular 21
├── server/         # Backend Node.js Express + SQLite
├── docker/         # Docker Compose (front + back)
├── scripts/        # Scripts utilitaires
└── docs/           # Spécifications technique & fonctionnelle
```

Voir [ARBORESCENCE.md](./ARBORESCENCE.md) pour l'arborescence complète.

---

## Tests

### Backend (Jest + Supertest)
```bash
npm run test:back:unit          # Tests unitaires
npm run test:back:integration   # Tests d'intégration
npm run test:back:e2e           # Tests end-to-end
npm run test:back:vv            # Tests V&V (validation & vérification)
npm run test                    # Tous les tests backend
```

### Frontend (Playwright)
```bash
npm run test:front:e2e          # Tests E2E Playwright
npm run test:front:vv           # Tests V&V frontend
```

### Lint
```bash
cd front && npx ng lint         # Lint frontend Angular (ESLint)
```

### Tout lancer
```bash
npm run test:all                # Backend + Frontend (tous les tests)
```

---

## Système de design

Le projet utilise un système de design cohérent basé sur des **tokens CSS** :

- **Couleurs** : fond sombre (#0A0E1A), accent rouge (#FF2D55), accent orange (#FF6B35)
- **Typographie** : Poppins (Regular, Medium, SemiBold, Bold)
- **Effets** : Glass morphism (backdrop-filter blur), gradients, glow effects
- **Animations** : fadeInUp, pulseGlow, shimmer, slideIn, float

Voir `front/src/styles/tokens.scss`, `mixins.scss` et `animations.scss`.

---

## Documentation

- [Spécification Technique](./docs/SPEC_TECHNIQUE.md)
- [Spécification Fonctionnelle](./docs/SPEC_FONCTIONNELLE.md)
- [Arborescence](./ARBORESCENCE.md)

---

## Technologies

### Frontend
- **Angular 21** (standalone components)
- **TailwindCSS** (utility-first CSS)
- **SCSS** (tokens, mixins, animations)
- **Jest** (tests unitaires)
- **Playwright** (tests E2E)

### Backend
- **Node.js 22** + **Express 4**
- **SQLite** (better-sqlite3)
- **JWT** (jsonwebtoken + bcryptjs)
- **Jest** + **Supertest** (tests)

### DevOps
- **Docker** + **Docker Compose**
- **Concurrently** (lancement simultané front + back)

---

## Auteur

**Alexis MASSOL**
- Développeur Full Stack
- Créateur de la plateforme Sport IX

---

## Licence

Ce projet est la propriété exclusive de **Alexis MASSOL**. Aucune utilisation commerciale n'est autorisée.
Voir [LICENSE](./LICENSE) pour les détails complets.
