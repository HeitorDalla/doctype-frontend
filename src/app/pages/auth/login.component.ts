import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { SessionService } from '../../core/session.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  message = '';
  loading = false;

  private readonly fb = inject(FormBuilder);

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    senha: ['', [Validators.required, Validators.minLength(6)]]
  });

  constructor(
    private readonly session: SessionService,
    private readonly router: Router
  ) {}

  async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.message = '';

    try {
      await this.session.login(this.form.getRawValue().email, this.form.getRawValue().senha);
      await this.router.navigateByUrl('/dashboard');
    } catch (error) {
      this.message = error instanceof Error ? error.message : 'Falha ao fazer login';
    } finally {
      this.loading = false;
    }
  }
}
