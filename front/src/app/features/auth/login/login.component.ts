import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterModule],
  template: `
    <div class="min-h-screen text-white" style="background: var(--bg-primary);">
      <section class="relative pt-20 pb-16 px-4 sm:px-8">
        <div class="max-w-[420px] mx-auto">
          <div class="text-center mb-8">
            <h1 class="text-2xl md:text-3xl font-extrabold mb-2">Connexion</h1>
            <p class="text-sm" style="color: rgba(255,255,255,0.6);">Connectez-vous à votre compte Sport IX</p>
          </div>

          <form (ngSubmit)="onLogin()" class="space-y-5 p-6 rounded-2xl" style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);">
            @if (error) {
              <div class="p-3 rounded-xl text-sm text-center" style="background: rgba(255,82,82,0.1); border: 1px solid rgba(255,82,82,0.2); color: var(--error);">{{ error }}</div>
            }

            <div>
              <label for="login-email" class="block text-sm font-medium mb-2" style="color: rgba(255,255,255,0.7);">Email</label>
              <input id="login-email" type="email" [(ngModel)]="email" name="email" required autocomplete="email"
                class="w-full px-4 py-3 rounded-xl text-white text-sm outline-none"
                style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.10);"
                placeholder="spectateur@sport-ix.com">
            </div>

            <div>
              <label for="login-password" class="block text-sm font-medium mb-2" style="color: rgba(255,255,255,0.7);">Mot de passe</label>
              <input id="login-password" type="password" [(ngModel)]="password" name="password" required autocomplete="current-password"
                class="w-full px-4 py-3 rounded-xl text-white text-sm outline-none"
                style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.10);"
                placeholder="••••••••">
            </div>

            <button type="submit" [disabled]="loading" class="accent-btn w-full py-3 text-sm font-semibold rounded-xl">
              {{ loading ? 'Connexion...' : 'Se connecter' }}
            </button>

            <div class="text-center text-sm" style="color: rgba(255,255,255,0.5);">
              Pas encore de compte ?
              <a routerLink="/auth/register" class="font-semibold" style="color: var(--accent-primary);">S'inscrire</a>
            </div>
          </form>

          <!-- Demo accounts -->
          <div class="mt-6 p-4 rounded-xl text-sm" style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06);">
            <div class="font-semibold mb-2" style="color: rgba(255,255,255,0.5);">Comptes démo</div>
            <div class="space-y-1 text-xs" style="color: rgba(255,255,255,0.4);">
              <div><strong>Spectateur :</strong> spectateur&#64;sport-ix.com / Spectateur2024!</div>
              <div><strong>Club :</strong> club&#64;sport-ix.com / Club2024!</div>
            </div>
          </div>
          
          <!-- Spacer for visual balance -->
          <div class="h-8"></div>
        </div>
      </section>
    </div>
  `,
  styles: [``]
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';
  loading = false;

  private authService = inject(AuthService);
  private router = inject(Router);

  async onLogin(): Promise<void> {
    this.error = '';
    this.loading = true;
    try {
      await this.authService.login({ email: this.email, password: this.password });
      
      // Redirect to role-specific dashboard
      if (this.authService.isClub()) {
        this.router.navigate(['/club/dashboard']);
      } else {
        this.router.navigate(['/spectator/dashboard']);
      }
    } catch (err: unknown) {
      const e = err as { error?: { error?: string } };
      this.error = e?.error?.error || 'Identifiants incorrects';
    } finally {
      this.loading = false;
    }
  }
}
