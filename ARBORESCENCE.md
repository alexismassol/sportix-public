# Arborescence — Sportix

```
sportix-public/
│
├── README.md                          # Documentation principale
├── ARBORESCENCE.md                    # Ce fichier
├── LICENSE                            # Licence propriétaire (Alexis MASSOL)
├── .gitignore                         # Fichiers ignorés par Git
├── .env.example                       # Variables d'environnement (exemple)
├── package.json                       # Scripts root (start, start:frontend, start:backend)
│
├── docs/                              # Documentation
│   ├── SPEC_TECHNIQUE.md              # Spécification technique complète
│   └── SPEC_FONCTIONNELLE.md          # Spécification fonctionnelle complète
│
├── scripts/                           # Scripts utilitaires
│   ├── setup.sh                       # Installation complète (npm install front + back)
│   ├── start-docker.sh                # Lancer via Docker Compose
│   └── seed-database.sh               # Initialiser la base SQLite avec les données démo
│
├── docker/                            # Configuration Docker
│   ├── Dockerfile.frontend            # Image Angular dev server
│   ├── Dockerfile.backend             # Image Node.js backend + seed
│   ├── docker-compose.yml             # Orchestration front + back
│   └── .dockerignore                  # Fichiers exclus du build Docker
│
├── server/                            # Backend Node.js (Express + SQLite)
│   ├── package.json                   # Dépendances backend
│   ├── .env.example                   # Configuration backend (PORT, JWT_SECRET, NODE_ENV)
│   ├── jest.config.js                 # Configuration Jest backend
│   ├── src/
│   │   ├── index.js                   # Point d'entrée Express (port 3000, affiche IP locale)
│   │   ├── database/
│   │   │   ├── db.js                  # Connexion SQLite (better-sqlite3)
│   │   │   ├── schema.sql             # Schéma de la base de données
│   │   │   └── seed.js                # Script de seed (données mock)
│   │   ├── routes/
│   │   │   ├── auth.routes.js         # POST /api/auth/login, /register, GET /me
│   │   │   ├── stats.routes.js        # GET /api/stats (stats globales)
│   │   │   ├── events.routes.js       # GET /api/events, /api/events/:id
│   │   │   ├── user.routes.js         # GET /api/user/dashboard, /profile
│   │   │   └── scan.routes.js         # POST /api/scan/ticket, /credit
│   │   └── middleware/
│   │       └── auth.middleware.js      # Vérification JWT
│   └── tests/
│       ├── unit/                      # Tests unitaires (Jest)
│       │   ├── auth.test.js
│       │   ├── events.test.js
│       │   └── scan.test.js
│       ├── integration/               # Tests d'intégration (Supertest)
│       │   ├── auth.integration.test.js
│       │   ├── events.integration.test.js
│       │   └── user.integration.test.js
│       ├── e2e/                       # Tests end-to-end
│       │   └── full-journey.e2e.test.js
│       └── vv/                        # Tests V&V (validation & vérification)
│           └── cross-flow.vv.test.js
│
└── front/                             # Frontend Angular 21
    ├── package.json                   # Dépendances Angular
    ├── angular.json                   # Configuration Angular CLI
    ├── eslint.config.js               # Configuration ESLint (@angular-eslint)
    ├── tsconfig.json                  # TypeScript config
    ├── tsconfig.app.json
    ├── tsconfig.spec.json
    ├── jest.config.ts                 # Configuration Jest frontend
    ├── playwright.config.ts           # Configuration Playwright e2e
    ├── src/
    │   ├── index.html                 # HTML principal
    │   ├── main.ts                    # Bootstrap Angular
    │   ├── setup-jest.ts              # Setup Jest pour Angular
    │   ├── styles.scss                # Styles globaux
    │   ├── styles/
    │   │   ├── tokens.scss            # Design tokens Sport IX (couleurs, radius, typo)
    │   │   ├── mixins.scss            # Mixins réutilisables (glass, buttons, etc.)
    │   │   └── animations.scss        # Animations globales
    │   └── app/
    │       ├── app.component.ts       # Composant racine
    │       ├── app.config.ts          # Configuration providers
    │       ├── app.routes.ts          # Routes principales
    │       ├── core/
    │       │   ├── services/
    │       │   │   ├── auth.service.ts    # Auth (login, register, JWT, signals)
    │       │   │   ├── api.service.ts     # HTTP client wrapper
    │       │   │   └── event.service.ts   # Events, dashboard, scan API
    │       │   ├── guards/
    │       │   │   └── auth.guard.ts
    │       │   ├── interceptors/
    │       │   │   └── auth.interceptor.ts
    │       │   └── models/
    │       │       ├── user.model.ts
    │       │       └── event.model.ts
    │       ├── shared/
    │       │   ├── navigation/
    │       │   │   └── navigation.component.ts
    │       │   └── footer/
    │       │       └── footer.component.ts
    │       └── features/
    │           ├── home/
    │           │   └── home.component.ts
    │           ├── about/
    │           │   └── about.component.ts
    │           ├── contact/
    │           │   └── contact.component.ts
    │           ├── faq/
    │           │   └── faq.component.ts
    │           ├── events/
    │           │   └── events.component.ts
    │           ├── auth/
    │           │   ├── login/
    │           │   │   └── login.component.ts
    │           │   └── register/
    │           │       └── register.component.ts
    │           ├── dashboard/
    │           │   ├── club-dashboard.component.ts      # Dashboard club (gestion événements)
    │           │   └── spectator-dashboard.component.ts  # Dashboard spectateur (billets personnels)
    │           ├── profile/
    │           │   └── profile.component.ts
    │           ├── demo-scan-billet/
    │           │   └── demo-scan-billet.component.ts
    │           └── demo-scan-credit/
    │               └── demo-scan-credit.component.ts
    └── e2e/                           # Tests E2E & V&V (Playwright)
        ├── home.spec.ts
        ├── auth.spec.ts
        ├── navigation.spec.ts
        └── vv-cross-flow.spec.ts      # Tests V&V frontend
```
