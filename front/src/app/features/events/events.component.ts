import { Component, OnInit, inject } from '@angular/core';
import { EventService } from '../../core/services/event.service';
import { SportEvent } from '../../core/models/event.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [DatePipe],
  template: `
    <div class="min-h-screen text-white" style="background: var(--bg-primary);">
      <section class="relative pt-20 pb-16 px-4 sm:px-8">
        <div class="max-w-[1200px] mx-auto">
          <div class="text-center mb-12">
            <h1 class="text-3xl md:text-4xl font-extrabold mb-4">Événements sportifs</h1>
            <p class="text-base" style="color: rgba(255,255,255,0.7);">Découvrez les prochains événements et réservez vos places</p>
          </div>

          <!-- Filters -->
          <div class="flex flex-wrap gap-2 justify-center mb-8">
            @for (sport of sportTypes; track sport) {
              <button (click)="filterBySport(sport)"
                class="px-4 py-2 rounded-full text-xs font-semibold transition-all"
                [style.background]="activeSport === sport ? 'var(--accent-gradient)' : 'rgba(255,255,255,0.06)'"
                [style.border]="activeSport === sport ? 'none' : '1px solid rgba(255,255,255,0.10)'"
                [style.color]="activeSport === sport ? 'white' : 'rgba(255,255,255,0.6)'">
                {{ sport }}
              </button>
            }
          </div>

          @if (loading) {
            <div class="flex justify-center py-16">
              <div class="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style="border-color: var(--accent-primary); border-top-color: transparent;"></div>
            </div>
          } @else {
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              @for (event of filteredEvents; track event.id) {
                <div class="group relative overflow-hidden transition-all duration-[400ms] cursor-pointer w-full h-full hover:-translate-y-2" style="background: rgba(255,255,255,0.04); backdrop-filter: blur(10px); border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); border-top-color: rgba(255,255,255,0.2); box-shadow: 0 4px 24px rgba(0,0,0,0.1);">
                  <!-- Image section with sport gradient -->
                  <div class="relative h-[200px] overflow-hidden" style="border-radius: 16px 16px 0 0;">
                    <!-- Sport gradient background -->
                    <div class="w-full h-full flex items-center justify-center" style="background: linear-gradient(135deg, rgba(255,45,85,0.3), rgba(255,107,53,0.2));">
                      <span class="text-[4rem] opacity-30">⚽</span>
                    </div>
                    
                    <!-- Badges overlay -->
                    <div class="absolute top-3 left-3 right-3 flex justify-between items-start z-10">
                      <div class="flex items-center gap-1.5">
                        <span class="px-2 py-0.5 rounded text-[0.6rem] font-bold text-white" style="background: linear-gradient(135deg, rgba(255,45,85,0.9), rgba(255,107,53,0.9)); backdrop-filter: blur(10px) saturate(170%); letter-spacing: 0.05em;">{{ event.sportType }}</span>
                      </div>
                      <div class="flex items-center gap-1.5">
                        @if (event.status === 'upcoming') {
                          <span class="px-2 py-0.5 rounded text-[0.6rem] font-bold text-white" style="background: linear-gradient(135deg, rgba(0,230,118,0.85), rgba(16,185,129,0.85)); backdrop-filter: blur(10px) saturate(170%);">À VENIR</span>
                        }
                      </div>
                    </div>
                  </div>
                  
                  <!-- Content section -->
                  <div class="p-6">
                    <h3 class="text-lg font-bold mb-3 text-white leading-tight">{{ event.title }}</h3>
                    
                    <!-- Event details -->
                    <div class="space-y-2 mb-4">
                      <div class="flex items-center gap-2 text-sm" style="color: rgba(255,255,255,0.7);">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"/>
                        </svg>
                        {{ event.date | date:'dd MMMM yyyy' }}
                      </div>
                      <div class="flex items-center gap-2 text-sm" style="color: rgba(255,255,255,0.7);">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/>
                          <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/>
                        </svg>
                        {{ event.location }}
                      </div>
                      <div class="flex items-center gap-2 text-sm" style="color: rgba(255,255,255,0.7);">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"/>
                        </svg>
                        {{ event.clubName }}
                      </div>
                    </div>
                    
                    <!-- Price and availability -->
                    <div class="flex items-center justify-between pt-3 border-t" style="border-color: rgba(255,255,255,0.1);">
                      <div>
                        <span class="text-xl font-bold" style="color: var(--accent-primary);">{{ event.price }}€</span>
                        <div class="text-xs mt-1" style="color: rgba(255,255,255,0.5);">Places disponibles</div>
                      </div>
                      <button class="px-4 py-2 text-sm font-semibold rounded-lg transition-all" style="background: var(--accent-gradient); color: white;">
                        Réserver
                      </button>
                    </div>
                  </div>
                </div>
              }
            </div>
          }
        </div>
      </section>
    </div>
  `,
  styles: [``]
})
export class EventsComponent implements OnInit {
  events: SportEvent[] = [];
  filteredEvents: SportEvent[] = [];
  loading = true;
  sportTypes = ['Tous', 'Rugby', 'Football', 'Handball', 'Tennis', 'Athlétisme', 'Cyclisme'];
  activeSport = 'Tous';

  private eventService = inject(EventService);

  ngOnInit(): void {
    this.loadEvents();
  }

  private loadEvents(): void {
    this.eventService.getEvents().subscribe({
      next: (events) => {
        this.events = events;
        this.filteredEvents = events;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  filterBySport(sport: string): void {
    this.activeSport = sport;
    this.filteredEvents = sport === 'Tous' ? this.events : this.events.filter(e => e.sportType === sport);
  }
}
