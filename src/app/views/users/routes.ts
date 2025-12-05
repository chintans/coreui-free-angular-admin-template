import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./user-list/user-list.component').then(m => m.UserListComponent),
    data: {
      title: 'Users Management'
    }
  },
  {
    path: 'new',
    loadComponent: () => import('./new-user/new-user.component').then(m => m.NewUserComponent),
    data: {
      title: 'New User'
    }
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./new-user/new-user.component').then(m => m.NewUserComponent),
    data: {
      title: 'Edit User'
    }
  }
];

