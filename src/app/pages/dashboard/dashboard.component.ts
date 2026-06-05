import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { ApiService } from '../../core/api.service';
import { DashboardResumo, Atividade } from '../../core/models';
import { SessionService } from '../../core/session.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  resumo: DashboardResumo | null = null;
  atividades: Atividade[] = [];
  message = '';

  constructor(
    private readonly api: ApiService,
    public readonly session: SessionService
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      const [resumo, atividades] = await Promise.all([
        this.api.get<DashboardResumo>('/dashboard/resumo', this.session.token || undefined),
        this.api.get<Atividade[]>('/atividades/recentes', this.session.token || undefined)
      ]);

      this.resumo = resumo;
      this.atividades = atividades;
    } catch (error) {
      this.message = error instanceof Error ? error.message : 'Falha ao carregar dashboard';
    }
  }
}
