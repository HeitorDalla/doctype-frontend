import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

import { ApiService } from '../../core/api.service';
import { Usuario, UsuarioForm } from '../../core/models';
import { SessionService } from '../../core/session.service';

@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.css'
})
export class UsuarioComponent {
  message = '';
  loading = false;
  usuarios: Usuario[] = [];

  private readonly fb = inject(FormBuilder);

  readonly form = this.fb.nonNullable.group({
    nome: ['', [Validators.required, Validators.minLength(3)]],
    nomeUsuario: [''],
    telefone: [''],
    cpf: [''],
    endereco: [''],
    cep: [''],
    email: ['', [Validators.required, Validators.email]],
    senha: ['', [Validators.required, Validators.minLength(6)]],
    perfilAcesso: ['OPERADOR']
  });

  constructor(
    private readonly api: ApiService,
    private readonly session: SessionService
  ) {
    void this.loadUsuarios();
  }

  async loadUsuarios(): Promise<void> {
    try {
      this.usuarios = await this.api.get<Usuario[]>('/usuarios', this.session.token || undefined);
    } catch {
      this.usuarios = [];
    }
  }

  async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.message = '';

    try {
      const payload = this.form.getRawValue() as UsuarioForm;
      await this.api.post<Usuario>('/usuarios', payload, this.session.token || undefined);
      this.message = 'Usuario criado com sucesso.';
      this.form.reset({ perfilAcesso: 'OPERADOR' });
      await this.loadUsuarios();
    } catch (error) {
      this.message = error instanceof Error ? error.message : 'Falha ao criar usuario';
    } finally {
      this.loading = false;
    }
  }
}
