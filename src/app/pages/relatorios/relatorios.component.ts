import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';

import { ApiService } from '../../core/api.service';
import { Documento, TipoDocumento } from '../../core/models';
import { SessionService } from '../../core/session.service';

@Component({
  selector: 'app-relatorios',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './relatorios.component.html',
  styleUrl: './relatorios.component.css'
})
export class RelatoriosComponent implements OnInit {
  documentos: Documento[] = [];
  tiposDocumento: TipoDocumento[] = [];
  statusOpcoes: string[] = ['Recebido', 'Em análise', 'Encaminhado', 'Finalizado'];
  message = '';

  private readonly fb = inject(FormBuilder);

  readonly form = this.fb.nonNullable.group({
    protocolo: [''],
    tipo: [''],
    status: [''],
    nome: [''],
    remetente: [''],
    dataInicio: [''],
    dataFim: [''],
    data: ['']
  });

  constructor(
    private readonly api: ApiService,
    private readonly session: SessionService
  ) {}

  async ngOnInit(): Promise<void> {
    await Promise.all([this.loadTiposDocumento(), this.loadStatusOpcoes()]);
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

      const path = params.toString()
        ? `/relatorios/documentos?${params.toString()}`
        : '/relatorios/documentos';

      this.documentos = await this.api.get<Documento[]>(path, this.session.token || undefined);
    } catch (error) {
      this.message = error instanceof Error ? error.message : 'Falha ao carregar relatorios';
    }
  }

  private async loadTiposDocumento(): Promise<void> {
    try {
      this.tiposDocumento = await this.api.get<TipoDocumento[]>('/tipos-documento', this.session.token || undefined);
    } catch {
      this.tiposDocumento = [];
    }
  }

  private async loadStatusOpcoes(): Promise<void> {
    try {
      this.statusOpcoes = await this.api.get<string[]>('/documentos/status-opcoes', this.session.token || undefined);
    } catch {
      this.statusOpcoes = ['Recebido', 'Em análise', 'Encaminhado', 'Finalizado'];
    }
  }
}
