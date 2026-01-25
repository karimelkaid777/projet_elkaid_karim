import { Routes } from '@angular/router';
import { NotFound } from './not-found/not-found';

export const routes: Routes = [
  {
    path: 'pollutions',
    loadChildren: () => import('./pollutions/pollutions-module').then(m => m.PollutionsModule)
  },
  {
    path: 'users',
    loadChildren: () => import('./users/users-module').then(m => m.UsersModule)
  },
  { path: '', redirectTo: '/pollutions', pathMatch: 'full' },
  { path: 'not-found', component: NotFound },
  { path: '**', redirectTo: '/not-found' }
];
