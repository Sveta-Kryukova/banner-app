import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'items',
  },
  {
    path: 'items',
    loadComponent: () =>
      import('./features/item-list/item-list-page.component').then((m) => m.ItemListPageComponent),
  },
  {
    path: 'items/new',
    loadComponent: () =>
      import('./features/item-form/item-form-page.component').then((m) => m.ItemFormPageComponent),
  },
  {
    path: 'items/:id/edit',
    loadComponent: () =>
      import('./features/item-form/item-form-page.component').then((m) => m.ItemFormPageComponent),
  },
  { path: '**', redirectTo: 'items' },
];
