import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [RouterModule],
  template: `
    <nav class="fixed top-0 left-0 right-0 w-full z-[9000] transition-all duration-300 h-16 lg:h-16"
         style="background: rgba(10,14,26,0.85); backdrop-filter: blur(24px) saturate(180%); -webkit-backdrop-filter: blur(24px) saturate(180%); border-bottom: 1px solid rgba(255,255,255,0.06);"
         tabindex="0" (click)="userMenuOpen = false" (keyup.enter)="userMenuOpen = false">
      <div class="max-w-[1200px] mx-auto px-4 sm:px-6 flex items-center justify-between h-16" 
           (click)="$event.stopPropagation()" tabindex="0" (keyup.enter)="$event.stopPropagation()">
        <!-- Logo Sport IX (left) -->
        <div class="flex justify-start">
          <a routerLink="/" class="flex items-center gap-1 text-white font-bold text-xl">
            <span class="text-white">Sport</span>
            <span class="text-gradient">IX</span>
          </a>
        </div>

        <!-- Desktop Nav (centered) -->
        <div class="hidden md:flex items-center justify-center gap-6 flex-1">
          <a routerLink="/" routerLinkActive="nav-active" [routerLinkActiveOptions]="{ exact: true }"
            class="nav-link relative px-2 py-1 text-white/70 hover:text-white transition-all duration-300 text-sm font-medium"
            tabindex="0" (keyup.enter)="navigateTo('/')">
            Accueil
            <span class="nav-underline"></span>
          </a>
          <a routerLink="/events" routerLinkActive="nav-active" [routerLinkActiveOptions]="{ exact: true }"
            class="nav-link relative px-2 py-1 text-white/70 hover:text-white transition-all duration-300 text-sm font-medium"
            tabindex="0" (keyup.enter)="navigateTo('/events')">
            Événements
            <span class="nav-underline"></span>
          </a>
          <a routerLink="/about" routerLinkActive="nav-active" [routerLinkActiveOptions]="{ exact: true }"
            class="nav-link relative px-2 py-1 text-white/70 hover:text-white transition-all duration-300 text-sm font-medium"
            tabindex="0" (keyup.enter)="navigateTo('/about')">
            À propos
            <span class="nav-underline"></span>
          </a>
        </div>

        <!-- Right side actions -->
        <div class="flex justify-end items-center gap-1">
          @if (auth.isAuthenticated()) {
            <!-- User Menu Dropdown (desktop only) -->
            <div class="relative group hidden md:block">
              <button
                (click)="userMenuOpen = !userMenuOpen"
                class="flex items-center text-white hover:opacity-80 transition-all duration-300 focus:outline-none"
                [class.opacity-80]="userMenuOpen">
                <div class="w-8 h-8 rounded-full flex items-center justify-center mr-2" style="background: rgba(255,255,255,0.08); border: 2px solid rgba(255,255,255,0.15);">
                  <span class="font-bold text-sm" style="color: rgba(255,255,255,0.85);">{{ getUserInitial() }}</span>
                </div>
                <span class="mr-1">{{ auth.user()?.firstName || 'Utilisateur' }}</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 transition-transform duration-300" [class.rotate-180]="userMenuOpen" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="color: rgba(255,255,255,0.85);">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <!-- Dropdown Menu -->
              @if (userMenuOpen) {
                <div class="absolute right-0 mt-2 w-48 py-2 z-50 rounded-2xl" style="background: rgba(17,24,39,0.95); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 16px 48px rgba(0,0,0,0.5);">
                  <div class="px-4 py-2 text-center" style="border-bottom: 1px solid rgba(255,255,255,0.1);">
                    <p class="text-sm text-white font-medium">{{ auth.user()?.firstName || 'Utilisateur' }}</p>
                  </div>
                  <a routerLink="{{ auth.isClub() ? '/club/dashboard' : '/spectator/dashboard' }}" class="block px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors" (click)="userMenuOpen = false">
                    <div class="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                      Mon espace
                    </div>
                  </a>
                  <div style="border-top: 1px solid rgba(255,255,255,0.1); margin-top: 4px; padding-top: 4px;">
                    <button (click)="logout(); userMenuOpen = false" (keyup.enter)="logout(); userMenuOpen = false" 
                    class="block w-full px-4 py-2 text-sm text-left text-red-400 hover:text-red-300 hover:bg-white/5 transition-colors"
                    tabindex="0" aria-label="Déconnexion">
                      <div class="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                        Déconnexion
                      </div>
                    </button>
                  </div>
                </div>
              }
            </div>
            
            <!-- Mobile: Profile icon that opens mobile menu -->
            <button (click)="mobileMenuOpen = !mobileMenuOpen" (keyup.enter)="mobileMenuOpen = !mobileMenuOpen" 
              class="md:hidden w-8 h-8 rounded-full flex items-center justify-center" 
              style="background: rgba(255,255,255,0.08); border: 2px solid rgba(255,255,255,0.15);"
              tabindex="0" aria-label="Menu mobile">
              <span class="font-bold text-sm" style="color: rgba(255,255,255,0.85);">{{ getUserInitial() }}</span>
            </button>
          } @else {
            <a routerLink="/auth/login"
              class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold cursor-pointer transition-all duration-200 hover:scale-105" style="background: rgba(255,255,255,0.08); border: 2px solid rgba(255,255,255,0.15); color: rgba(255,255,255,0.85);" title="Connexion">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            </a>
          }
          
          <!-- Mobile menu toggle -->
          <button (click)="mobileMenuOpen = !mobileMenuOpen" (keyup.enter)="mobileMenuOpen = !mobileMenuOpen" 
            class="md:hidden p-2 text-white" tabindex="0" aria-label="Menu navigation">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
              @if (mobileMenuOpen) {
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
              } @else {
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"/>
              }
            </svg>
          </button>
        </div>
      </div>
    </nav>

    <!-- Mobile Sidebar Overlay -->
    @if (mobileMenuOpen) {
      <div class="md:hidden fixed inset-0 z-[9000]" style="background: rgba(0,0,0,0.6);" 
           tabindex="0" (click)="mobileMenuOpen = false" (keyup.enter)="mobileMenuOpen = false" 
           aria-label="Fermer le menu mobile"></div>
    }

    <!-- Mobile Sidebar -->
    <div class="md:hidden fixed top-0 right-0 h-[100dvh] z-[9001] overflow-y-auto transition-transform duration-300"
         [class.translate-x-0]="mobileMenuOpen"
         [class.translate-x-full]="!mobileMenuOpen"
         style="width: 320px; max-width: 90vw; background: rgba(17,24,39,0.98); backdrop-filter: blur(30px) saturate(170%); -webkit-backdrop-filter: blur(30px) saturate(170%); border-left: 1px solid rgba(255,255,255,0.06); padding: 5rem 1.5rem 6rem;">
      
      <nav class="flex flex-col gap-2">
        <!-- Public Links (non-logged-in) -->
        @if (!auth.isAuthenticated()) {
          <a routerLink="/" (click)="mobileMenuOpen = false"
            class="flex items-center gap-3 py-2.5 px-4 rounded-xl text-sm font-medium transition-all duration-200" style="color: rgba(255,255,255,0.7);"
            routerLinkActive="mobile-nav-active" [routerLinkActiveOptions]="{ exact: true }">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            Accueil
          </a>
          <a routerLink="/events" (click)="mobileMenuOpen = false"
            class="flex items-center gap-3 py-2.5 px-4 rounded-xl text-sm font-medium transition-all duration-200" style="color: rgba(255,255,255,0.7);"
            routerLinkActive="mobile-nav-active" [routerLinkActiveOptions]="{ exact: true }">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            Événements
          </a>
          <a routerLink="/about" (click)="mobileMenuOpen = false"
            class="flex items-center gap-3 py-2.5 px-4 rounded-xl text-sm font-medium transition-all duration-200" style="color: rgba(255,255,255,0.7);"
            routerLinkActive="mobile-nav-active" [routerLinkActiveOptions]="{ exact: true }">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
            À propos
          </a>
          <a routerLink="/contact" (click)="mobileMenuOpen = false"
            class="flex items-center gap-3 py-2.5 px-4 rounded-xl text-sm font-medium transition-all duration-200" style="color: rgba(255,255,255,0.7);"
            routerLinkActive="mobile-nav-active" [routerLinkActiveOptions]="{ exact: true }">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            Contact
          </a>
          <a routerLink="/faq" (click)="mobileMenuOpen = false"
            class="flex items-center gap-3 py-2.5 px-4 rounded-xl text-sm font-medium transition-all duration-200" style="color: rgba(255,255,255,0.7);"
            routerLinkActive="mobile-nav-active" [routerLinkActiveOptions]="{ exact: true }">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            FAQ
          </a>
          
          <!-- Separator -->
          <div class="border-t border-gray-700 my-3"></div>
          
          <a routerLink="/auth/login" (click)="mobileMenuOpen = false"
            class="flex items-center gap-3 py-2.5 px-4 rounded-xl text-sm font-medium transition-all duration-200" style="color: rgba(255,255,255,0.7);"
            routerLinkActive="mobile-nav-active">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
            Connexion
          </a>
          
          <!-- CTA Button -->
          <a routerLink="/events"
            class="mt-4 block text-center py-3.5 rounded-xl text-base font-semibold text-white transition-all duration-300" style="background: var(--accent-gradient);"
            (click)="mobileMenuOpen = false">
            Explorer les Événements
          </a>
        } @else {
          <a routerLink="{{ auth.isClub() ? '/club/dashboard' : '/spectator/dashboard' }}" (click)="mobileMenuOpen = false"
            class="flex items-center gap-3 py-2.5 px-4 rounded-xl text-sm font-medium transition-all duration-200" style="color: rgba(255,255,255,0.7);">
            Mon espace
          </a>
          <button (click)="logout(); mobileMenuOpen = false"
            class="flex items-center gap-3 py-2.5 px-4 rounded-xl text-sm font-medium transition-all duration-200 text-left w-full" style="color: rgba(255,255,255,0.7);">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
            Déconnexion
          </button>
        }
      </nav>
    </div>
    <!-- Spacer -->
    <div class="h-16"></div>
  `,
  styles: [`
    .nav-active {
      color: var(--accent-primary) !important;
      font-weight: 700;
    }
    
    .nav-underline {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: var(--accent-primary);
      transform: scaleX(0);
      transition: transform 0.3s ease;
      border-radius: 1px;
    }
    
    .nav-active .nav-underline {
      transform: scaleX(1);
    }
    
    .nav-link:hover .nav-underline {
      transform: scaleX(1);
    }
    
    .mobile-nav-active {
      color: white !important;
      background: var(--accent-gradient) !important;
    }
    
    /* Ensure mobile nav styles don't affect desktop */
    .md:hidden .nav-active {
      color: white !important;
      background: var(--accent-gradient) !important;
    }
  `]
})
export class NavigationComponent {
  mobileMenuOpen = false;
  userMenuOpen = false;
  auth = inject(AuthService);
  router = inject(Router);

  getUserInitial(): string {
    const user = this.auth.user();
    if (user?.firstName) {
      return user.firstName.charAt(0).toUpperCase();
    }
    return 'U';
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/auth/login']);
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }
}
