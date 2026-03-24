import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EventService } from '../../core/services/event.service';
import { ScanResult } from '../../core/models/event.model';

@Component({
  selector: 'app-demo-scan-billet',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="min-h-screen text-white" style="background: var(--bg-primary);">
      <section class="relative py-20 px-4 sm:px-8">
        <div class="max-w-[700px] mx-auto">
          <div class="text-center mb-10">
            <h1 class="text-2xl md:text-3xl font-extrabold mb-3">Scanner de Billets <span class="text-gradient">(Démo)</span></h1>
            <p class="text-sm" style="color: rgba(255,255,255,0.6);">Cliquez sur un scénario pour simuler un scan de billet QR code</p>
          </div>

          <!-- Scan scenarios -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            @for (scenario of scenarios; track scenario.qrCode) {
              <button (click)="simulateScan(scenario.qrCode)" [disabled]="scanning"
                class="text-left p-5 rounded-xl transition-all hover:-translate-y-0.5 disabled:opacity-50"
                style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);">
                <div class="flex items-center gap-3 mb-2">
                  <span class="text-lg">{{ scenario.icon }}</span>
                  <span class="text-sm font-bold text-white">{{ scenario.label }}</span>
                </div>
                <p class="text-xs" style="color: rgba(255,255,255,0.5);">{{ scenario.description }}</p>
              </button>
            }
          </div>

          <!-- Scanning animation -->
          @if (scanning) {
            <div class="flex justify-center py-8">
              <div class="w-12 h-12 border-3 border-t-transparent rounded-full animate-spin" style="border-color: var(--accent-primary); border-top-color: transparent;"></div>
            </div>
          }

          <!-- Result -->
          @if (result && !scanning) {
            <div class="rounded-2xl overflow-hidden transition-all" [style.background]="getResultBg()" [style.border]="'2px solid ' + getResultBorderColor()">
              <div class="p-6 text-center">
                <div class="text-4xl mb-3">{{ getResultIcon() }}</div>
                <div class="text-lg font-bold mb-1 text-white">{{ getResultTitle() }}</div>
                <p class="text-sm mb-4" style="color: rgba(255,255,255,0.7);">{{ result.message }}</p>

                @if (result.holderName) {
                  <div class="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full" style="background: rgba(255,255,255,0.1);">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0"/></svg>
                    {{ result.holderName }}
                  </div>
                }

                @if (result.seatInfo) {
                  <div class="mt-2 text-xs" style="color: rgba(255,255,255,0.5);">{{ result.seatInfo }}</div>
                }
              </div>
            </div>
          }

          <div class="flex justify-center mt-10 gap-4">
            <a routerLink="/demo/scan-credit" class="ghost-btn inline-flex items-center gap-2 px-6 py-3 text-sm">Scanner un crédit</a>
            <a routerLink="/" class="text-sm px-4 py-3" style="color: rgba(255,255,255,0.5);">Retour à l'accueil</a>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [``]
})
export class DemoScanBilletComponent {
  scanning = false;
  result: ScanResult | null = null;

  scenarios = [
    { qrCode: 'DEMO-VALID-TICKET', label: 'Billet valide', description: 'Scan d\'un billet valide — entrée autorisée', icon: '✅' },
    { qrCode: 'DEMO-SCANNED-TICKET', label: 'Déjà scanné', description: 'Le billet a déjà été scanné — doublon', icon: '⚠️' },
    { qrCode: 'DEMO-REFUNDED-TICKET', label: 'Billet remboursé', description: 'Ce billet a été remboursé', icon: '❌' },
    { qrCode: 'DEMO-INVALID-TICKET', label: 'QR invalide', description: 'QR code non reconnu dans le système', icon: '🚫' },
  ];

  private eventService = inject(EventService);

  simulateScan(qrCode: string): void {
    this.scanning = true;
    this.result = null;

    // Simulate network delay
    setTimeout(() => {
      this.eventService.scanTicket(qrCode).subscribe({
        next: (result: ScanResult) => {
          this.result = result;
          this.scanning = false;
        },
        error: () => {
          // Fallback mock results
          this.result = this.getMockResult(qrCode);
          this.scanning = false;
        }
      });
    }, 800);
  }

  private getMockResult(qrCode: string): ScanResult {
    const results: Record<string, ScanResult> = {
      'DEMO-VALID-TICKET': { status: 'valid', message: 'Entrée autorisée — bienvenue !', holderName: 'Jean Dupont', seatInfo: 'Tribune A — Rang 5, Place 12', scannedAt: new Date().toISOString() },
      'DEMO-SCANNED-TICKET': { status: 'already_scanned', message: 'Ce billet a déjà été scanné à 19:30', holderName: 'Jean Dupont', seatInfo: 'Tribune B — Rang 3, Place 8', scannedAt: '2026-04-15T19:30:00Z' },
      'DEMO-REFUNDED-TICKET': { status: 'refunded', message: 'Ce billet a été remboursé — entrée refusée', holderName: 'Jean Dupont' },
      'DEMO-INVALID-TICKET': { status: 'invalid', message: 'QR code non reconnu — billet invalide' },
    };
    return results[qrCode] || { status: 'invalid', message: 'QR code non reconnu' };
  }

  getResultBg(): string {
    switch (this.result?.status) {
      case 'valid': return 'rgba(0,230,118,0.08)';
      case 'already_scanned': return 'rgba(255,171,64,0.08)';
      default: return 'rgba(255,82,82,0.08)';
    }
  }

  getResultBorderColor(): string {
    switch (this.result?.status) {
      case 'valid': return 'rgba(0,230,118,0.3)';
      case 'already_scanned': return 'rgba(255,171,64,0.3)';
      default: return 'rgba(255,82,82,0.3)';
    }
  }

  getResultIcon(): string {
    switch (this.result?.status) {
      case 'valid': return '✅';
      case 'already_scanned': return '⚠️';
      default: return '❌';
    }
  }

  getResultTitle(): string {
    switch (this.result?.status) {
      case 'valid': return 'Entrée autorisée';
      case 'already_scanned': return 'Doublon détecté';
      case 'refunded': return 'Billet remboursé';
      default: return 'Billet invalide';
    }
  }
}
