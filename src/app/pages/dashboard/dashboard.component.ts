import { CommonModule } from '@angular/common';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';

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
export class DashboardComponent implements OnInit, OnDestroy {
  resumo: DashboardResumo | null = null;
  atividades: Atividade[] = [];
  message = '';
  loading = false;

  private refreshTimer?: number;
  private readonly refreshIntervalMs = 3000;

  constructor(
    private readonly api: ApiService,
    public readonly session: SessionService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.carregarPainel();
    this.refreshTimer = window.setInterval(() => {
      void this.carregarPainel(true);
    }, this.refreshIntervalMs);
  }

  ngOnDestroy(): void {
    if (this.refreshTimer) {
      window.clearInterval(this.refreshTimer);
    }
  }

  @HostListener('window:focus')
  onWindowFocus(): void {
    void this.carregarPainel(true);
  }

  @HostListener('window:doctype:changed')
  onDataChanged(): void {
    void this.carregarPainel(true);
    window.setTimeout(() => {
      void this.carregarPainel(true);
    }, 600);
  }

  async carregarPainel(silent = false): Promise<void> {
    if (!silent) {
      this.loading = true;
      this.message = '';
    }

    try {
      const cacheBust = Date.now();
      const [resumo, atividades] = await Promise.all([
        this.api.get<DashboardResumo>(`/dashboard/resumo?_t=${cacheBust}`, this.session.token || undefined),
        this.api.get<Atividade[]>(`/atividades/recentes?_t=${cacheBust}`, this.session.token || undefined)
      ]);

      this.resumo = resumo;
      this.atividades = atividades;
    } catch (error) {
      this.message = error instanceof Error ? error.message : 'Falha ao carregar dashboard';
    } finally {
      this.loading = false;
    }
  }
}
