import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import {providePrimeNG} from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { Home } from './pages/home/home';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CardModule} from 'primeng/card';
import {InputTextModule} from 'primeng/inputtext';
import {InputMaskModule} from 'primeng/inputmask';
import {ButtonModule} from 'primeng/button';
import { FormContrato } from './pages/form-contrato/form-contrato';
import {HttpClientModule} from '@angular/common/http';
import { SpeedDialModule } from 'primeng/speeddial';
import { ContratoDetails } from './pages/contrato-details/contrato-details';
import {RouterModule} from '@angular/router';
import {ConfirmDialog} from 'primeng/confirmdialog';
import {BlockUI} from 'primeng/blockui';
import {ProgressSpinner} from 'primeng/progressspinner';

@NgModule({
  declarations: [
    App,
    Home,
    FormContrato,
    ContratoDetails
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    CardModule,
    InputTextModule,
    InputMaskModule,
    ButtonModule,
    SpeedDialModule,
    RouterModule,
    HttpClientModule,
    ConfirmDialog,
    BlockUI,
    ProgressSpinner
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    providePrimeNG({
      theme: {
        preset: Aura
      }
    })
  ],
  bootstrap: [App]
})
export class AppModule { }
