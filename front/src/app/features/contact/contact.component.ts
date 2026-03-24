import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="min-h-screen text-white" style="background: var(--bg-primary);">
      <section class="relative pt-20 pb-16 px-4 sm:px-8">
        <div class="max-w-[600px] mx-auto">
          <div class="text-center mb-12">
            <h1 class="text-3xl md:text-4xl font-extrabold mb-4">Contactez-nous</h1>
            <p class="text-base" style="color: rgba(255,255,255,0.7);">Une question ? N'hésitez pas à nous écrire.</p>
          </div>

          <form (ngSubmit)="onSubmit()" class="space-y-5">
            <div>
              <label for="contact-name" class="block text-sm font-medium mb-2" style="color: rgba(255,255,255,0.7);">Nom complet</label>
              <input id="contact-name" type="text" [(ngModel)]="form.name" name="name" required
                class="w-full px-4 py-3 rounded-xl text-white text-sm outline-none transition-all focus:ring-2"
                style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.10); focus:ring-color: var(--accent-primary);"
                placeholder="Jean Dupont">
            </div>
            <div>
              <label for="contact-email" class="block text-sm font-medium mb-2" style="color: rgba(255,255,255,0.7);">Email</label>
              <input id="contact-email" type="email" [(ngModel)]="form.email" name="email" required
                class="w-full px-4 py-3 rounded-xl text-white text-sm outline-none transition-all"
                style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.10);"
                placeholder="jean@example.com">
            </div>
            <div>
              <label for="contact-message" class="block text-sm font-medium mb-2" style="color: rgba(255,255,255,0.7);">Message</label>
              <textarea id="contact-message" [(ngModel)]="form.message" name="message" required rows="5"
                class="w-full px-4 py-3 rounded-xl text-white text-sm outline-none transition-all resize-none"
                style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.10);"
                placeholder="Votre message..."></textarea>
            </div>
            <button type="submit" class="accent-btn w-full py-3 text-sm font-semibold rounded-xl">
              {{ sent ? '✓ Message envoyé !' : 'Envoyer le message' }}
            </button>
          </form>

          @if (sent) {
            <div class="mt-6 p-4 rounded-xl text-center text-sm" style="background: rgba(0,230,118,0.1); border: 1px solid rgba(0,230,118,0.2); color: var(--success);">
              Merci pour votre message ! (Mode démo — aucun email envoyé)
            </div>
          }
        </div>
      </section>
    </div>
  `,
  styles: [``]
})
export class ContactComponent {
  form = { name: '', email: '', message: '' };
  sent = false;

  onSubmit(): void {
    this.sent = true;
    setTimeout(() => { this.sent = false; }, 5000);
  }
}
