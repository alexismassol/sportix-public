import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterModule],
  template: `
    <footer class="relative pt-5 pb-4 px-4 sm:px-8" style="background: var(--bg-secondary); border-top: 1px solid rgba(255,255,255,0.06);">
      <div class="max-w-[1200px] mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          <!-- Logo & description (left on desktop, top on mobile) -->
          <div class="md:col-span-1 order-1 md:order-1">
            <div class="text-xl font-bold mb-3 flex items-center gap-1">
              <span class="text-white">Sport</span>
              <span class="text-gradient">IX</span>
            </div>
            <p class="text-sm leading-relaxed mb-2" style="color: rgba(255,255,255,0.5);">
              La billetterie sportive nouvelle génération.
            </p>
          </div>

          <!-- Links (right on desktop, below logo on mobile) -->
          <div class="md:col-span-2 order-2 md:order-2">
            <div class="grid grid-cols-2 md:grid-cols-2 gap-4">
              <!-- Liens rapides -->
              <div>
                <h4 class="text-sm font-bold uppercase mb-4" style="color: rgba(255,255,255,0.9); letter-spacing: 0.05em;">Liens rapides</h4>
                <div class="space-y-3">
                  <a routerLink="/" class="block text-sm transition-colors hover:text-white" style="color: rgba(255,255,255,0.6);">Accueil</a>
                  <a routerLink="/events" class="block text-sm transition-colors hover:text-white" style="color: rgba(255,255,255,0.6);">Événements</a>
                  <a routerLink="/about" class="block text-sm transition-colors hover:text-white" style="color: rgba(255,255,255,0.6);">À propos</a>
                  <a routerLink="/contact" class="block text-sm transition-colors hover:text-white" style="color: rgba(255,255,255,0.6);">Contact</a>
                </div>
              </div>

              <!-- Support -->
              <div>
                <h4 class="text-sm font-bold uppercase mb-4" style="color: rgba(255,255,255,0.9); letter-spacing: 0.05em;">Support</h4>
                <div class="space-y-3">
                  <a routerLink="/faq" class="block text-sm transition-colors hover:text-white" style="color: rgba(255,255,255,0.6);">FAQ</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Bottom bar -->
        <div class="pt-4 flex flex-col md:flex-row items-center justify-between gap-2" style="border-top: 1px solid rgba(255,255,255,0.06);">
          <p class="text-xs sm:text-sm" style="color: rgba(255,255,255,0.4);">
            © {{ currentYear }} Alexis MASSOL — Tous droits réservés
          </p>
          <p class="text-xs sm:text-sm flex items-center gap-1.5" style="color: rgba(255,255,255,0.4);">
            Fait avec <span class="inline-block" style="animation: heartBeat 2s ease-in-out infinite;">❤️</span> aux Antilles
          </p>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    @keyframes heartBeat {
      0%, 100% { transform: scale(1); }
      14% { transform: scale(1.2); }
      28% { transform: scale(1); }
      42% { transform: scale(1.15); }
      56% { transform: scale(1); }
    }
  `]
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
