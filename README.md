# TCC Chat Conversacional com IA (Claude)

## 📌 Descrição

Este projeto consiste no desenvolvimento de uma aplicação web de chat conversacional inspirada em interfaces modernas como o ChatGPT, utilizando **React + TypeScript** no frontend e integração com modelos de linguagem (LLMs), especificamente o **Claude (Anthropic)**.

O objetivo principal é explorar, implementar e avaliar uma **interface conversacional eficiente**, com foco em:

- Experiência do usuário (UX)
- Arquitetura modular de frontend
- Comunicação assíncrona com APIs de IA
- Streaming de respostas em tempo real

Este projeto faz parte do Trabalho de Conclusão de Curso (TCC) da Universidade Federal de Lavras (UFLA).

---

## 🎯 Objetivos

### Objetivo Geral
Desenvolver uma aplicação web que permita interação conversacional com modelos de linguagem, avaliando aspectos de usabilidade, desempenho e arquitetura.

### Objetivos Específicos

- Implementar interface de chat moderna e responsiva
- Integrar com API de LLM (Claude)
- Trabalhar com respostas em streaming
- Aplicar boas práticas de desenvolvimento frontend
- Estruturar o sistema de forma modular e escalável
- Documentar o processo conforme normas acadêmicas da UFLA

---

## 🧱 Arquitetura do Projeto

O projeto está organizado em um modelo de monorepo simples:

```
tcc-chat-claude/
├── frontend/   # Aplicação React (interface do usuário)
├── backend/    # API intermediária (proxy para Claude)
├── docs/       # Documentação do TCC
└── README.md
```

### 🔹 Frontend
- React
- TypeScript
- Vite
- React Query (estado assíncrono)
- CSS Modules (ou Tailwind)

Responsável por:
- Interface do chat
- Gerenciamento de estado
- Renderização de mensagens
- Consumo da API backend

### 🔹 Backend
- Node.js
- Fastify
- TypeScript

Responsável por:
- Comunicação com API Claude
- Segurança (proteção de chave de API)
- Controle de requisições
- Streaming de respostas

---

## ⚙️ Tecnologias Utilizadas

### Frontend
- React
- TypeScript
- Vite
- React Router
- React Query
- React Markdown

### Backend
- Node.js
- Fastify
- TypeScript
- dotenv
- Zod

### Ferramentas
- ESLint
- Prettier
- Vitest (testes)
- Git / GitHub

---

## 🚀 Como rodar o projeto

### Pré-requisitos

- Node.js (>= 18)
- npm ou yarn

---

### 1. Clonar o repositório

```bash
git clone <url-do-repositorio>
cd tcc-chat-claude
```

---

### 2. Rodar o backend

```bash
cd backend
npm install
npm run dev
```

Servidor disponível em:
```
http://localhost:3001
```

---

### 3. Rodar o frontend

Em outro terminal:

```bash
cd frontend
npm install
npm run dev
```

Aplicação disponível em:
```
http://localhost:5173
```

---

## 🔐 Variáveis de ambiente

### Backend (`backend/.env`)

```env
PORT=3001
CLAUDE_API_KEY=your_api_key_here
```

### Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:3001
```

---

## 📂 Organização do Código

### Frontend

```
src/
├── app/          # Aplicação
├── assets/       # Arquivos estáticos
├── components/   # Componentes reutilizáveis
├── features/     # Lógica de negócio (chat, streaming)
├── hooks/        # Hooks customizados
├── pages/        # Páginas da aplicação
├── services/     # Comunicação com API
├── styles/       # Estilos globais
├── types/        # Tipagens
└── utils/        # Funções auxiliares
```

### Backend

```
src/
├── config/       # Configurações
├── controllers/  # Controladores
├── routes/       # Rotas da API
├── services/     # Integração com Claude
└── utils/        # Funções auxiliares
```

---

## 🧠 Funcionalidades previstas

- [ ] Interface de chat interativa
- [ ] Envio de mensagens para LLM
- [ ] Respostas em streaming
- [ ] Histórico de conversas
- [ ] Indicadores de carregamento
- [ ] Tratamento de erros
- [ ] Renderização de Markdown
- [ ] Código com destaque (syntax highlight)

---

## 📊 Metodologia (TCC)

O projeto será desenvolvido seguindo etapas iterativas:

1. Definição da arquitetura
2. Implementação da interface
3. Integração com API de IA
4. Testes e validação
5. Análise de resultados
6. Documentação acadêmica

---

## 👨‍💻 Autor

João Paulo Souza Daré da Silva  
Sistemas de Informação – UFLA

---

## 📄 Licença

Este projeto é acadêmico e desenvolvido para fins educacionais.
