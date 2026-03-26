# CCBlog - Portal do Curso de Ciência da Computação

O **CCBlog** é uma plataforma web desenvolvida para centralizar informações, notícias e gestão acadêmica do curso de Ciência da Computação. O sistema oferece uma interface administrativa para gestão de conteúdos e um portal público para estudantes e visitantes.

## 🚀 Tecnologias

Este projeto foi construído utilizando as seguintes tecnologias:

- **Frontend**: [React 18](https://reactjs.org/) com [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Estilização**: [Tailwind CSS](https://tailwindcss.com/) & [React Icons](https://react-icons.github.io/react-icons/)
- **Gestão de Formulários**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
- **Roteamento**: [React Router Dom 7](https://reactrouter.com/)
- **Comunicação API**: [Axios](https://axios-http.com/)
- **Editor de Texto**: [React Quill](https://github.com/zenoamaro/react-quill)
- **Animações**: [Framer Motion](https://www.framer.com/motion/) & [AutoAnimate](https://auto-animate.formkit.com/)

## ✨ Funcionalidades

### 🏠 Portal Público (Site)
- **Home Dinâmica**: Seções de notícias recentes e blocos de oportunidades.
- **Notícias & Blog**: Listagem e visualização detalhada de postagens.
- **Oportunidades**: Exibição dinâmica de Grupos de Estudo, Pesquisa, Extensão e Vagas de Trabalho.
- **Matriz Curricular**: Visualização das disciplinas por períodos.
- **Sobre o Departamento**: Informações institucionais.

### 🛡️ Área Administrativa (Sistema)
- **Dashboard Personalizado**: Visão geral para Administradores, Professores e Alunos.
- **Gestão de Disciplinas**: Cadastro completo com códigos, períodos, carga horária e materiais.
- **Gestão de Posts**: Editor rico (Quill) para criação de notícias com suporte a categorias e slugs amigáveis.
- **Gestão de Usuários**: Controle de acesso por perfis (ADMIN, TEACHER, STUDENT).
- **Matrícula**: Sistema de inscrição em disciplinas disponível para alunos.
- **Atividades Complementares**: Registro e acompanhamento de horas extras.

## 📁 Estrutura do Projeto

```text
src/
├── components/      # Componentes UI reutilizáveis (Input, Button, Box, Table)
├── contexts/        # Contextos globais (Autenticação, Tema)
├── hooks/           # Hooks customizados (Storage, Toast, Debounce)
├── layouts/         # Layouts de página (AdminLayout, SiteLayout) e seções
├── pages/           # Páginas da aplicação (Auth, Dashboard, Disciplinas, News)
├── router/          # Configurações de rotas e proteção por perfil
├── services/        # Integração com a API (Axios handlers)
├── types/           # Definições de tipos TypeScript (.d.ts)
└── utils/           # Funções utilitárias (Formatação, Helpers)
```

## 🛠️ Instalação e Execução

1. **Clonar o repositório**:
   ```bash
   git clone <url-do-repositorio>
   cd ccblog
   ```

2. **Instalar dependências**:
   ```bash
   pnpm install
   # ou npm install
   ```

3. **Configurar variáveis de ambiente**:
   Crie um arquivo `.env` na raiz com as URLs da API:
   ```env
   VITE_API_URL=http://localhost:3000
   ```

4. **Rodar em modo desenvolvimento**:
   ```bash
   pnpm dev
   ```

## 📡 Consumindo a API

A comunicação com o backend é centralizada utilizando o **Axios**.

### Configuração
A URL base da API é configurada via variável de ambiente no arquivo `.env`:
```env
VITE_URL_API=https://ccblog-be.onrender.com
```

- **Repositório do Backend**: [ccblog-be](https://github.com/debs-veras/ccblog-be)
- **Servidor de Produção**: [https://ccblog-be.onrender.com](https://ccblog-be.onrender.com)

O arquivo `src/configAxios.ts` gerencia a instância do Axios, incluindo:
- **Base URL**: Obtida da variável de ambiente.
- **Autenticação**: O token JWT é recuperado do `localStorage` e enviado no header `Authorization: Bearer <token>`.
- **Headers**: Padrão `application/json`.

### Requisições Padronizadas
As requisições são abstraídas em `src/utils/axiosRequest.ts` para garantir um retorno padronizado através do tipo `ApiResponse<T>`:

```typescript
export type ApiResponse<T = unknown> = {
  success: boolean;
  message: string;
  data?: T;
  type?: "success" | "error" | "info" | "warning"; // Tipos para Toast
  error?: unknown;
};
```

Exemplos de métodos disponíveis:
- `getRequest<T>(url)`
- `postRequest<T>(url, body)`
- `putRequest<T>(url, body)`
- `patchRequest<T>(url, body)`
- `deleteRequest<T>(url, body?)`

### Camada de Serviços
Cada módulo (Posts, Categorias, Disciplinas) possui seu próprio arquivo em `src/services/` que utiliza esses handlers para realizar chamadas específicas.
