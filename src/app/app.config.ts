import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {
  provideRouter,
  withEnabledBlockingInitialNavigation,
  withHashLocation,
  withInMemoryScrolling,
  withRouterConfig,
  withDebugTracing
  // withViewTransitions // Disabled to prevent ViewTransition conflicts
} from '@angular/router';

import { DropdownModule, SidebarModule } from '@coreui/angular';
import { IconSetService } from '@coreui/icons-angular';
import { routes } from './app.routes';

// Enable router diagnostics - set to false in production
const ENABLE_ROUTER_DIAGNOSTICS = true;

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes,
      withRouterConfig({
        onSameUrlNavigation: 'reload'
      }),
      withInMemoryScrolling({
        scrollPositionRestoration: 'top',
        anchorScrolling: 'enabled'
      }),
      withEnabledBlockingInitialNavigation(),
      // withViewTransitions(), // Disabled to prevent ViewTransition conflicts
      withHashLocation(),
      // Enable Angular's built-in router tracing for detailed diagnostics
      ...(ENABLE_ROUTER_DIAGNOSTICS ? [withDebugTracing()] : [])
    ),
    importProvidersFrom(SidebarModule, DropdownModule),
    IconSetService,
    provideAnimationsAsync()
  ]
};
