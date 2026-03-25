# Spécification Fonctionnelle — Sportix

**Version** : 1.0.0
**Auteur** : Alexis MASSOL
**Date** : Mars 2026

---

## 1. Objectif

**Sport IX** (https://sport-ix.com) est une plateforme de billetterie sportive digitale professionnelle. Ce projet est une **version démo avec code source disponible** qui permet de démontrer les fonctionnalités clés de la billetterie sportive digitale.

---

## 2. Utilisateurs

### 2.1 Rôles

| Rôle | Description | Accès |
|------|-------------|-------|
| **Visiteur** | Utilisateur non connecté | Pages publiques (Home, About, Contact, FAQ, Events) |
| **Spectateur** | Compte `spectateur@sport-ix.com` | Dashboard, Profil, Historique billets |
| **Club** | Compte `club@sport-ix.com` | Dashboard club (`/club/dashboard`), Scanner démo |

### 2.2 Comptes démo

| Email | Mot de passe | Rôle |
|-------|-------------|------|
| `spectateur@sport-ix.com` | `Spectateur2024!` | Spectateur |
| `club@sport-ix.com` | `Club2024!` | Club |

---

## 3. Pages et fonctionnalités

### 3.1 Pages publiques (sans connexion)

#### Page d'accueil (`/`)
- **Hero section** : titre, compteurs animés (billets vendus, clubs partenaires, spectateurs)
- **Section "Pourquoi Sport IX"** : 3 cards (Billetterie Digitale, Vote Sportif, Gamification)
- **Section événements** : carrousel des prochains événements
- **Section démo** : liens vers les pages de scan démo
- **CTA** : "Créer mon compte gratuitement"

#### À propos (`/about`)
- Présentation de Sport IX
- Mission et vision
- Technologies utilisées

#### Contact (`/contact`)
- Formulaire de contact (simulation, pas d'envoi réel)
- Informations de contact

#### FAQ (`/faq`)
- Questions/réponses fréquentes organisées par catégorie
- Accordéon interactif

#### Événements (`/events`)
- Liste des événements sportifs (données mock)
- Filtres par sport, date, lieu
- Cards avec infos : titre, date, lieu, prix, places restantes

### 3.2 Authentification

#### Connexion (`/auth/login`)
- Formulaire email + mot de passe
- Validation en temps réel
- Redirection vers le dashboard après connexion
- Message d'erreur si identifiants incorrects

#### Inscription (`/auth/register`)
- Formulaire : prénom, nom, email, mot de passe
- Validation : email unique, mot de passe ≥ 8 caractères
- Redirection vers le dashboard après inscription

### 3.3 Pages authentifiées (spectateur)

#### Dashboard spectateur (`/spectator/dashboard`)
- Statistiques personnelles :
  - Nombre de billets achetés
  - Événements assistés
  - Crédits disponibles
  - Points de fidélité
- Liste des prochains événements

#### Dashboard club (`/club/dashboard`)
- Statistiques du club :
  - Événements organisés
  - Billets vendus
  - Revenus générés
- Accès rapide au scanner démo

#### Mon Profil (`/profile`)
- Informations personnelles (prénom, nom, email)
- Statistiques du compte
- Date d'inscription

### 3.4 Pages démo scanner

#### Scanner Billet (`/demo/scan-billet`)
- Simulation de scan de QR code
- 4 scénarios de test :
  - ✅ Billet valide → entrée autorisée
  - ⚠️ Billet déjà scanné → doublon détecté
  - ❌ Billet remboursé → entrée refusée
  - ❌ Billet invalide → QR code non reconnu
- Feedback visuel (couleurs vert/orange/rouge)

#### Scanner Crédit (`/demo/scan-credit`)
- Simulation de paiement buvette
- Affichage du solde avant/après
- Confirmation de transaction

---

## 4. Navigation

### 4.1 Navbar

- **Logo** Sport IX (lien vers `/`)
- **Liens publics** : Événements, À propos, Contact, FAQ
- **Non connecté** : boutons Connexion / Inscription
- **Connecté** : avatar + menu (Dashboard, Profil, Déconnexion)
- **Responsive** : menu hamburger sur mobile

### 4.2 Footer

- Liens rapides (Home, About, Contact, FAQ)
- Liens légaux (simulés)
- Copyright © Alexis MASSOL
- Réseaux sociaux (icônes sans lien)

---

## 5. Données mock

### 5.1 Statistiques globales

| Stat | Valeur |
|------|--------|
| Billets vendus | 12 500+ |
| Clubs partenaires | 45 |
| Spectateurs inscrits | 8 200+ |
| Événements organisés | 320+ |

### 5.2 Événements (8 événements)

| Titre | Sport | Date | Lieu | Prix |
|-------|-------|------|------|------|
| RC Toulon vs Stade Français | Rugby | 15/04/2026 | Stade Mayol, Toulon | 25€ |
| ASSE vs OL | Football | 20/04/2026 | Geoffroy-Guichard, St-Étienne | 35€ |
| PSG Handball vs Montpellier | Handball | 22/04/2026 | Stade Pierre de Coubertin, Paris | 15€ |
| Étoile de Bessèges - Étape 3 | Cyclisme | 25/04/2026 | Bessèges | 10€ |
| Tournoi Open de Tennis | Tennis | 28/04/2026 | Roland Garros, Paris | 45€ |
| Meeting d'Athlétisme | Athlétisme | 01/05/2026 | Stade Charléty, Paris | 20€ |
| France vs Angleterre | Rugby | 05/05/2026 | Stade de France, Paris | 55€ |
| Finale Coupe de France | Football | 10/05/2026 | Stade de France, Paris | 40€ |

### 5.3 Clubs (3 clubs)

- RC Toulon (Rugby)
- AS Saint-Étienne (Football)
- Stade Bordelais (Rugby)

---

## 6. Parcours utilisateur

### 6.1 Parcours visiteur
1. Arrive sur la page d'accueil
2. Découvre les statistiques et les événements
3. Navigue vers About, FAQ, Events
4. Teste les pages démo scanner
5. Crée un compte ou se connecte

### 6.2 Parcours spectateur
1. Se connecte avec `spectateur@sport-ix.com`
2. Accède au dashboard (`/spectator/dashboard`)
3. Consulte son profil
4. Navigue vers les événements
5. Teste les pages démo scanner

### 6.3 Parcours club
1. Se connecte avec `club@sport-ix.com`
2. Accède au dashboard club (`/club/dashboard`)
3. Utilise le scanner de billets
4. Consulte l'historique des scans

---

## 7. Responsive design

| Breakpoint | Appareil | Adaptations |
|-----------|----------|-------------|
| < 480px | Mobile | Menu hamburger, cards empilées, textes réduits |
| 480–768px | Tablette portrait | 2 colonnes pour les cards |
| 768–1024px | Tablette paysage | Navigation complète, 3 colonnes |
| > 1024px | Desktop | Layout complet, max-width 1200px |
