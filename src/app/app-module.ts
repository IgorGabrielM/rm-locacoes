import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import {providePrimeNG} from 'primeng/config';
import Aura from '@primeng/themes/aura';
import Lara from '@primeng/themes/aura';
import { Home } from './pages/home/home';
import {BrowserAnimationsModule, provideAnimations} from '@angular/platform-browser/animations';
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
import {definePreset} from '@primeng/themes';
import { Auth } from './pages/auth/auth';
import {SkeletonModule} from 'primeng/skeleton';
import {TableModule} from 'primeng/table';

const MyTheme = definePreset(Lara, {
  semantic: {
    primary: {
      50: '{sky.50}',
      100: '{sky.100}',
      200: '{sky.200}',
      300: '{sky.300}',
      400: '{sky.400}',
      500: '{sky.500}', // Esta é a cor principal que você viu sumir
      600: '{sky.600}',
      700: '{sky.700}',
      800: '{sky.800}',
      900: '{sky.900}',
      950: '{sky.950}'
    }
  }
});

@NgModule({
  declarations: [
    App,
    Home,
    FormContrato,
    ContratoDetails,
    Auth
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
    ProgressSpinner,
    SkeletonModule,
    TableModule
  ],
  providers: [
    providePrimeNG({
      theme: {
        preset: MyTheme, // Usa o nosso preset com azul forçado
        options: {
          darkModeSelector: '.my-app-dark' // Evita que mude sozinho
        }
      }
    }),
    provideBrowserGlobalErrorListeners()
  ],
  bootstrap: [App]
})
export class AppModule { }
