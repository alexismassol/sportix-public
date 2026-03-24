import { Component } from '@angular/core';

interface FaqItem {
  question: string;
  answer: string;
  open: boolean;
}

@Component({
  selector: 'app-faq',
  standalone: true,
  template: `
    <div class="min-h-screen text-white" style="background: var(--bg-primary);">
      <section class="relative py-20 px-4 sm:px-8">
        <div class="max-w-[700px] mx-auto">
          <div class="text-center mb-12">
            <h1 class="text-3xl md:text-4xl font-extrabold mb-4">Questions fréquentes</h1>
            <p class="text-base" style="color: rgba(255,255,255,0.7);">Tout ce que vous devez savoir sur Sport IX</p>
          </div>

          <div class="space-y-3">
            @for (item of faqs; track item.question; let i = $index) {
              <div class="rounded-xl overflow-hidden transition-all" style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);">
                <button (click)="toggle(i)" class="w-full flex items-center justify-between p-5 text-left">
                  <span class="text-sm font-semibold pr-4">{{ item.question }}</span>
                  <svg class="w-5 h-5 shrink-0 transition-transform" [class.rotate-180]="item.open" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5" style="color: rgba(255,255,255,0.4);"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5"/></svg>
                </button>
                @if (item.open) {
                  <div class="px-5 pb-5 text-sm leading-relaxed" style="color: rgba(255,255,255,0.6);">{{ item.answer }}</div>
                }
              </div>
            }
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [``]
})
export class FaqComponent {
  faqs: FaqItem[] = [
    { question: 'Comment acheter un billet ?', answer: 'Rendez-vous sur la page Événements, choisissez votre match et cliquez sur "Acheter". Le paiement se fait en ligne de façon sécurisée. Votre billet QR code sera disponible immédiatement.', open: false },
    { question: 'Comment entrer dans le stade ?', answer: 'Présentez simplement le QR code de votre billet sur votre smartphone à l\'entrée. Le scanner valide votre entrée en moins de 2 secondes.', open: false },
    { question: 'Qu\'est-ce que les crédits Sport IX ?', answer: 'Les crédits Sport IX sont un portefeuille numérique que vous pouvez utiliser pour payer à la buvette et dans les stands lors des événements. Rechargez en ligne et payez par scan QR.', open: false },
    { question: 'Comment fonctionne le vote sportif ?', answer: 'Après chaque match, vous pouvez voter pour le meilleur joueur directement depuis votre espace spectateur. Les résultats sont affichés sur la page d\'accueil.', open: false },
    { question: 'Puis-je me faire rembourser ?', answer: 'Oui, les billets peuvent être remboursés jusqu\'à 48h avant l\'événement. Le remboursement est automatique sur votre moyen de paiement initial.', open: false },
    { question: 'L\'application scanner est-elle gratuite ?', answer: 'Oui, l\'application Sportix Scanner est gratuite pour tous les clubs partenaires. Elle permet de scanner les billets et crédits des spectateurs.', open: false },
    { question: 'Comment devenir club partenaire ?', answer: 'Contactez-nous via la page Contact ou envoyez un email. Nous vous accompagnons dans la mise en place de la billetterie digitale pour votre club.', open: false },
  ];

  toggle(index: number): void {
    this.faqs[index].open = !this.faqs[index].open;
  }
}
