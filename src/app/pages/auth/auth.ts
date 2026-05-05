import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auth',
  standalone: false,
  templateUrl: './auth.html',
  styleUrl: './auth.scss',
})
export class Auth {
  form: FormGroup;
  loading = false;
  erro = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/home']);
    }
  }

  login(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.erro = '';
    this.authService.login(this.form.value).subscribe({
      next: () => this.router.navigate(['/home']),
      error: () => {
        this.erro = 'E-mail ou senha inválidos.';
        this.loading = false;
      },
    });
  }
}
