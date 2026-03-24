# Spécification Technique — Sportix

**Version** : 1.0.0
**Auteur** : Alexis MASSOL
**Date** : Mars 2026

---

## 1. Vue d'ensemble

Ce projet est une version démonstrative de la plateforme de billetterie sportive Sport IX. L'application est composée de :

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
| Sécurité | Helmet, CORS, compression |
| Logging | Morgan (dev) |
| Tests | Jest + Supertest |

---

## 3. Base de données (SQLite)

### 3.1 Schéma

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

## 4. API REST

### 4.1 Routes publiques

| Méthode | Route | Description |
|---------|-------|-------------|
| POST | `/api/auth/login` | Authentification → JWT |
| POST | `/api/auth/register` | Inscription |
| GET | `/api/stats` | Statistiques globales |
| GET | `/api/events` | Liste des événements |
| GET | `/api/events/:id` | Détail d'un événement |

### 4.2 Routes authentifiées (JWT requis)

| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/api/auth/me` | Profil utilisateur connecté |
| GET | `/api/user/dashboard` | Statistiques du spectateur |
| GET | `/api/user/profile` | Profil complet |
| POST | `/api/scan/ticket` | Scanner un billet |
| POST | `/api/scan/credit` | Scanner un crédit |

### 4.3 Format de réponse

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

## 5. Sécurité

- **JWT** : token dans le header `Authorization: Bearer <token>`
- **bcryptjs** : 10 rounds pour le hashing des mots de passe
- **Helmet** : headers HTTP sécurisés
- **CORS** : limité aux origines autorisées
- **Aucune donnée privée** : uniquement des données mock de démonstration

---

## 6. Système de design

### 6.1 Tokens CSS

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

### 6.2 Mixins réutilisables

- `glass-card($level)` : effet glass morphism (subtle, medium, strong)
- `accent-button` : bouton gradient rouge/orange
- `ghost-button` : bouton transparent avec bordure
- `stadium-glow` : fond radial gradient d'ambiance
- `text-gradient` : texte avec gradient

### 6.3 Animations

- `fadeInUp` : apparition de bas en haut
- `pulseGlow` : pulsation lumineuse
- `shimmer` : effet de chargement
- `float` : flottement léger

---

## 7. Tests

### 7.1 Stratégie TDD

Les tests sont écrits **avant** le code d'implémentation :

1. **Tests unitaires backend** (Jest + Supertest) : routes API, middleware, services
2. **Tests unitaires frontend** (Jest) : composants, services, guards
3. **Tests E2E frontend** (Playwright) : parcours utilisateur complets
4. **Tests d'intégration** : flux auth → navigation → scan

### 7.2 Couverture cible

| Couche | Couverture |
|--------|-----------|
| Backend routes | ≥ 80% |
| Frontend services | ≥ 70% |
| Frontend components | ≥ 60% |
| E2E flows | 100% des parcours critiques |

---

## 8. Docker

### 8.1 Services

| Service | Image | Port |
|---------|-------|------|
| backend | node:22-alpine | 3000 |
| frontend | node:22-alpine | 4200 |

### 8.2 Volumes

- `./server/src/data/` → persistance de la base SQLite

---

## 9. Compatibilité

- **Navigateurs** : Chrome, Firefox, Safari, Edge (dernières versions)
- **Mobile** : responsive design (breakpoints 480px, 768px, 1024px, 1440px)
- **Node.js** : ≥ 22.0.0
- **Angular CLI** : ≥ 21.0.0
