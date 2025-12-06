import type { INavData } from '@coreui/angular';
import { UserRole } from '../../core/models/user.model';

export interface NavItemWithRole extends INavData {
  roles?: UserRole[];
  children?: NavItemWithRole[];
}

export const navItems: NavItemWithRole[] = [
  {
    name: 'Dashboard',
    url: '/dashboard',
    iconComponent: { name: 'cil-speedometer' },
    badge: {
      color: 'info',
      text: 'NEW'
    },
    roles: [UserRole.SUPER_ADMIN, UserRole.CONSULTANT, UserRole.CLIENT, UserRole.CONTRACTOR]
  },
  {
    name: 'Projects',
    url: '/projects',
    iconComponent: { name: 'cil-briefcase' },
    roles: [UserRole.SUPER_ADMIN, UserRole.CONSULTANT, UserRole.CONTRACTOR]
  },
  {
    name: 'Marketplace',
    url: '/marketplace',
    iconComponent: { name: 'cil-cart' },
    roles: [UserRole.SUPER_ADMIN, UserRole.CONSULTANT]
  },
  {
    name: 'Client Portal',
    url: '/client-portal',
    iconComponent: { name: 'cil-user' },
    roles: [UserRole.CLIENT]
  },
  {
    name: 'My Profile',
    url: '/contractor/profile',
    iconComponent: { name: 'cil-user' },
    roles: [UserRole.CONTRACTOR]
  },
  {
    name: 'Users',
    url: '/users',
    iconComponent: { name: 'cil-people' },
    roles: [UserRole.SUPER_ADMIN]
  },
  {
    name: 'Settings',
    url: '/settings',
    iconComponent: { name: 'cil-settings' },
    roles: [UserRole.SUPER_ADMIN]
  }
];
