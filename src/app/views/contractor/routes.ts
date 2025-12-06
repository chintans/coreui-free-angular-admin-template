import { Routes } from '@angular/router';
import { roleGuard } from '../../core/guards/role.guard';
import { UserRole } from '../../core/models/user.model';

export const routes: Routes = [
  {
    path: 'profile',
    loadComponent: () => import('./contractor-profile/contractor-profile.component').then(m => m.ContractorProfileComponent),
    canActivate: [roleGuard],
    data: { roles: [UserRole.CONTRACTOR] },
    title: 'Contractor Profile'
  }
];

