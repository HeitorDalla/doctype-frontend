import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { ApiService } from '../../core/api.service';
import { Documento } from '../../core/models';
import { SessionService } from '../../core/session.service';

@Component({
  selector: 'app-consulta-documento',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './consulta-documento.component.html',
  styleUrl: './consulta-documento.component.css'
})
export class ConsultaDocumentoComponent implements OnInit {
  documentos: Documento[] = [];
  filteredDocumentos: Documento[] = [];
  termo = '';
  message = '';

  constructor(
    private readonly api: ApiService,
    private readonly session: SessionService
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      this.documentos = await this.api.get<Documento[]>('/documentos', this.session.token || undefined);
      this.filteredDocumentos = [...this.documentos];
    } catch (error) {
      this.message = error instanceof Error ? error.message : 'Falha ao carregar documentos';
    }
  }

  onSearch(value: string): void {
    this.termo = value;
    const normalized = value.trim().toLowerCase();

    this.filteredDocumentos = this.documentos.filter((documento) =>
      [documento.protocolo, documento.nome, documento.status, documento.tipoArquivo]
        .filter(Boolean)
        .some((campo) => campo!.toLowerCase().includes(normalized))
    );
  }
}
