export interface AuthResponse {
  id: number;
  email: string;
  nome: string;
  perfilAcesso?: string;
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

export interface TipoDocumento {
  id: number;
  nome: string;
  descricao?: string;
  ativo?: boolean;
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

export interface DocumentoFiltros {
  termo?: string;
  status?: string;
  tipo?: string;
  protocolo?: string;
  nome?: string;
  remetente?: string;
  dataInicio?: string;
  dataFim?: string;
}