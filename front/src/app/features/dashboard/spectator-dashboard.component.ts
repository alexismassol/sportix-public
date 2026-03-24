import { Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DatePipe } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { EventService } from '../../core/services/event.service';

interface SpectatorTicket {
  id: string;
  eventTitle: string;
  eventDate: Date;
  eventLocation: string;
  seatInfo: string;
  status: 'upcoming' | 'used' | 'expired';
  price: number;
}

@Component({
  selector: 'app-spectator-dashboard',
  standalone: true,
  imports: [RouterModule, DatePipe],
  template: `
    <div class="min-h-screen text-white" style="background: var(--bg-primary);">
      <section class="relative py-20 px-4 sm:px-8">
        <div class="max-w-[1000px] mx-auto">
          <div class="mb-8">
            <h1 class="text-2xl font-extrabold mb-1">
              Bienvenue, <span class="text-gradient">{{ auth.user()?.firstName }}</span>
            </h1>
            <p class="text-sm" style="color: rgba(255,255,255,0.5);">Vos billets et votre activité Sport IX</p>
          </div>

          <!-- Spectator Stats -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div class="p-4 rounded-xl" style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);">
              <div class="text-2xl font-bold mb-1" style="color: var(--accent-primary);">{{ spectatorStats.totalTickets }}</div>
              <div class="text-xs" style="color: rgba(255,255,255,0.5);">Billets achetés</div>
            </div>
            <div class="p-4 rounded-xl" style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);">
              <div class="text-2xl font-bold mb-1" style="color: var(--accent-primary);">{{ spectatorStats.upcomingEvents }}</div>
              <div class="text-xs" style="color: rgba(255,255,255,0.5);">Événements à venir</div>
            </div>
            <div class="p-4 rounded-xl" style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);">
              <div class="text-2xl font-bold mb-1" style="color: var(--accent-primary);">{{ spectatorStats.points }}</div>
              <div class="text-xs" style="color: rgba(255,255,255,0.5);">Points fidélité</div>
            </div>
            <div class="p-4 rounded-xl" style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);">
              <div class="text-2xl font-bold mb-1" style="color: var(--accent-primary);">{{ spectatorStats.votesCast }}</div>
              <div class="text-xs" style="color: rgba(255,255,255,0.5);">Votes effectués</div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <a routerLink="/events" class="flex items-center gap-3 p-4 rounded-xl transition-all hover:-translate-y-0.5" style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);">
              <div class="w-10 h-10 rounded-lg flex items-center justify-center" style="background: rgba(255,45,85,0.15);">
                <svg class="w-5 h-5" style="color: var(--accent-primary);" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"/>
                </svg>
              </div>
              <div>
                <div class="text-sm font-semibold text-white">Explorer les Événements</div>
                <div class="text-xs" style="color: rgba(255,255,255,0.4);">Découvrir</div>
              </div>
            </a>
            <a routerLink="/profile" class="flex items-center gap-3 p-4 rounded-xl transition-all hover:-translate-y-0.5" style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);">
              <div class="w-10 h-10 rounded-lg flex items-center justify-center" style="background: rgba(139,92,246,0.15);">
                <svg class="w-5 h-5" style="color: var(--purple);" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/>
                </svg>
              </div>
              <div>
                <div class="text-sm font-semibold text-white">Mon Profil</div>
                <div class="text-xs" style="color: rgba(255,255,255,0.4);">Infos personnelles</div>
              </div>
            </a>
          </div>

          <!-- Recent Tickets -->
          <div class="p-6 rounded-2xl" style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);">
            <h2 class="text-lg font-bold mb-4 text-white">Mes billets récents</h2>
            <div class="space-y-3">
              @for (ticket of recentTickets; track ticket.id) {
                <div class="flex items-center justify-between p-3 rounded-xl" style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05);">
                  <div class="flex-1">
                    <div class="font-medium text-white">{{ ticket.eventTitle }}</div>
                    <div class="text-sm" style="color: rgba(255,255,255,0.4);">
                      {{ ticket.eventDate | date:'dd/MM/yyyy HH:mm' }} • {{ ticket.eventLocation }}
                    </div>
                    <div class="text-xs mt-1" style="color: rgba(255,255,255,0.4);">Place: {{ ticket.seatInfo }}</div>
                  </div>
                  <div class="text-right">
                    <div class="text-sm font-medium" style="color: var(--accent-primary);">
                      {{ ticket.price }}€
                    </div>
                    <div class="text-xs px-2 py-1 rounded-full mt-1" 
                         [style]="ticket.status === 'upcoming' ? 'background: rgba(0,230,118,0.15); color: var(--success);' : 
                                   ticket.status === 'used' ? 'background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.5);' : 
                                   'background: rgba(255,107,53,0.15); color: var(--warning);'">
                      {{ ticket.status === 'upcoming' ? 'À venir' : ticket.status === 'used' ? 'Utilisé' : 'Expiré' }}
                    </div>
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
export class SpectatorDashboardComponent implements OnInit {
  auth = inject(AuthService);
  eventService = inject(EventService);

  spectatorStats = {
    totalTickets: 0,
    upcomingEvents: 0,
    points: 0,
    votesCast: 0
  };

  recentTickets: SpectatorTicket[] = [];

  ngOnInit(): void {
    this.loadSpectatorData();
  }

  private loadSpectatorData(): void {
    // Simuler des données de spectateur
    this.spectatorStats = {
      totalTickets: 12,
      upcomingEvents: 3,
      points: 850,
      votesCast: 28
    };

    this.recentTickets = [
      {
        id: '1',
        eventTitle: 'Match de football - Club A vs Club B',
        eventDate: new Date('2024-03-25T20:00:00'),
        eventLocation: 'Stade Municipal',
        seatInfo: 'Tribune A, Siège 15',
        status: 'upcoming',
        price: 25
      },
      {
        id: '2',
        eventTitle: 'Concert de Jazz',
        eventDate: new Date('2024-03-20T20:00:00'),
        eventLocation: 'Salle de Concert',
        seatInfo: 'Catégorie 1, Rang 3',
        status: 'used',
        price: 35
      },
      {
        id: '3',
        eventTitle: 'Tournoi de tennis',
        eventDate: new Date('2024-03-15T14:00:00'),
        eventLocation: 'Tennis Club',
        seatInfo: 'Central, Place 22',
        status: 'used',
        price: 18
      }
    ];
  }
}
