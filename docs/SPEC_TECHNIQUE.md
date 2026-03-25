# Spécification Technique — Sportix

**Version** : 1.0.0
**Auteur** : Alexis MASSOL
**Date** : Mars 2026

---

## 1. Vue d'ensemble

**Sport IX** (https://sport-ix.com) est une plateforme de billetterie sportive digitale professionnelle. Ce projet est une **version démo avec code source disponible** de l'application, composée de :

- **Frontend** : Angular 21.2.5 (standalone components, signals)
- **Backend** : Node.js 22 + Express 4
- **Base de données** : SQLite (better-sqlite3)
- **Authentification** : JWT (jsonwebtoken + bcryptjs)
- **Conteneurisation** : Docker + Docker Compose

---

## 2. Architecture

### 2.1 Architecture générale

```
┌─────────────────────┐     HTTP/REST      ┌─────────────────────┐
│   Frontend Angular   │ ◄──────────────── │   Backend Express    │
│   (port 4200)        │                    │   (port 3000)        │
└─────────────────────┘                    └──────────┬──────────┘
                                                       │
                                                       ▼
                                            ┌─────────────────────┐
                                            │   SQLite Database    │
                                            │   (sportix-demo.db)  │
                                            └─────────────────────┘
```

### 2.2 Frontend (Angular 21)

| Aspect | Choix technique |
|--------|----------------|
| Framework | Angular 21 (standalone components) |
| Styling | SCSS + TailwindCSS utilities inline |
| Design tokens | Variables CSS custom (`:root`) |
| State management | Services Angular + RxJS |
| Routing | Angular Router (lazy loading) |
| HTTP | HttpClient avec interceptor JWT |
| Tests unitaires | Jest + jest-preset-angular |
| Tests E2E | Playwright |

### 2.3 Backend (Node.js + Express)

| Aspect | Choix technique |
|--------|----------------|
| Runtime | Node.js ≥ 22 (ESM modules) |
| Framework | Express 4 |
| Base de données | SQLite via better-sqlite3 |
| Authentification | JWT (access token, 24h) |
| Hash passwords | bcryptjs (10 rounds) |
| Sécurité | Helmet, CORS, express-rate-limit, compression |
| Environment | dotenv pour .env configuration |
| Logging | Morgan (dev) + logs structurés JSON |
| Monitoring | Logs scans avec timestamps, IP, scanner |
| Tests | Jest + Supertest |

---

## 3. Dépendances (Backend)

### 3.1 Packages principaux

| Package | Version | Usage | Description |
|---------|---------|-------|-------------|
| `express` | ^4.21.2 | Core | Serveur web framework |
| `better-sqlite3` | ^11.7.0 | Database | SQLite synchronisé |
| `jsonwebtoken` | ^9.0.0 | Auth | Tokens JWT |
| `bcryptjs` | ^2.4.3 | Security | Hashing mots de passe |
| `helmet` | ^6.1.5 | Security | Headers HTTP sécurisés |
| `cors` | ^2.8.5 | Network | Gestion Cross-Origin |
| `dotenv` | ^16.4.5 | Config | Variables environnement |
| `morgan` | ^1.10.0 | Logging | Logs HTTP développement |
| `uuid` | ^9.0.0 | Utils | Génération IDs uniques |

### 3.2 Sécurité P1/P2 (ajoutées)

| Package | Version | Usage | Protection |
|---------|---------|-------|------------|
| `express-rate-limit` | ^7.1.5 | Rate limiting | 100 req/15min par IP |
| `compression` | ^1.7.4 | Performance | Compression gzip |
| `cookie-parser` | ^1.4.7 | Utils | Gestion cookies |

### 3.3 Développement

| Package | Version | Usage |
|---------|---------|-------|
| `jest` | ^29.7.0 | Tests unitaires |
| `supertest` | ^6.3.4 | Tests API |
| `@jest/globals` | ^29.7.0 | Tests globals |

---

## 4. Base de données (SQLite)

### 4.1 Schéma

#### Table `users`
| Colonne | Type | Description |
|---------|------|-------------|
| id | TEXT (UUID) | Clé primaire |
| email | TEXT | Email unique |
| password | TEXT | Hash bcrypt |
| firstName | TEXT | Prénom |
| lastName | TEXT | Nom |
| role | TEXT | `spectator` ou `club` |
| clubName | TEXT | Nom du club (si rôle club) |
| createdAt | TEXT | Date ISO |

#### Table `events`
| Colonne | Type | Description |
|---------|------|-------------|
| id | TEXT (UUID) | Clé primaire |
| title | TEXT | Titre de l'événement |
| sportType | TEXT | Type de sport |
| date | TEXT | Date ISO |
| location | TEXT | Lieu |
| clubName | TEXT | Club organisateur |
| ticketsSold | INTEGER | Nombre de billets vendus |
| maxCapacity | INTEGER | Capacité maximale |
| price | REAL | Prix du billet |
| status | TEXT | `upcoming`, `live`, `completed` |

#### Table `tickets`
| Colonne | Type | Description |
|---------|------|-------------|
| id | TEXT (UUID) | Clé primaire |
| eventId | TEXT | FK → events.id |
| userId | TEXT | FK → users.id |
| qrCode | TEXT | Données QR |
| status | TEXT | `valid`, `scanned`, `refunded` |
| scannedAt | TEXT | Date du scan |

#### Table `stats`
| Colonne | Type | Description |
|---------|------|-------------|
| key | TEXT | Clé de la stat |
| value | INTEGER | Valeur |
| label | TEXT | Libellé affiché |

---

## 5. API REST

### 5.1 Routes publiques

| Méthode | Route | Description |
|---------|-------|-------------|
| POST | `/api/auth/login` | Authentification → JWT |
| POST | `/api/auth/register` | Inscription |
| GET | `/api/stats` | Statistiques globales |
| GET | `/api/events` | Liste des événements |
| GET | `/api/events/:id` | Détail d'un événement |

### 5.2 Routes authentifiées (JWT requis)

| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/api/auth/me` | Profil utilisateur connecté |
| GET | `/api/user/dashboard` | Statistiques du spectateur |
| GET | `/api/user/profile` | Profil complet |
| POST | `/api/scan/ticket` | Scanner un billet |
| POST | `/api/scan/credit` | Scanner un crédit |

### 5.3 Format de réponse

```json
{
  "success": true,
  "data": { ... }
}
```

```json
{
  "success": false,
  "error": "Message d'erreur"
}
```

---

## 6. Sécurité

### 6.1 Authentification & Tokens
- **JWT** : token dans le header `Authorization: Bearer <token>`
- **JWT_SECRET** : obligatoire depuis .env (serveur refuse de démarrer si manquant)
- **bcryptjs** : 10 rounds pour le hashing des mots de passe

### 6.2 Protection & Monitoring
- **Helmet** : headers HTTP sécurisés
- **express-rate-limit** : 100 requêtes/15 minutes par IP
- **Logs structurés** : JSON format pour monitoring des scans
- **Timeouts HTTP** : 30 secondes pour éviter requêtes bloquantes
- **Validation QR codes** : Regex Base64 + longueur minimale

### 6.3 CORS & Communication
- **CORS** : permissif (`origin: true`) pour Flutter natif
- **Flutter natif** : communication directe sans restrictions navigateur
- **Aucune donnée privée** : uniquement des données mock de démonstration

---

## 7. Système de design

### 7.1 Tokens CSS

```scss
:root {
  --bg-primary: #0A0E1A;
  --bg-secondary: #111827;
  --accent-primary: #FF2D55;
  --accent-secondary: #FF6B35;
  --text-primary: #FFFFFF;
  --text-secondary: rgba(255,255,255,0.7);
  --font-display: 'Poppins', sans-serif;
}
```

### 7.2 Mixins réutilisables

- `glass-card($level)` : effet glass morphism (subtle, medium, strong)
- `accent-button` : bouton gradient rouge/orange
- `ghost-button` : bouton transparent avec bordure
- `stadium-glow` : fond radial gradient d'ambiance
- `text-gradient` : texte avec gradient

### 7.3 Animations

- `fadeInUp` : apparition de bas en haut
- `pulseGlow` : pulsation lumineuse
- `shimmer` : effet de chargement
- `float` : flottement léger

---

## 8. Tests

### 8.1 Stratégie TDD

Les tests sont écrits **avant** le code d'implémentation :

1. **Tests unitaires backend** (Jest + Supertest) : routes API, middleware, services
2. **Tests unitaires frontend** (Jest) : composants, services, guards
3. **Tests E2E frontend** (Playwright) : parcours utilisateur complets
4. **Tests d'intégration** : flux auth → navigation → scan

### 8.2 Couverture cible

| Couche | Couverture |
|--------|-----------|
| Backend routes | ≥ 80% |
| Frontend services | ≥ 70% |
| Frontend components | ≥ 60% |
| E2E flows | 100% des parcours critiques |

---

## 9. Docker

### 9.1 Architecture

| Service | Image | Port | Command | Description |
|---------|-------|------|---------|-------------|
| backend | node:22-alpine | 3000 | `node src/index.js` | API Express + SQLite |
| frontend | node:22-alpine | 4200 | `npx ng serve --host 0.0.0.0` | Angular dev server |

### 9.2 Dockerfiles

#### Dockerfile.backend
```dockerfile
FROM node:22-alpine
WORKDIR /app
COPY server/package*.json ./
RUN npm install --production
COPY server/src ./src
RUN node src/database/seed.js  # Seed la base de données demo
EXPOSE 3000
CMD ["node", "src/index.js"]
```

#### Dockerfile.frontend
```dockerfile
FROM node:22-alpine
WORKDIR /app
COPY front/package*.json ./
RUN npm install --legacy-peer-deps  # Angular 21 compatibility
COPY front/ .
EXPOSE 4200
CMD ["npx", "ng", "serve", "--host", "0.0.0.0", "--port", "4200"]
```

### 9.3 Configuration

- **Environment** : Utilise `server/.env` via `env_file` dans docker-compose.yml
- **JWT_SECRET** : Obligatoire depuis .env (serveur refuse de démarrer si manquant)
- **Sécurité P1/P2** : Rate limiting, logs structurés, timeouts HTTP inclus
- **Volumes** : `sportix-data` pour persistance SQLite

### 9.4 Scripts d'automatisation

| Script | Usage | Description |
|--------|-------|-------------|
| `./scripts/start-docker.sh` | `./scripts/start-docker.sh -d` | Démarre les conteneurs (build + up) |
| `./scripts/stop-docker.sh` | `./scripts/stop-docker.sh --clean` | Arrête les conteneurs (option clean) |
| `docker-compose.yml` | `docker-compose up --build -d` | Configuration Docker Compose |

### 9.5 Réseau et accès

- **Backend API** : http://localhost:3000
- **Frontend Angular** : http://localhost:4200  
- **Flutter natif** : http://172.19.0.2:3000 (IP réseau Docker)
- **CORS** : Permissif pour communication Flutter native

---

## 10. Compatibilité

- **Navigateurs** : Chrome, Firefox, Safari, Edge (dernières versions)
- **Mobile** : responsive design (breakpoints 480px, 768px, 1024px, 1440px)
- **Node.js** : ≥ 22.0.0
- **Angular CLI** : ≥ 21.0.0
