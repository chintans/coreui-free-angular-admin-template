import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./marketplace.component').then(m => m.MarketplaceComponent),
        data: {
            title: 'Marketplace'
        }
    }
];
