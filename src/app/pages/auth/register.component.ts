import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { SessionService } from '../../core/session.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  message = '';
  loading = false;

  private readonly fb = inject(FormBuilder);

  readonly form = this.fb.nonNullable.group({
    nome: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    senha: ['', [Validators.required, Validators.minLength(6)]],
    confirmSenha: ['', [Validators.required]],
    perfilAcesso: ['OPERADOR']
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

    const value = this.form.getRawValue();
    if (value.senha !== value.confirmSenha) {
      this.message = 'As senhas não coincidem.';
      return;
    }

    this.loading = true;
    this.message = '';

    try {
      await this.session.register(value.nome, value.email, value.senha, value.perfilAcesso);
      await this.router.navigateByUrl('/dashboard');
    } catch (error) {
      this.message = error instanceof Error ? error.message : 'Falha ao registrar';
    } finally {
      this.loading = false;
    }
  }
}
