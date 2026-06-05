import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';

import { ApiService } from '../../core/api.service';
import { Documento } from '../../core/models';
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
  message = '';

  private readonly fb = inject(FormBuilder);

  readonly form = this.fb.nonNullable.group({
    protocolo: [''],
    tipo: [''],
    status: [''],
    nome: [''],
    data: ['']
  });

  constructor(
    private readonly api: ApiService,
    private readonly session: SessionService
  ) {}

  async ngOnInit(): Promise<void> {
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
}
