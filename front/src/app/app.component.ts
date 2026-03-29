import { Component, OnInit, inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { NavigationComponent } from './shared/navigation/navigation.component';
import { FooterComponent } from './shared/footer/footer.component';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavigationComponent, FooterComponent],
  template: `
    <app-navigation />
    <main [class]="'pt-0'">
      <router-outlet />
    </main>
    <app-footer />
  `,
  styles: [`
    main {
      min-height: calc(100vh - 160px);
    }
  `]
})
export class AppComponent implements OnInit {
  private router = inject(Router);
  private isBrowser = typeof window !== 'undefined';

  ngOnInit(): void {
    // Scroll automatique en haut sur chaque changement de page (comme Sportix)
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      // Scroll top après rendu - sauf si fragment (géré par la page elle-même)
      const hasFragment = event.url.includes('#');
      if (this.isBrowser && !hasFragment) {
        requestAnimationFrame(() => {
          document.body.scrollTo(0, 0);
          window.scrollTo(0, 0);
        });
      }
    });
  }
}
