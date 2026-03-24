import { Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DatePipe } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { EventService } from '../../core/services/event.service';

interface ClubEvent {
  id: string;
  title: string;
  date: Date;
  location: string;
  ticketsSold: number;
  maxCapacity: number;
  status: 'upcoming' | 'ongoing' | 'completed';
}

@Component({
  selector: 'app-club-dashboard',
  standalone: true,
  imports: [RouterModule, DatePipe],
  template: `
    <div class="min-h-screen text-white" style="background: var(--bg-primary);">
      <section class="relative py-20 px-4 sm:px-8">
        <div class="max-w-[1000px] mx-auto">
          <div class="mb-8">
            <h1 class="text-2xl font-extrabold mb-1">
              Tableau de bord Club, <span class="text-gradient">{{ auth.user()?.firstName }}</span>
            </h1>
            <p class="text-sm" style="color: rgba(255,255,255,0.5);">Gérez vos événements et suivez vos performances</p>
          </div>

          <!-- Club Stats -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div class="p-4 rounded-xl" style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);">
              <div class="text-2xl font-bold mb-1" style="color: var(--accent-primary);">{{ clubStats.eventsCount }}</div>
              <div class="text-xs" style="color: rgba(255,255,255,0.5);">Événements</div>
            </div>
            <div class="p-4 rounded-xl" style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);">
              <div class="text-2xl font-bold mb-1" style="color: var(--accent-primary);">{{ clubStats.totalTickets }}</div>
              <div class="text-xs" style="color: rgba(255,255,255,0.5);">Billets vendus</div>
            </div>
            <div class="p-4 rounded-xl" style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);">
              <div class="text-2xl font-bold mb-1" style="color: var(--accent-primary);">{{ clubStats.revenue }}€</div>
              <div class="text-xs" style="color: rgba(255,255,255,0.5);">Revenus</div>
            </div>
            <div class="p-4 rounded-xl" style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);">
              <div class="text-2xl font-bold mb-1" style="color: var(--accent-primary);">{{ clubStats.activeEvents }}</div>
              <div class="text-xs" style="color: rgba(255,255,255,0.5);">Actifs</div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <a routerLink="/events/create" class="flex items-center gap-3 p-4 rounded-xl transition-all hover:-translate-y-0.5" style="background: rgba(232,25,44,0.15); border: 1px solid rgba(232,25,44,0.2);">
              <div class="w-10 h-10 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5" style="color: var(--accent-primary);" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
                </svg>
              </div>
              <div>
                <div class="text-sm font-semibold text-white">Créer un événement</div>
                <div class="text-xs" style="color: rgba(255,255,255,0.4);">Nouveau match</div>
              </div>
            </a>
            <a routerLink="/events" class="flex items-center gap-3 p-4 rounded-xl transition-all hover:-translate-y-0.5" style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);">
              <div class="w-10 h-10 rounded-lg flex items-center justify-center" style="background: rgba(139,92,246,0.15);">
                <svg class="w-5 h-5" style="color: var(--purple);" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"/>
                </svg>
              </div>
              <div>
                <div class="text-sm font-semibold text-white">Mes Événements</div>
                <div class="text-xs" style="color: rgba(255,255,255,0.4);">Gérer</div>
              </div>
            </a>
            <a routerLink="/demo/scan-billet" class="flex items-center gap-3 p-4 rounded-xl transition-all hover:-translate-y-0.5" style="background: rgba(0,230,118,0.15); border: 1px solid rgba(0,230,118,0.2);">
              <div class="w-10 h-10 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6" style="color: var(--success);" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75zM6.75 16.5h.75v.75h-.75v-.75zM16.5 6.75h.75v.75h-.75v-.75zM13.5 13.5h.75v.75h-.75v-.75zM13.5 19.5h.75v.75h-.75v-.75zM19.5 13.5h.75v.75h-.75v-.75zM19.5 19.5h.75v.75h-.75v-.75zM16.5 16.5h.75v.75h-.75v-.75z"/>
                </svg>
              </div>
              <div>
                <div class="text-sm font-semibold text-white">Scanner Billets</div>
                <div class="text-xs" style="color: rgba(255,255,255,0.4);">Valider entrées</div>
              </div>
            </a>
          </div>

          <!-- Recent Events -->
          <div class="p-6 rounded-2xl" style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);">
            <h2 class="text-lg font-bold mb-4 text-white">Événements récents</h2>
            <div class="space-y-3">
              @for (event of recentEvents; track event.id) {
                <div class="flex items-center justify-between p-3 rounded-xl" style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05);">
                  <div class="flex-1">
                    <div class="font-medium text-white">{{ event.title }}</div>
                    <div class="text-sm" style="color: rgba(255,255,255,0.4);">
                      {{ event.date | date:'dd/MM/yyyy HH:mm' }} • {{ event.location }}
                    </div>
                  </div>
                  <div class="text-right">
                    <div class="text-sm font-medium" style="color: var(--accent-primary);">
                      {{ event.ticketsSold }}/{{ event.maxCapacity }}
                    </div>
                    <div class="text-xs" style="color: rgba(255,255,255,0.4);">billets</div>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [``]
})
export class ClubDashboardComponent implements OnInit {
  auth = inject(AuthService);
  eventService = inject(EventService);

  clubStats = {
    eventsCount: 0,
    totalTickets: 0,
    revenue: 0,
    activeEvents: 0
  };

  recentEvents: ClubEvent[] = [];

  ngOnInit(): void {
    this.loadClubData();
  }

  private loadClubData(): void {
    // Simuler des données de club
    this.clubStats = {
      eventsCount: 8,
      totalTickets: 1250,
      revenue: 15600,
      activeEvents: 3
    };

    this.recentEvents = [
      {
        id: '1',
        title: 'Match de football - Club A vs Club B',
        date: new Date('2024-03-25T20:00:00'),
        location: 'Stade Municipal',
        ticketsSold: 450,
        maxCapacity: 500,
        status: 'upcoming'
      },
      {
        id: '2',
        title: 'Tournoi de tennis',
        date: new Date('2024-03-28T14:00:00'),
        location: 'Tennis Club',
        ticketsSold: 120,
        maxCapacity: 200,
        status: 'upcoming'
      }
    ];
  }
}
