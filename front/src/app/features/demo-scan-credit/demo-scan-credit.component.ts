import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EventService } from '../../core/services/event.service';
import { ScanResult } from '../../core/models/event.model';

@Component({
  selector: 'app-demo-scan-credit',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="min-h-screen text-white" style="background: var(--bg-primary);">
      <section class="relative py-20 px-4 sm:px-8">
        <div class="max-w-[700px] mx-auto">
          <div class="text-center mb-10">
            <h1 class="text-2xl md:text-3xl font-extrabold mb-3">Paiement Buvette <span class="text-gradient">(Démo)</span></h1>
            <p class="text-sm" style="color: rgba(255,255,255,0.6);">Simulez un paiement par scan de crédit QR code</p>
          </div>

          <!-- Scan scenarios -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            @for (scenario of scenarios; track scenario.qrCode) {
              <button (click)="simulateScan(scenario.qrCode, scenario.amount)" [disabled]="scanning"
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

          @if (scanning) {
            <div class="flex justify-center py-8">
              <div class="w-12 h-12 border-3 border-t-transparent rounded-full animate-spin" style="border-color: var(--success); border-top-color: transparent;"></div>
            </div>
          }

          @if (result && !scanning) {
            <div class="rounded-2xl overflow-hidden" [style.background]="result.status === 'valid' ? 'rgba(0,230,118,0.08)' : 'rgba(255,82,82,0.08)'" [style.border]="result.status === 'valid' ? '2px solid rgba(0,230,118,0.3)' : '2px solid rgba(255,82,82,0.3)'">
              <div class="p-6 text-center">
                <div class="text-4xl mb-3">{{ result.status === 'valid' ? '💳' : '❌' }}</div>
                <div class="text-lg font-bold mb-1">{{ result.status === 'valid' ? 'Paiement réussi' : 'Paiement refusé' }}</div>
                <p class="text-sm mb-4" style="color: rgba(255,255,255,0.7);">{{ result.message }}</p>

                @if (result.previousBalance !== undefined) {
                  <div class="flex justify-center gap-8 mt-4">
                    <div class="text-center">
                      <div class="text-xs mb-1" style="color: rgba(255,255,255,0.4);">Avant</div>
                      <div class="text-lg font-bold" style="color: rgba(255,255,255,0.6);">{{ result.previousBalance }}€</div>
                    </div>
                    <div class="flex items-center">
                      <svg class="w-5 h-5" style="color: rgba(255,255,255,0.3);" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/></svg>
                    </div>
                    <div class="text-center">
                      <div class="text-xs mb-1" style="color: rgba(255,255,255,0.4);">Après</div>
                      <div class="text-lg font-bold" style="color: var(--success);">{{ result.newBalance }}€</div>
                    </div>
                  </div>
                }

                @if (result.holderName) {
                  <div class="mt-4 text-sm" style="color: rgba(255,255,255,0.5);">{{ result.holderName }}</div>
                }
              </div>
            </div>
          }

          <div class="flex justify-center mt-10 gap-4">
            <a routerLink="/demo/scan-billet" class="ghost-btn inline-flex items-center gap-2 px-6 py-3 text-sm">Scanner un billet</a>
            <a routerLink="/" class="text-sm px-4 py-3" style="color: rgba(255,255,255,0.5);">Retour à l'accueil</a>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [``]
})
export class DemoScanCreditComponent {
  scanning = false;
  result: ScanResult | null = null;

  scenarios = [
    { qrCode: 'REVNTy1DUkVESVQtT0s=', amount: 5, label: 'Paiement 5€', description: 'Solde suffisant — paiement accepté', icon: '💳' }, // Base64 de 'DEMO-CREDIT-OK'
    { qrCode: 'REVNTy1DUkVESVQtT0s=', amount: 10, label: 'Paiement 10€', description: 'Solde suffisant — paiement accepté', icon: '💳' }, // Base64 de 'DEMO-CREDIT-OK'
    { qrCode: 'REVNTy1DUkVESVQtTE9X', amount: 100, label: 'Solde insuffisant', description: 'Le solde est trop bas pour ce montant', icon: '⚠️' }, // Base64 de 'DEMO-CREDIT-LOW'
    { qrCode: 'Q1JFSURUQ1JFQRlWRU5U', amount: 5, label: 'QR invalide', description: 'QR code non reconnu dans le système', icon: '🚫' }, // Base64 de 'CREDIT-INVALID'
  ];

  private eventService = inject(EventService);

  simulateScan(qrCode: string, amount: number): void {
    this.scanning = true;
    this.result = null;

    setTimeout(() => {
      this.eventService.scanCredit(qrCode, amount).subscribe({
        next: (result) => {
          this.result = result;
          this.scanning = false;
        },
        error: () => {
          this.result = this.getMockResult(qrCode, amount);
          this.scanning = false;
        }
      });
    }, 800);
  }

  private getMockResult(qrCode: string, amount: number): ScanResult {
    if (qrCode === 'DEMO-CREDIT-INVALID') {
      return { status: 'invalid', message: 'QR code non reconnu' };
    }
    if (qrCode === 'DEMO-CREDIT-LOW') {
      return { status: 'insufficient', message: 'Solde insuffisant', holderName: 'Jean Dupont', previousBalance: 45.50, newBalance: 45.50, amount };
    }
    return { status: 'valid', message: `${amount.toFixed(2)}€ débités avec succès`, holderName: 'Jean Dupont', previousBalance: 45.50, newBalance: 45.50 - amount, amount };
  }
}
