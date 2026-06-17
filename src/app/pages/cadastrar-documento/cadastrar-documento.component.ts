import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

import { ApiService } from '../../core/api.service';
import { Documento, TipoDocumento } from '../../core/models';
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
  tiposDocumento: TipoDocumento[] = [];
  statusOpcoes: string[] = ['Recebido', 'Em análise', 'Encaminhado', 'Finalizado'];
  arquivoSelecionado: File | null = null;

  private readonly fb = inject(FormBuilder);

  readonly form = this.fb.nonNullable.group({
    nome: ['', [Validators.required]],
    descricao: [''],
    tipoArquivo: ['', [Validators.required]],
    status: ['Recebido', [Validators.required]],
    arquivoNome: ['', [Validators.required]]
  });

  constructor(
    private readonly api: ApiService,
    private readonly session: SessionService
  ) {
    void Promise.all([this.loadTiposDocumento(), this.loadStatusOpcoes(), this.loadDocumentos()]);
  }

  async loadDocumentos(): Promise<void> {
    try {
      this.documentos = await this.api.get<Documento[]>('/documentos', this.session.token || undefined);
    } catch {
      this.documentos = [];
    }
  }

  async loadTiposDocumento(): Promise<void> {
    try {
      this.tiposDocumento = await this.api.get<TipoDocumento[]>('/tipos-documento', this.session.token || undefined);
      if (this.tiposDocumento.length > 0 && !this.form.controls.tipoArquivo.value) {
        this.form.patchValue({ tipoArquivo: this.tiposDocumento[0].nome });
      }
    } catch {
      this.tiposDocumento = [];
    }
  }

  async loadStatusOpcoes(): Promise<void> {
    try {
      this.statusOpcoes = await this.api.get<string[]>('/documentos/status-opcoes', this.session.token || undefined);
    } catch {
      this.statusOpcoes = ['Recebido', 'Em análise', 'Encaminhado', 'Finalizado'];
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
      payload.append('tipoArquivo', value.tipoArquivo || '');
      payload.append('status', value.status || 'Recebido');
      payload.append('arquivoNome', value.arquivoNome || this.arquivoSelecionado.name);
      payload.append('arquivoContentType', this.arquivoSelecionado.type || '');

      if (this.session.user?.id) {
        payload.append('usuarioId', String(this.session.user.id));
      }

      payload.append('arquivo', this.arquivoSelecionado, this.arquivoSelecionado.name);

      await this.api.postForm<Documento>('/documentos', payload, this.session.token || undefined);
      window.dispatchEvent(new CustomEvent('doctype:changed'));
      this.message = 'Documento criado com sucesso.';
      this.form.reset({ tipoArquivo: this.tiposDocumento[0]?.nome || '', status: 'Recebido', arquivoNome: '' });
      this.arquivoSelecionado = null;
      await this.loadDocumentos();
    } catch (error) {
      this.message = error instanceof Error ? error.message : 'Falha ao criar documento';
    } finally {
      this.loading = false;
    }
  }

}
