import { Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DatePipe } from '@angular/common';
import { EventService } from '../../core/services/event.service';
import { AuthService } from '../../core/services/auth.service';
import { SportEvent } from '../../core/models/event.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, DatePipe],
  template: `
    <div class="min-h-screen text-white overflow-x-hidden" style="background: var(--bg-primary);">
      <!-- HERO -->
      <section class="relative flex items-center justify-center overflow-hidden" style="height: calc(100dvh - 64px); padding: 2rem 1rem 2rem;">
        <!-- Gradient mesh background -->
        <div class="absolute inset-0 z-0" style="background: radial-gradient(ellipse 80% 60% at 20% 40%, rgba(232, 25, 44, 0.15) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 80% 20%, rgba(255, 107, 53, 0.1) 0%, transparent 50%), radial-gradient(ellipse 70% 40% at 50% 90%, rgba(64, 196, 255, 0.06) 0%, transparent 50%), radial-gradient(ellipse 50% 50% at 60% 60%, rgba(131, 56, 236, 0.05) 0%, transparent 50%);"></div>
        <!-- Geometric pattern overlay -->
        <div class="absolute inset-0 z-0" style="opacity: 0.03; background-image: linear-gradient(30deg, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(-30deg, rgba(255,255,255,0.1) 1px, transparent 1px); background-size: 60px 100px;"></div>
        
        <div class="relative z-10 text-center max-w-[800px] mx-auto px-4">
          <p class="text-sm uppercase tracking-widest mb-4" style="color: rgba(255,255,255,0.45); letter-spacing: 0.15em;">
            Version Démo Publique
          </p>
          <h1 class="font-extrabold mb-4" style="font-size: clamp(2.5rem, 6vw, 4.5rem); letter-spacing: -0.02em; line-height: 1.05;">
             Vivez le Sport<br>
             <span class="text-gradient">en Direct</span>
          </h1>
          <p class="text-lg md:text-xl mb-10 max-w-[600px] mx-auto" style="color: rgba(255,255,255,0.7);">
            Achetez vos billets en ligne et votez pour vos joueurs préférés.
          </p>

          <!-- CTAs -->
          <div class="flex flex-wrap justify-center gap-4 mb-8">
            <a routerLink="/events" class="accent-btn inline-flex items-center gap-2 px-8 py-4 text-base font-semibold">
              Explorer les Événements
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </a>
            <a routerLink="/about" class="ghost-btn inline-flex items-center gap-2 px-8 py-4 text-base" style="color: rgba(255,255,255,0.7); border: 1px solid rgba(255,255,255,0.15); border-radius: 9999px;">
              <svg class="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>
              Comment ça marche ?
            </a>
          </div>

          <!-- Animated counters -->
          <div class="grid grid-cols-3 max-w-[800px] mx-auto w-full mb-12">
            <div class="text-center px-2 sm:px-4 lg:px-8 py-0 relative">
              <div class="text-gradient font-extrabold" style="font-size: clamp(1.25rem, 5vw, 2.5rem); letter-spacing: -0.02em;">{{ animatedEvents }}+</div>
              <div class="uppercase font-medium mt-1" style="font-size: clamp(0.5rem, 2.5vw, 0.75rem); color: rgba(255,255,255,0.45); letter-spacing: 0.05em;">Événements Créés</div>
              <div class="absolute right-0 top-1/2 -translate-y-1/2 w-px h-10" style="background: rgba(255,255,255,0.1);"></div>
            </div>
            <div class="text-center px-2 sm:px-4 lg:px-8 py-0 relative">
              <div class="text-gradient font-extrabold" style="font-size: clamp(1.25rem, 5vw, 2.5rem); letter-spacing: -0.02em;">{{ formattedTickets }}+</div>
              <div class="uppercase font-medium mt-1" style="font-size: clamp(0.5rem, 2.5vw, 0.75rem); color: rgba(255,255,255,0.45); letter-spacing: 0.05em;">Billets vendus</div>
              <div class="absolute right-0 top-1/2 -translate-y-1/2 w-px h-10" style="background: rgba(255,255,255,0.1);"></div>
            </div>
            <div class="text-center px-2 sm:px-4 lg:px-8 py-0">
              <div class="text-gradient font-extrabold" style="font-size: clamp(1.25rem, 5vw, 2.5rem); letter-spacing: -0.02em;">{{ animatedClubs }}+</div>
              <div class="uppercase font-medium mt-1" style="font-size: clamp(0.5rem, 2.5vw, 0.75rem); color: rgba(255,255,255,0.45); letter-spacing: 0.05em;">Clubs partenaires</div>
            </div>
          </div>
        </div>
        
        <!-- Scroll indicator -->
        <div class="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 scroll-bounce" style="color: rgba(255,255,255,0.45);">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
        </div>
      </section>

      <!-- WHY SPORT IX -->
      <section class="relative py-16 sm:py-20 overflow-hidden px-4 sm:px-8">
        <div class="max-w-[1200px] mx-auto relative z-10">
          <div class="text-center mb-10 sm:mb-14">
            <div class="inline-flex items-center gap-2 text-xs font-semibold uppercase mb-3" style="color: var(--accent-primary); letter-spacing: 0.15em;">Pourquoi nous choisir</div>
            <h2 class="text-3xl md:text-4xl font-extrabold mb-3" style="letter-spacing: -0.02em;">L'expérience Sport IX</h2>
            <p class="text-base md:text-lg max-w-[550px] mx-auto" style="color: rgba(255,255,255,0.7);">Bien plus qu'une simple billetterie</p>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="relative text-center p-5 sm:p-8 rounded-[20px] transition-all duration-300 group hover:-translate-y-1" style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.10);">
              <div class="w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center" style="background: linear-gradient(135deg, rgba(232,25,44,0.15), rgba(255,107,53,0.15));">
                <svg class="w-8 h-8" style="color: var(--accent-primary);" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z"/></svg>
              </div>
              <h3 class="text-lg font-bold mb-2">Billetterie Digitale</h3>
              <p class="text-sm leading-relaxed" style="color: rgba(255,255,255,0.7);">QR code sur votre mobile, entrée en 2 secondes. Plus besoin d'imprimer vos billets.</p>
            </div>
            <div class="relative text-center p-5 sm:p-8 rounded-[20px] transition-all duration-300 group hover:-translate-y-1" style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.10);">
              <div class="w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center" style="background: linear-gradient(135deg, rgba(64,196,255,0.15), rgba(59,130,246,0.15));">
                <svg class="w-8 h-8" style="color: var(--accent-primary);" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"/></svg>
              </div>
              <h3 class="text-lg font-bold mb-2">Vote Sportif</h3>
              <p class="text-sm leading-relaxed" style="color: rgba(255,255,255,0.7);">Élisez le meilleur joueur après chaque match et faites entendre votre voix de fan.</p>
            </div>
            <div class="relative text-center p-5 sm:p-8 rounded-[20px] transition-all duration-300 group hover:-translate-y-1" style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.10);">
              <div class="w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center" style="background: linear-gradient(135deg, rgba(255,171,64,0.15), rgba(255,213,10,0.15));">
                <svg class="w-8 h-8 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M18.75 4.236c.982.143 1.954.317 2.916.52A6.003 6.003 0 0016.27 9.728M18.75 4.236V4.5c0 2.108-.966 3.99-2.48 5.228m0 0a6.023 6.023 0 01-2.77.853m0 0l.5 4.169m0 0a7.454 7.454 0 00.982 3.172M14.5 14.25a7.454 7.454 0 01-.982 3.172"/></svg>
              </div>
              <h3 class="text-lg font-bold mb-2">Gamification</h3>
              <p class="text-sm leading-relaxed" style="color: rgba(255,255,255,0.7);">Gagnez des points, grimpez le classement et débloquez des récompenses exclusives.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- ÉVÉNEMENTS À VENIR -->
      <section class="relative py-16 sm:py-20 px-4 sm:px-8" style="background: var(--bg-secondary); border-top: 1px solid rgba(255,255,255,0.06);">
        <div class="max-w-[1200px] mx-auto">
          <div class="text-center mb-10">
            <h2 class="text-3xl md:text-4xl font-extrabold mb-3">Prochains événements</h2>
            <p class="text-base" style="color: rgba(255,255,255,0.7);">Réservez vos places dès maintenant</p>
          </div>
          @if (loading) {
            <div class="flex justify-center py-12">
              <div class="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style="border-color: var(--accent-primary); border-top-color: transparent;"></div>
            </div>
          } @else {
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              @for (event of events; track event.id) {
                <div class="rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1" style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);">
                  <div class="p-5">
                    <div class="flex items-center gap-2 mb-3">
                      <span class="text-xs font-semibold px-2 py-1 rounded-full" style="background: rgba(255,45,85,0.15); color: var(--accent-primary);">{{ event.sportType }}</span>
                      <span class="text-xs" style="color: rgba(255,255,255,0.4);">{{ event.status === 'upcoming' ? 'À venir' : event.status }}</span>
                    </div>
                    <h3 class="text-base font-bold mb-2 text-white">{{ event.title }}</h3>
                    <div class="space-y-1 text-sm" style="color: rgba(255,255,255,0.6);">
                      <div class="flex items-center gap-2">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"/></svg>
                        {{ event.date | date:'dd/MM/yyyy HH:mm' }}
                      </div>
                      <div class="flex items-center gap-2">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/></svg>
                        {{ event.location }}
                      </div>
                    </div>
                    <div class="mt-4 flex items-center justify-between">
                      <span class="text-lg font-bold" style="color: var(--accent-primary);">{{ event.price }}€</span>
                      <span class="text-xs" style="color: rgba(255,255,255,0.4);">{{ event.ticketsSold }}/{{ event.maxCapacity }} vendus</span>
                    </div>
                  </div>
                </div>
              }
            </div>
            <div class="flex justify-center mt-10">
              <a routerLink="/events" class="ghost-btn inline-flex items-center gap-2 px-8 py-3 text-sm font-medium">Voir tous les événements</a>
            </div>
          }
        </div>
      </section>

      <!-- DEMO SCAN -->
      <section class="relative py-16 sm:py-20 overflow-hidden px-4 sm:px-8">
        <div class="max-w-[900px] mx-auto relative z-10">
          <div class="text-center mb-10">
            <h2 class="text-3xl md:text-4xl font-extrabold mb-3">Testez Sport IX</h2>
            <p class="text-base max-w-[520px] mx-auto" style="color: rgba(255,255,255,0.7);">Découvrez comment fonctionne notre système de billetterie et scannez de vrais QR codes.</p>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl mx-auto">
            <a routerLink="/demo/scan-billet" class="group relative flex flex-col p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1" style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);">
               <div class="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110" style="background: linear-gradient(135deg, rgba(232,25,44,0.15), rgba(255,107,53,0.15));">
                <svg class="w-6 h-6" style="color: var(--accent-primary);" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75zM6.75 16.5h.75v.75h-.75v-.75zM16.5 6.75h.75v.75h-.75v-.75zM13.5 13.5h.75v.75h-.75v-.75zM13.5 19.5h.75v.75h-.75v-.75zM19.5 13.5h.75v.75h-.75v-.75zM19.5 19.5h.75v.75h-.75v-.75zM16.5 16.5h.75v.75h-.75v-.75z"/>
                </svg>
              </div>
              <h3 class="text-lg font-bold text-white mb-2">Scanner un billet</h3>
              <p class="text-sm leading-relaxed mb-4" style="color: rgba(255,255,255,0.6);">Simulez la validation d'entrée à un événement.</p>
              <div class="mt-auto flex items-center gap-1.5 text-sm font-semibold" style="color: var(--accent-primary);">Essayer maintenant</div>
            </a>
            <a routerLink="/demo/scan-credit" class="group relative flex flex-col p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1" style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);">
              <div class="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110" style="background: linear-gradient(135deg, rgba(0,230,118,0.15), rgba(16,185,129,0.15));">
                <svg class="w-6 h-6" style="color: var(--success);" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h3 class="text-lg font-bold text-white mb-2">Payer à la buvette</h3>
              <p class="text-sm leading-relaxed mb-4" style="color: rgba(255,255,255,0.6);">Testez le système de paiement par crédits Sport IX.</p>
              <div class="mt-auto flex items-center gap-1.5 text-sm font-semibold" style="color: var(--success);">Essayer maintenant</div>
            </a>
          </div>
        </div>
      </section>

      <!-- CTA -->
      <section class="relative py-16 sm:py-24 text-center overflow-hidden px-4 sm:px-8">
        <div class="absolute inset-0" style="background: radial-gradient(ellipse at 30% 50%, rgba(232,25,44,0.12) 0%, transparent 60%), radial-gradient(ellipse at 70% 50%, rgba(255,107,53,0.08) 0%, transparent 60%);"></div>
        <div class="relative z-10">
          <h2 class="text-3xl md:text-4xl font-extrabold mb-3">Prêt à <span class="text-gradient">vibrer</span> ?</h2>
          <p class="text-base md:text-lg mb-8" style="color: rgba(255,255,255,0.7);">Rejoignez la communauté Sport IX</p>
          <a routerLink="/auth/register" class="accent-btn inline-flex items-center gap-2 px-8 py-4 text-white font-semibold text-base" style="box-shadow: var(--shadow-accent);">
            Créer mon compte gratuitement
          </a>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .scroll-bounce {
      animation: scrollBounce 2s infinite;
    }
    
    @keyframes scrollBounce {
      0%, 20%, 50%, 80%, 100% {
        transform: translateX(-50%) translateY(0);
      }
      40% {
        transform: translateX(-50%) translateY(-10px);
      }
      60% {
        transform: translateX(-50%) translateY(-5px);
      }
    }
  `]
})
export class HomeComponent implements OnInit {
  events: SportEvent[] = [];
  loading = true;
  
