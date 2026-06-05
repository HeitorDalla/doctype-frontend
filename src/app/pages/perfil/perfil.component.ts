import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { ApiService } from '../../core/api.service';
import { Atividade, Documento, Usuario } from '../../core/models';
import { SessionService } from '../../core/session.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent implements OnInit {
  usuario: Usuario | null = null;
  documentos: Documento[] = [];
  atividades: Atividade[] = [];
  message = '';

  constructor(
    private readonly api: ApiService,
    public readonly session: SessionService
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      const [usuario, documentos, atividades] = await Promise.all([
        this.api.get<Usuario>('/usuarios/me', this.session.token || undefined),
        this.api.get<Documento[]>('/documentos/meus-documentos', this.session.token || undefined),
        this.api.get<Atividade[]>('/atividades/recentes', this.session.token || undefined)
      ]);

      this.usuario = usuario;
      this.documentos = documentos;
      this.atividades = atividades;
    } catch (error) {
      this.message = error instanceof Error ? error.message : 'Falha ao carregar perfil';
    }
  }
}
