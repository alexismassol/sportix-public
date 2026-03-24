import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="min-h-screen text-white" style="background: var(--bg-primary);">
      <section class="relative pt-20 pb-16 px-4 sm:px-8">
        <div class="max-w-[800px] mx-auto">
          <div class="text-center mb-12">
            <h1 class="text-3xl md:text-4xl font-extrabold mb-4" style="letter-spacing: -0.02em;">À propos de <span class="text-gradient">Sport IX</span></h1>
            <p class="text-lg" style="color: rgba(255,255,255,0.7);">La billetterie sportive nouvelle génération</p>
          </div>

          <div class="space-y-8">
            <div class="p-6 rounded-2xl" style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);">
              <h2 class="text-xl font-bold mb-3">Notre Mission</h2>
              <p class="text-sm leading-relaxed" style="color: rgba(255,255,255,0.7);">Sport IX révolutionne l'accès aux événements sportifs en proposant une billetterie 100% digitale. Notre plateforme permet aux clubs de vendre des billets en ligne et aux spectateurs d'entrer via un simple QR code sur leur smartphone.</p>
            </div>

            <div class="p-6 rounded-2xl" style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);">
              <h2 class="text-xl font-bold mb-3">Technologies</h2>
              <div class="grid grid-cols-2 gap-4 mt-4">
                <div class="text-center p-4 rounded-xl" style="background: rgba(255,255,255,0.04);">
                  <div class="text-2xl mb-2">⚡</div>
                  <div class="text-sm font-semibold">Angular 21</div>
                  <div class="text-xs mt-1" style="color: rgba(255,255,255,0.5);">Frontend</div>
                </div>
                <div class="text-center p-4 rounded-xl" style="background: rgba(255,255,255,0.04);">
                  <div class="text-2xl mb-2">🟢</div>
                  <div class="text-sm font-semibold">Node.js</div>
                  <div class="text-xs mt-1" style="color: rgba(255,255,255,0.5);">Backend API</div>
                </div>
                <div class="text-center p-4 rounded-xl" style="background: rgba(255,255,255,0.04);">
                  <div class="text-2xl mb-2">📱</div>
                  <div class="text-sm font-semibold">Flutter</div>
                  <div class="text-xs mt-1" style="color: rgba(255,255,255,0.5);">App Scanner</div>
                </div>
                <div class="text-center p-4 rounded-xl" style="background: rgba(255,255,255,0.04);">
                  <div class="text-2xl mb-2">🐳</div>
                  <div class="text-sm font-semibold">Docker</div>
                  <div class="text-xs mt-1" style="color: rgba(255,255,255,0.5);">DevOps</div>
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-center mt-10">
            <a routerLink="/" class="ghost-btn inline-flex items-center gap-2 px-6 py-3 text-sm">Retour à l'accueil</a>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [``]
})
export class AboutComponent {}
