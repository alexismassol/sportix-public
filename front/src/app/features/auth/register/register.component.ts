import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterModule],
  template: `
    <div class="min-h-screen text-white" style="background: var(--bg-primary);">
      <section class="relative pt-20 pb-16 px-4 sm:px-8">
        <div class="max-w-[420px] mx-auto">
          <div class="text-center mb-8">
            <h1 class="text-2xl md:text-3xl font-extrabold mb-2">Inscription</h1>
            <p class="text-sm" style="color: rgba(255,255,255,0.6);">Créez votre compte Sport IX gratuitement</p>
          </div>

          <form (ngSubmit)="onRegister()" class="space-y-4 p-6 rounded-2xl" style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);">
            @if (error) {
              <div class="p-3 rounded-xl text-sm text-center" style="background: rgba(255,82,82,0.1); border: 1px solid rgba(255,82,82,0.2); color: var(--error);">{{ error }}</div>
            }

            <div class="grid grid-cols-2 gap-3">
            <div>
              <label for="reg-firstName" class="block text-sm font-medium mb-1.5" style="color: rgba(255,255,255,0.7);">Prénom</label>
              <input id="reg-firstName" type="text" [(ngModel)]="firstName" name="firstName" required autocomplete="given-name"
                class="w-full px-4 py-3 rounded-xl text-white text-sm outline-none"
                style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.10);"
                placeholder="Jean">
            </div>
            <div>
              <label for="reg-lastName" class="block text-sm font-medium mb-1.5" style="color: rgba(255,255,255,0.7);">Nom</label>
              <input id="reg-lastName" type="text" [(ngModel)]="lastName" name="lastName" required autocomplete="family-name"
                class="w-full px-4 py-3 rounded-xl text-white text-sm outline-none"
                style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.10);"
                placeholder="Dupont">
            </div>
          </div>

          <div>
            <label for="reg-email" class="block text-sm font-medium mb-1.5" style="color: rgba(255,255,255,0.7);">Email</label>
            <input id="reg-email" type="email" [(ngModel)]="email" name="email" required autocomplete="email"
              class="w-full px-4 py-3 rounded-xl text-white text-sm outline-none"
              style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.10);"
              placeholder="jean@example.com">
          </div>

          <div>
            <label for="reg-password" class="block text-sm font-medium mb-1.5" style="color: rgba(255,255,255,0.7);">Mot de passe</label>
            <input id="reg-password" type="password" [(ngModel)]="password" name="password" required minlength="8" autocomplete="new-password"
              class="w-full px-4 py-3 rounded-xl text-white text-sm outline-none"
              style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.10);"
              placeholder="Minimum 8 caractères">
          </div>

          <button type="submit" [disabled]="loading" class="accent-btn w-full py-3 text-sm font-semibold rounded-xl">
            {{ loading ? 'Inscription...' : 'Créer mon compte' }}
          </button>

          <div class="text-center text-sm" style="color: rgba(255,255,255,0.5);">
            Déjà un compte ?
            <a routerLink="/auth/login" class="font-semibold" style="color: var(--accent-primary);">Se connecter</a>
          </div>
        </form>
      </div>
      </section>
    </div>
  `,
  styles: [``]
})
export class RegisterComponent {
  firstName = '';
  lastName = '';
  email = '';
  password = '';
  error = '';
  loading = false;

  private authService = inject(AuthService);
  private router = inject(Router);

  async onRegister(): Promise<void> {
    this.error = '';
    this.loading = true;
    try {
      await this.authService.register({
        email: this.email,
        password: this.password,
        firstName: this.firstName,
        lastName: this.lastName
      });
      this.router.navigate(['/dashboard']);
    } catch (err: unknown) {
      const e = err as { error?: { error?: string } };
      this.error = e?.error?.error || 'Erreur lors de l\'inscription';
    } finally {
      this.loading = false;
    }
  }
}
