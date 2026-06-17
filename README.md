# Doctype Frontend

Frontend desenvolvido com Angular 21 para um sistema de gestão de documentos. A aplicação tem autenticação, área protegida e telas para cadastro, consulta e administração de usuários, tipos de documento e relatórios.

## Visão geral

O app usa rotas separadas para login e cadastro inicial, e depois direciona o usuário para um layout principal com menu lateral. O acesso às telas internas é protegido por autenticação via guard.

Os dados de sessão ficam salvos no `localStorage` com token e informações básicas do usuário.

## Principais telas

- Login
- Cadastro de usuário
- Dashboard
- Perfil
- Usuários
- Tipos de documento
- Cadastro de documento
- Consulta de documento
- Relatórios

## Fluxo de acesso

1. O usuário entra pela tela de login.
2. Após autenticação, o token é salvo localmente.
3. As rotas internas passam pelo guard de autenticação.
4. O layout principal exibe navegação e conteúdo da área logada.

## Integração com a API

O frontend consome uma API HTTP usando `fetch`. Em desenvolvimento, a base usada é `http://localhost:8081/api`; quando o app está servido na porta `8081`, a aplicação usa `/api`.

## Estrutura do projeto

- `src/app/core`: serviços centrais, modelos e autenticação
- `src/app/layout`: layout principal da aplicação
- `src/app/pages`: páginas da aplicação
- `src/app/app.routes.ts`: definição das rotas

## Como executar

Instale as dependências e inicie o projeto:

```bash
npm install
npm start
```

Depois, abra `http://localhost:4200/`.

## Build e testes

```bash
npm run build
npm test
```

## Tecnologias

- Angular 21
- TypeScript
- RxJS
- Vitest