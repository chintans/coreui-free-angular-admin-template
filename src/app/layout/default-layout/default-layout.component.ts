import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NgScrollbar } from 'ngx-scrollbar';

import { IconDirective } from '@coreui/icons-angular';
import {
  ContainerComponent,
  ShadowOnScrollDirective,
  SidebarBrandComponent,
  SidebarComponent,
  SidebarFooterComponent,
  SidebarHeaderComponent,
  SidebarNavComponent,
  SidebarToggleDirective,
  SidebarTogglerDirective
} from '@coreui/angular';

import { DefaultFooterComponent, DefaultHeaderComponent } from './';
import { navItems, NavItemWithRole } from './_nav';
import { AuthService } from '../../core/services/auth.service';

function isOverflown(element: HTMLElement) {
  return (
    element.scrollHeight > element.clientHeight ||
    element.scrollWidth > element.clientWidth
  );
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss'],
  imports: [
    SidebarComponent,
    SidebarHeaderComponent,
    SidebarBrandComponent,
    SidebarNavComponent,
    SidebarFooterComponent,
    SidebarToggleDirective,
    SidebarTogglerDirective,
    ContainerComponent,
    DefaultFooterComponent,
    DefaultHeaderComponent,
    IconDirective,
    NgScrollbar,
    RouterOutlet,
    RouterLink,
    ShadowOnScrollDirective
  ]
})
export class DefaultLayoutComponent {
  private readonly authService = inject(AuthService);

  // Filter navigation items based on user role
  public navItems = computed(() => {
    const userRole = this.authService.userRole();
    if (!userRole) {
      return [];
    }

    return navItems.filter(item => {
      // If no roles specified, show to all authenticated users
      if (!item.roles || item.roles.length === 0) {
        return true;
      }
      // Check if user role is in allowed roles
      return item.roles.includes(userRole);
    }).map(item => {
      // Recursively filter children if they exist
      if (item.children && item.children.length > 0) {
        return {
          ...item,
          children: item.children.filter(child => {
            if (!child.roles || child.roles.length === 0) {
              return true;
            }
            return child.roles.includes(userRole);
          })
        };
      }
      return item;
    });
  });
}
