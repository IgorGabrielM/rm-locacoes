import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { FormContrato } from './pages/form-contrato/form-contrato';
import { ContratoDetails } from './pages/contrato-details/contrato-details';
import { Auth } from './pages/auth/auth';
import { authGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: Home,
    canActivate: [authGuard],
    pathMatch: 'full',
  },
  {
    path: 'form-contrato',
    component: FormContrato,
    canActivate: [authGuard],
  },
  {
    path: 'contrato-details',
    component: ContratoDetails,
  },
  {
    path: 'auth',
    component: Auth,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
