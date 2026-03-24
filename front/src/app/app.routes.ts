import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent),
    title: 'Sport IX — Billetterie Sportive Digitale'
  },
  {
    path: 'about',
    loadComponent: () => import('./features/about/about.component').then(m => m.AboutComponent),
    title: 'À propos — Sport IX'
  },
  {
    path: 'contact',
    loadComponent: () => import('./features/contact/contact.component').then(m => m.ContactComponent),
    title: 'Contact — Sport IX'
  },
  {
    path: 'faq',
    loadComponent: () => import('./features/faq/faq.component').then(m => m.FaqComponent),
    title: 'FAQ — Sport IX'
  },
  {
    path: 'events',
    loadComponent: () => import('./features/events/events.component').then(m => m.EventsComponent),
    title: 'Événements — Sport IX'
  },
  {
    path: 'auth/login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent),
    canActivate: [guestGuard],
    title: 'Connexion — Sport IX'
  },
  {
    path: 'auth/register',
    loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent),
    canActivate: [guestGuard],
    title: 'Inscription — Sport IX'
  },
  {
    path: 'club/dashboard',
    loadComponent: () => import('./features/dashboard/club-dashboard.component').then(m => m.ClubDashboardComponent),
    canActivate: [authGuard],
    title: 'Tableau de bord Club — Sport IX'
  },
  {
    path: 'spectator/dashboard',
    loadComponent: () => import('./features/dashboard/spectator-dashboard.component').then(m => m.SpectatorDashboardComponent),
    canActivate: [authGuard],
    title: 'Mon Espace — Sport IX'
  },
  {
    path: 'profile',
    loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent),
    canActivate: [authGuard],
    title: 'Mon Profil — Sport IX'
  },
  {
    path: 'demo/scan-billet',
    loadComponent: () => import('./features/demo-scan-billet/demo-scan-billet.component').then(m => m.DemoScanBilletComponent),
    title: 'Scanner Billet  — Sport IX'
  },
  {
    path: 'demo/scan-credit',
    loadComponent: () => import('./features/demo-scan-credit/demo-scan-credit.component').then(m => m.DemoScanCreditComponent),
    title: 'Scanner Crédit  — Sport IX'
  },
  {
    path: '**',
    redirectTo: ''
  }
];
