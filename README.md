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
