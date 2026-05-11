import { Component } from '@angular/core';
import { ErrorService } from './services/error.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.scss'
})
export class App {
  constructor(public erroService: ErrorService) {}
}