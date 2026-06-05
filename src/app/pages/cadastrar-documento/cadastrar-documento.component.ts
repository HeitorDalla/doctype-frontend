import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

import { ApiService } from '../../core/api.service';
import { Documento, DocumentoForm } from '../../core/models';
import { SessionService } from '../../core/session.service';

@Component({
  selector: 'app-cadastrar-documento',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cadastrar-documento.component.html',
  styleUrl: './cadastrar-documento.component.css'
})
export class CadastrarDocumentoComponent {
  message = '';
  loading = false;
  documentos: Documento[] = [];
  arquivoSelecionado: File | null = null;

  private readonly fb = inject(FormBuilder);

  readonly form = this.fb.nonNullable.group({
    nome: ['', [Validators.required]],
    descricao: [''],
    tipoArquivo: ['PDF'],
    status: ['Em Análise'],
    arquivoNome: ['', [Validators.required]]
  });

  constructor(
    private readonly api: ApiService,
    private readonly session: SessionService
  ) {
    void this.loadDocumentos();
  }

  async loadDocumentos(): Promise<void> {
    try {
      this.documentos = await this.api.get<Documento[]>('/documentos', this.session.token || undefined);
    } catch {
      this.documentos = [];
    }
  }

  onArquivoSelecionado(event: Event): void {
    const input = event.target as HTMLInputElement;
    const arquivo = input.files?.[0] || null;
    this.arquivoSelecionado = arquivo;
    this.form.patchValue({
      arquivoNome: arquivo?.name || ''
    });
    this.form.controls.arquivoNome.markAsTouched();
  }

  async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (!this.arquivoSelecionado) {
      this.message = 'Selecione um arquivo para enviar.';
      return;
    }

    this.loading = true;
    this.message = '';

    try {
      const value = this.form.getRawValue();
      const payload = new FormData();

      payload.append('nome', value.nome);
      payload.append('descricao', value.descricao || '');
      payload.append('tipoArquivo', value.tipoArquivo || 'PDF');
      payload.append('status', value.status || 'Em Análise');
      payload.append('arquivoNome', value.arquivoNome || this.arquivoSelecionado.name);
      payload.append('arquivoContentType', this.arquivoSelecionado.type || '');

      if (this.session.user?.id) {
        payload.append('usuarioId', String(this.session.user.id));
      }

      payload.append('arquivo', this.arquivoSelecionado, this.arquivoSelecionado.name);

      await this.api.postForm<Documento>('/documentos', payload, this.session.token || undefined);
      this.message = 'Documento criado com sucesso.';
      this.form.reset({ tipoArquivo: 'PDF', status: 'Em Análise', arquivoNome: '' });
      this.arquivoSelecionado = null;
      await this.loadDocumentos();
    } catch (error) {
      this.message = error instanceof Error ? error.message : 'Falha ao criar documento';
    } finally {
      this.loading = false;
    }
  }
}
