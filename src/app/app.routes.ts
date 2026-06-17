import { Routes } from '@angular/router';

import { authGuard } from './core/auth.guard';
import { ShellComponent } from './layout/shell.component';
import { CadastrarDocumentoComponent } from './pages/cadastrar-documento/cadastrar-documento.component';
import { ConsultaDocumentoComponent } from './pages/consulta-documento/consulta-documento.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoginComponent } from './pages/auth/login.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { RegisterComponent } from './pages/auth/register.component';
import { RelatoriosComponent } from './pages/relatorios/relatorios.component';
import { UsuarioComponent } from './pages/usuario/usuario.component';
import { TipoDocumentoComponent } from './pages/tipo-documento/tipo-documento.component';

export const routes: Routes = [
	{ path: '', pathMatch: 'full', component: LoginComponent },
	{ path: 'register', component: RegisterComponent },
	{
		path: '',
		component: ShellComponent,
		canActivateChild: [authGuard],
		children: [
			{ path: 'dashboard', component: DashboardComponent },
			{ path: 'perfil', component: PerfilComponent },
			{ path: 'usuario', component: UsuarioComponent },
			{ path: 'tipo-documento', component: TipoDocumentoComponent },
			{ path: 'cadastrar-documento', component: CadastrarDocumentoComponent },
			{ path: 'consulta-documento', component: ConsultaDocumentoComponent },
			{ path: 'relatorios', component: RelatoriosComponent },
			{ path: '', pathMatch: 'full', redirectTo: 'dashboard' }
		]
	},
	{ path: '**', redirectTo: '' }
];
