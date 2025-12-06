import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router, RouterEvent, RouterOutlet } from '@angular/router';
import { delay, filter, map, tap } from 'rxjs/operators';

import { ColorModeService } from '@coreui/angular';
import { IconSetService } from '@coreui/icons-angular';
import { iconSubset } from './icons/icon-subset';

@Component({
    selector: 'app-root',
    template: '<router-outlet />',
    imports: [RouterOutlet]
})
export class AppComponent implements OnInit {
  title = 'CoreUI Angular Admin Template';

  readonly #destroyRef: DestroyRef = inject(DestroyRef);
  readonly #activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  readonly #router = inject(Router);
  readonly #titleService = inject(Title);

  readonly #colorModeService = inject(ColorModeService);
  readonly #iconSetService = inject(IconSetService);

  constructor() {
    this.#titleService.setTitle(this.title);
    // iconSet singleton
    this.#iconSetService.icons = { ...iconSubset };
    this.#colorModeService.localStorageItemName.set('coreui-free-angular-admin-template-theme-default');
    this.#colorModeService.eventName.set('ColorSchemeChange');
  }

  ngOnInit(): void {
    // Suppress ViewTransition errors globally (backup in case view transitions are re-enabled)
    window.addEventListener('error', (event) => {
      if (
        event.error instanceof DOMException &&
        event.error.message?.includes('ViewTransition')
      ) {
        event.preventDefault();
        event.stopPropagation();
      }
    }, true);

    // Also catch unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      if (
        event.reason instanceof DOMException &&
        event.reason.message?.includes('ViewTransition')
      ) {
        event.preventDefault();
      }
    });

    // Enhanced router event logging for diagnostics
    const ENABLE_ROUTER_DIAGNOSTICS = true; // Set to false in production
    
    if (ENABLE_ROUTER_DIAGNOSTICS) {
      this.#router.events.pipe(
          takeUntilDestroyed(this.#destroyRef)
        ).subscribe((evt) => {
        // Log all router events for debugging
        if (evt instanceof NavigationStart) {
          console.group(`🔵 [Router] Navigation Start #${evt.id}`);
          console.log('📍 URL:', evt.url);
          console.log('🎯 Navigation Trigger:', evt.navigationTrigger);
          console.log('♻️  Restored State:', evt.restoredState);
          console.log('🔗 Current Router State:', {
            url: this.#router.url,
            state: this.#router.routerState
          });
          console.groupEnd();
        } else if (evt instanceof NavigationEnd) {
          console.group(`🟢 [Router] Navigation End #${evt.id}`);
          console.log('📍 Final URL:', evt.url);
          console.log('📍 URL After Redirects:', evt.urlAfterRedirects);
          console.log('✅ Navigation Successful');
          console.groupEnd();
        } else {
          console.log(`[Router] ${evt.constructor.name}:`, evt);
        }
      });
    } else {
      // Original minimal logging
      this.#router.events.pipe(
          takeUntilDestroyed(this.#destroyRef)
        ).subscribe((evt) => {
        if (!(evt instanceof NavigationEnd)) {
          return;
        }
      });
    }

    this.#activatedRoute.queryParams
      .pipe(
        delay(1),
        map(params => <string>params['theme']?.match(/^[A-Za-z0-9\s]+/)?.[0]),
        filter(theme => ['dark', 'light', 'auto'].includes(theme)),
        tap(theme => {
          this.#colorModeService.colorMode.set(theme);
        }),
        takeUntilDestroyed(this.#destroyRef)
      )
      .subscribe();
  }
}
