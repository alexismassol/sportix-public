import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { EventService } from '../../core/services/event.service';

interface ProfileData {
  stats?: { totalTickets?: number; creditsBalance?: number };
  [key: string]: unknown;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  template: `
    <div class="min-h-screen text-white" style="background: var(--bg-primary);">
      <section class="relative py-20 px-4 sm:px-8">
        <div class="max-w-[600px] mx-auto">
          <h1 class="text-2xl font-extrabold mb-8">Mon Profil</h1>

          <div class="p-6 rounded-2xl mb-6" style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);">
            <div class="flex items-center gap-4 mb-6">
              <div class="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold" style="background: var(--accent-gradient);">
                {{ auth.user()?.firstName?.charAt(0) }}{{ auth.user()?.lastName?.charAt(0) }}
              </div>
              <div>
                <div class="text-lg font-bold">{{ auth.user()?.firstName }} {{ auth.user()?.lastName }}</div>
                <div class="text-sm" style="color: rgba(255,255,255,0.5);">{{ auth.user()?.email }}</div>
                <span class="inline-block mt-1 text-xs px-2 py-0.5 rounded-full font-semibold" style="background: rgba(255,45,85,0.15); color: var(--accent-primary);">
                  {{ auth.user()?.role === 'club' ? 'Club' : 'Spectateur' }}
                </span>
              </div>
            </div>

            <div class="space-y-4">
              <div class="flex items-center justify-between py-3" style="border-bottom: 1px solid rgba(255,255,255,0.06);">
                <span class="text-sm" style="color: rgba(255,255,255,0.5);">Prénom</span>
                <span class="text-sm font-medium">{{ auth.user()?.firstName }}</span>
              </div>
              <div class="flex items-center justify-between py-3" style="border-bottom: 1px solid rgba(255,255,255,0.06);">
                <span class="text-sm" style="color: rgba(255,255,255,0.5);">Nom</span>
                <span class="text-sm font-medium">{{ auth.user()?.lastName }}</span>
              </div>
              <div class="flex items-center justify-between py-3" style="border-bottom: 1px solid rgba(255,255,255,0.06);">
                <span class="text-sm" style="color: rgba(255,255,255,0.5);">Email</span>
                <span class="text-sm font-medium">{{ auth.user()?.email }}</span>
              </div>
              <div class="flex items-center justify-between py-3" style="border-bottom: 1px solid rgba(255,255,255,0.06);">
                <span class="text-sm" style="color: rgba(255,255,255,0.5);">Rôle</span>
                <span class="text-sm font-medium">{{ auth.user()?.role === 'club' ? 'Club - ' + auth.user()?.clubName : 'Spectateur' }}</span>
              </div>
            </div>
          </div>

          <!-- Stats -->
          @if (profileData) {
            <div class="grid grid-cols-2 gap-4">
              <div class="p-4 rounded-xl text-center" style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);">
                <div class="text-xl font-bold" style="color: var(--accent-primary);">{{ profileData.stats?.totalTickets || 0 }}</div>
                <div class="text-xs mt-1" style="color: rgba(255,255,255,0.5);">Billets total</div>
              </div>
              <div class="p-4 rounded-xl text-center" style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);">
                <div class="text-xl font-bold" style="color: var(--success);">{{ profileData.stats?.creditsBalance || 0 }}€</div>
                <div class="text-xs mt-1" style="color: rgba(255,255,255,0.5);">Crédits</div>
              </div>
            </div>
          }
        </div>
      </section>
    </div>
  `,
  styles: [``]
})
export class ProfileComponent implements OnInit {
  profileData: ProfileData | null = null;

  auth = inject(AuthService);
  private eventService = inject(EventService);

  ngOnInit(): void {
    this.eventService.getProfile().subscribe({
      next: (data) => { this.profileData = data as ProfileData; },
      error: () => { /* demo: ignore API errors */ }
    });
  }
}