  // Animated counters
  animatedEvents = 0;
  animatedTickets = 0;
  animatedClubs = 0;
  targetEvents = 0;
  targetTickets = 0;
  targetClubs = 0;

  private eventService = inject(EventService);
  auth = inject(AuthService);

  ngOnInit(): void {
    this.loadStats();
    this.loadEvents();
  }

  get formattedTickets(): string {
    return this.formatTickets(this.animatedTickets);
  }

  formatTickets(value: number): string {
    if (value >= 1000) {
      return Math.floor(value / 1000).toLocaleString('fr-FR') + ' ' + String(value % 1000).padStart(3, '0');
    }
    return value.toLocaleString('fr-FR');
  }

  private animateCounter(start: number, end: number, duration: number, callback: (value: number) => void): void {
    const startTime = Date.now();
    const animate = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const value = Math.floor(start + (end - start) * progress);
      callback(value);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }

  private loadStats(): void {
    this.eventService.getStats().subscribe({
      next: (stats) => {
        this.targetEvents = stats['events_organized'].value;
        this.targetTickets = stats['tickets_sold'].value;
        this.targetClubs = stats['clubs_partners'].value;
        
        // Start animations
        this.animateCounter(0, this.targetEvents, 2000, (value) => this.animatedEvents = value);
        this.animateCounter(0, this.targetTickets, 2500, (value) => this.animatedTickets = value);
        this.animateCounter(0, this.targetClubs, 1500, (value) => this.animatedClubs = value);
      },
      error: () => {
        // Fallback values
        this.targetEvents = 320;
        this.targetTickets = 12500;
        this.targetClubs = 45;
        
        this.animateCounter(0, this.targetEvents, 2000, (value) => this.animatedEvents = value);
        this.animateCounter(0, this.targetTickets, 2500, (value) => this.animatedTickets = value);
        this.animateCounter(0, this.targetClubs, 1500, (value) => this.animatedClubs = value);
      }
    });
  }

  private loadEvents(): void {
    this.eventService.getEvents(undefined, 'upcoming').subscribe({
      next: (events) => {
        this.events = events.slice(0, 6);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}
