# CCBlog - Portal do Curso de Ciência da Computação

O **CCBlog** é uma plataforma web completa para centralizar informações, notícias e gestão acadêmica do curso de Ciência da Computação, oferecendo uma interface administrativa robusta para gestores e um portal público otimizado para estudantes e visitantes.

## 🎯 O Problema que Resolvemos

Instituições acadêmicas enfrentam desafios em gerenciar e distribuir informações sobre cursos de forma centralizada:

- 📚 **Informações Fragmentadas**: Notícias, oportunidades e recursos educacionais espalhados em múltiplas plataformas
- 👥 **Falta de Personalização**: Experiências genéricas para diferentes tipos de usuários (alunos, professores, administradores)
- 🔒 **Segurança e Controle**: Ausência de controle granular de acesso por perfil de usuário
- 📱 **Experiência Deficiente**: Interfaces não responsivas e pouco intuitivas

O **CCBlog** resolve esses problemas oferecendo uma solução integrada, segura e escalável.

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

## 🏗️ Decisões Técnicas

### 1. **React + TypeScript para Type Safety**

Escolhemos TypeScript para evitar erros em tempo de execução e garantir melhor mantenibilidade. Todo o projeto é tipado, reduzindo bugs e facilitando refatorações.

### 2. **Vite em vez de Create React App**

O Vite oferece:

- ⚡ Inicialização muito mais rápida (cold start < 300ms)
- 📦 HMR (Hot Module Replacement) instantâneo
- 🎯 Melhor performance em modo build

### 3. **Arquitetura em Camadas**

```
Services (API) → Utils (Validação/Formatação) → Components (UI) → Pages (Containers)
```

Separação clara de responsabilidades facilita testes unitários e manutenção.

### 4. **Roteamento com Proteção por Perfil**

Implementamos `ProtectedRoute` com base em roles (ADMIN, TEACHER, STUDENT), garantindo segurança no frontend e oferecendo UX consistente.

### 5. **Centralização da Comunicação com API**

- `configAxios.ts`: Configuração única com autenticação JWT
- `axiosRequest.ts`: Handlers padronizados para todas as requisições
- Response tipado com `ApiResponse<T>`: Previsibilidade em toda a aplicação

### 6. **Validação com Zod + React Hook Form**

Combinação oferece:

- Validação de schema end-to-end
- Erros em tempo real nos formulários
- Redução de código boilerplate

### 7. **Tailwind CSS para Design System Escalável**

Componentes reutilizáveis com utilidades, garantindo consistência visual em toda a aplicação sem aumentar o bundle size.

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
│                   # Organizados por funcionalidade (AlertConfirm, Navbar, etc.)
├── contexts/        # Contextos globais (Autenticação, Tema)
├── hooks/           # Hooks customizados (useDebounce, useToastLoading, use-mobile)
├── layouts/         # Layouts de página (AdminLayout, SiteLayout) e seções
├── pages/           # Páginas da aplicação (Auth, Dashboard, Disciplinas, News)
├── router/          # Configurações de rotas e proteção por perfil (ProtectedRoute)
├── services/        # Integração com a API (Axios handlers para cada entidade)
├── types/           # Definições de tipos TypeScript (.d.ts)
├── utils/           # Funções utilitárias (axiosRequest, formatar, roles)
└── stores/          # Estado global com Zustand (useUserStore)
```

### Padrões Arquiteturais

**1. Component-Based Architecture**

- Componentes pequenos e focados
- Props tipadas com TypeScript
- Reutilização máxima

**2. Service Layer Pattern**
Cada entidade (Posts, Usuários, Disciplinas) possui um arquivo de serviço dedicado que encapsula a lógica de requisições.

**3. Hook-Based State Management**

- Contextos para estado global (autenticação, tema)
- Hooks customizados para lógica reutilizável
- Zustand para estado centralizado do usuário

**4. Protected Routes**
O arquivo `router/ProtectedRoute.tsx` valida se o usuário tem permissão para acessar cada rota com base em seu perfil.

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

## 🌐 Deployment

O projeto está configurado para deploy automatizado:

- **Plataforma**: [Vercel](https://vercel.com/)
- **Arquivo de Config**: `vercel.json`
- **Build Command**: `pnpm build`
- **Output Directory**: `dist/`

### Variáveis de Ambiente em Produção

Certifique-se de configurar em seu provider de deploy:

```env
VITE_URL_API=https://ccblog-be.onrender.com
```

## 📊 Performance & Otimizações

- 🎯 **Code Splitting**: Vite divide automaticamente o bundle
- 🚀 **Lazy Loading**: Rotas carregadas sob demanda com React.lazy()
- 🖼️ **Otimização de Imagens**: Integração com CDN via URLs externas
- 💨 **Tree Shaking**: Vite remove código não utilizado
- ⚙️ **Debouncing**: Hooks customizados para requisições menos frequentes

## 🔐 Segurança

- 🛡️ **Autenticação JWT**: Token armazenado em localStorage e enviado automaticamente
- 🔒 **Protected Routes**: Validação de perfil em tempo real
- ✅ **Validação de Formulários**: Zod valida dados antes do envio
- 🚫 **CORS**: Backend configurado para aceitar requisições apenas da origem autorizada

## 🤝 Contribuindo

1. Crie uma branch para sua feature: `git checkout -b feature/minha-feature`
2. Faça commit das mudanças: `git commit -m 'Adiciona minha feature'`
3. Push para a branch: `git push origin feature/minha-feature`
4. Abra um Pull Request

## 🔗 Links Úteis

- **Backend Repository**: [ccblog-be](https://github.com/debs-veras/ccblog-be)
- **Production URL**: [https://ccblog.vercel.app](https://ccblog.vercel.app)
- **API Server**: [https://ccblog-be.onrender.com](https://ccblog-be.onrender.com)

---

