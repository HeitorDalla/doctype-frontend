export interface AuthResponse {
  id: number;
  email: string;
  nome: string;
  token: string;
  tokenType: string;
  expiresIn: number;
}

export interface Usuario {
  id: number;
  nome: string;
  nomeUsuario?: string;
  telefone?: string;
  cpf?: string;
  endereco?: string;
  cep?: string;
  email: string;
  perfilAcesso?: string;
  ativo?: boolean;
  dataCriacao?: string;
}

export interface Documento {
  id: number;
  protocolo: string;
  nome: string;
  descricao?: string;
  tipoArquivo?: string;
  status?: string;
  arquivoNome?: string;
  arquivoContentType?: string;
  criadoEm?: string;
  usuarioId?: number;
  usuarioNome?: string;
  usuarioEmail?: string;
}

export interface Atividade {
  id: number;
  descricao: string;
  criadoEm?: string;
  usuarioId?: number;
  usuarioNome?: string;
  documentoId?: number;
  documentoNome?: string;
}

export interface DashboardResumo {
  totalUsuarios: number;
  totalDocumentos: number;
  documentosEmAnalise: number;
  documentosEncaminhados: number;
  documentosAprovados: number;
  documentosRejeitados: number;
  documentosFinalizados: number;
}

export interface DocumentoForm {
  nome: string;
  descricao?: string;
  tipoArquivo?: string;
  status?: string;
  arquivoNome?: string;
  arquivoContentType?: string;
  usuarioId?: number | null;
}

export interface UsuarioForm {
  nome: string;
  nomeUsuario?: string;
  telefone?: string;
  cpf?: string;
  endereco?: string;
  cep?: string;
  email: string;
  senha: string;
  perfilAcesso?: string;
}