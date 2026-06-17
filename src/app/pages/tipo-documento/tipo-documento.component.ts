import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

import { ApiService } from '../../core/api.service';
import { TipoDocumento } from '../../core/models';
import { SessionService } from '../../core/session.service';

@Component({
  selector: 'app-tipo-documento',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './tipo-documento.component.html',
  styleUrl: './tipo-documento.component.css'
})
export class TipoDocumentoComponent implements OnInit {
  tiposDocumento: TipoDocumento[] = [];
  message = '';
  loading = false;

  private readonly fb = inject(FormBuilder);

  readonly form = this.fb.nonNullable.group({
    nome: ['', [Validators.required, Validators.minLength(3)]],
    descricao: ['']
  });

  constructor(
    private readonly api: ApiService,
    private readonly session: SessionService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.carregarTipos();
  }

  async carregarTipos(): Promise<void> {
    try {
      this.tiposDocumento = await this.api.get<TipoDocumento[]>('/tipos-documento', this.session.token || undefined);
    } catch (error) {
      this.tiposDocumento = [];
      this.message = error instanceof Error ? error.message : 'Falha ao carregar tipos de documento';
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
      const value = this.form.getRawValue();
      const criado = await this.api.post<TipoDocumento>('/tipos-documento', {
        nome: value.nome.trim(),
        descricao: value.descricao.trim() || null
      }, this.session.token || undefined);

      this.tiposDocumento = [...this.tiposDocumento, criado].sort((a, b) => a.nome.localeCompare(b.nome));
      this.form.reset();
      window.dispatchEvent(new CustomEvent('doctype:changed'));
      this.message = 'Tipo de documento cadastrado com sucesso.';
    } catch (error) {
      this.message = error instanceof Error ? error.message : 'Falha ao cadastrar tipo de documento';
    } finally {
      this.loading = false;
    }
  }
}