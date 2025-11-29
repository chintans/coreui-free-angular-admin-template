import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./client-portal.component').then(m => m.ClientPortalComponent),
        data: {
            title: 'Client Portal'
        }
    }
];
