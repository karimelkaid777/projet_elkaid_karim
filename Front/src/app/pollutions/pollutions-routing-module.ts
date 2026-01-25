import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PollutionList } from './components/pollution-list/pollution-list';
import { PollutionForm } from './components/pollution-form/pollution-form';
import { PollutionDetail } from './components/pollution-detail/pollution-detail';
import { FavoritesComponent } from './components/favorites/favorites';
import { authGuard } from '../shared/guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  { path: 'list', component: PollutionList },
  { path: 'favorites', component: FavoritesComponent, canActivate: [authGuard] },
  { path: 'new', component: PollutionForm, canActivate: [authGuard] },
  { path: 'edit/:id', component: PollutionForm, canActivate: [authGuard] },
  { path: 'detail/:id', component: PollutionDetail }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PollutionsRoutingModule { }
