import { Component } from '@angular/core';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-auth',
  standalone: false,
  templateUrl: './auth.html',
  styleUrl: './auth.scss',
})
export class Auth {
  constructor(
    private authService: AuthService) {
  }

  login(): void {
    this.authService.login({email: 'fl41.art@gmail.com', password: 'Familia440'}).subscribe((res) => {
      console.log(res);
    })
  }
}
