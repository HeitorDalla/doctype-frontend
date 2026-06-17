import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { ApiService } from '../../core/api.service';
import { Atividade, Documento, TipoDocumento } from '../../core/models';
import { SessionService } from '../../core/session.service';

@Component({
  selector: 'app-consulta-documento',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './consulta-documento.component.html',
  styleUrl: './consulta-documento.component.css'
})
export class ConsultaDocumentoComponent implements OnInit {
  documentos: Documento[] = [];
  statusOpcoes: string[] = ['Recebido', 'Em análise', 'Encaminhado', 'Finalizado'];
  tiposDocumento: TipoDocumento[] = [];
  historicoAberto: Record<number, boolean> = {};
  historicoPorDocumento: Record<number, Atividade[]> = {};
  statusSelecionado: Record<number, string> = {};
  message = '';

  private readonly fb = inject(FormBuilder);

  readonly form = this.fb.nonNullable.group({
    protocolo: [''],
    remetente: [''],
    tipo: [''],
    status: [''],
    dataInicio: [''],
    dataFim: ['']
  });

  constructor(
    private readonly api: ApiService,
    private readonly session: SessionService
  ) {}

  async ngOnInit(): Promise<void> {
    await Promise.all([this.loadStatusOpcoes(), this.loadTiposDocumento()]);
    await this.buscar();
  }

  async buscar(): Promise<void> {
    try {
      const value = this.form.getRawValue();
      const params = new URLSearchParams();

      Object.entries(value).forEach(([key, currentValue]) => {
        if (currentValue) {
          params.set(key, currentValue);
        }
      });

      const path = params.toString() ? `/documentos?${params.toString()}` : '/documentos';
      this.documentos = await this.api.get<Documento[]>(path, this.session.token || undefined);
      this.statusSelecionado = this.documentos.reduce<Record<number, string>>((acc, documento) => {
        acc[documento.id] = documento.status || 'Recebido';
        return acc;
      }, {});
      this.historicoAberto = {};
      this.historicoPorDocumento = {};
    } catch (error) {
      this.message = error instanceof Error ? error.message : 'Falha ao carregar documentos';
    }
  }

  async atualizarStatus(documento: Documento): Promise<void> {
    const status = this.statusSelecionado[documento.id] || documento.status || 'Recebido';

    try {
      const atualizado = await this.api.patch<Documento>(
        `/documentos/${documento.id}/status`,
        { status },
        this.session.token || undefined
      );

      this.documentos = this.documentos.map((current) =>
        current.id === atualizado.id ? atualizado : current
      );

      if (this.historicoAberto[documento.id]) {
        await this.carregarHistorico(documento.id);
      }

      this.statusSelecionado[documento.id] = atualizado.status || status;
      window.dispatchEvent(new CustomEvent('doctype:changed'));

      this.message = 'Status atualizado com sucesso.';
    } catch (error) {
      this.message = error instanceof Error ? error.message : 'Falha ao atualizar status';
    }
  }

  async toggleHistorico(documentoId: number, forceLoad = false): Promise<void> {
    if (!forceLoad && this.historicoAberto[documentoId]) {
      delete this.historicoAberto[documentoId];
      return;
    }

    await this.carregarHistorico(documentoId);
    this.historicoAberto[documentoId] = true;
  }

  private async carregarHistorico(documentoId: number): Promise<void> {
    try {
      this.historicoPorDocumento[documentoId] = await this.api.get<Atividade[]>(
        `/documentos/${documentoId}/historico`,
        this.session.token || undefined
      );
    } catch (error) {
      this.message = error instanceof Error ? error.message : 'Falha ao carregar histórico';
    }
  }

  private async loadStatusOpcoes(): Promise<void> {
    try {
      this.statusOpcoes = await this.api.get<string[]>('/documentos/status-opcoes', this.session.token || undefined);
    } catch {
      this.statusOpcoes = ['Recebido', 'Em análise', 'Encaminhado', 'Finalizado'];
    }
  }

  private async loadTiposDocumento(): Promise<void> {
    try {
      this.tiposDocumento = await this.api.get<TipoDocumento[]>('/tipos-documento', this.session.token || undefined);
    } catch {
      this.tiposDocumento = [];
    }
  }
}
