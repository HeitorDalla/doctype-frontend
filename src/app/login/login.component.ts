import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  senha: string = '';
  carregando: boolean = false;

  entrar(): void {
    if (!this.email || !this.senha) return;
    this.carregando = true;
    setTimeout(() => {
      this.carregando = false;
      alert(`Login feito com: ${this.email}`);
    }, 1500);
  }
}