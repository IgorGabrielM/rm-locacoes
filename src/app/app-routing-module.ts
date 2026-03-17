import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {Home} from './pages/home/home';
import {FormContrato} from './pages/form-contrato/form-contrato';

const routes: Routes = [
  {
    path: 'home',
    component: Home,
    pathMatch: 'full',
  },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'form-contrato',
    component: FormContrato
  },
  {
    path: 'contrato-details',
    component: FormContrato
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
