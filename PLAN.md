# PLAN.md — Fincore Frontend

## Visão Geral

Frontend Angular para a API Fincore — gestão de finanças pessoais com sugestões via IA.

Repositório separado do backend (`fincore`).

---

## Stack

- Angular 22.x
- TypeScript 5.8+
- Tailwind CSS 4.x
- ng2-charts 10.x + Chart.js 4.x
- RxJS 7.4+
- Angular Router 22.x

---

## Estrutura de Pastas

```
fincore-frontend/
├── src/
│   ├── app/
│   │   ├── core/
│   │   │   ├── auth/
│   │   │   │   ├── auth.service.ts
│   │   │   │   ├── auth.guard.ts
│   │   │   │   └── auth.interceptor.ts
│   │   │   ├── api/
│   │   │   │   └── api.service.ts
│   │   │   └── models/
│   │   │       └── user.model.ts
│   │   ├── shared/
│   │   │   ├── components/
│   │   │   │   ├── sidebar/
│   │   │   │   ├── header/
│   │   │   │   └── data-table/
│   │   │   └── pipes/
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   │   ├── login/
│   │   │   │   ├── register/
│   │   │   │   └── auth.routes.ts
│   │   │   ├── dashboard/
│   │   │   │   ├── components/
│   │   │   │   │   ├── summary-cards/
│   │   │   │   │   ├── expenses-by-category-chart/
│   │   │   │   │   └── monthly-evolution-chart/
│   │   │   │   ├── services/
│   │   │   │   └── dashboard.routes.ts
│   │   │   ├── transactions/
│   │   │   │   ├── components/
│   │   │   │   │   ├── transaction-list/
│   │   │   │   │   └── transaction-form/
│   │   │   │   ├── services/
│   │   │   │   └── transaction.routes.ts
│   │   │   ├── categories/
│   │   │   │   ├── components/
│   │   │   │   │   ├── category-list/
│   │   │   │   │   └── category-form/
│   │   │   │   ├── services/
│   │   │   │   └── category.routes.ts
│   │   │   ├── accounts/
│   │   │   │   ├── components/
│   │   │   │   │   ├── account-list/
│   │   │   │   │   └── account-form/
│   │   │   │   ├── services/
│   │   │   │   └── account.routes.ts
│   │   │   ├── budgets/
│   │   │   │   ├── components/
│   │   │   │   │   ├── budget-list/
│   │   │   │   │   ├── budget-form/
│   │   │   │   │   └── budget-summary/
│   │   │   │   ├── services/
│   │   │   │   └── budget.routes.ts
│   │   │   └── goals/
│   │   │       ├── components/
│   │   │       │   ├── goal-list/
│   │   │       │   ├── goal-form/
│   │   │       │   └── goal-progress/
│   │   │       ├── services/
│   │   │       └── goal.routes.ts
│   │   ├── app.component.ts
│   │   ├── app.config.ts
│   │   └── app.routes.ts
│   ├── environments/
│   │   ├── environment.ts
│   │   └── environment.prod.ts
│   └── styles.css
├── angular.json
├── package.json
├── tsconfig.json
└── .gitignore
```

---

## Fase 1 — Projeto Base e Configuração

### Tarefas

- [ ] Criar projeto Angular com `ng new fincore-frontend`
- [ ] Configurar Tailwind CSS v4
- [ ] Configurar path aliases (`@core/*`, `@shared/*`, `@features/*`)
- [ ] Configurar environments (dev/prod)
- [ ] Configurar proxy para API em desenvolvimento

### Configuração do Proxy

```json
{
  "/api": {
    "target": "http://localhost:8080",
    "secure": false
  }
}
```

---

## Fase 2 — Core (Auth, Interceptor, Guards)

### Serviços

#### AuthService

| Método | Retorno | Descrição |
|--------|---------|-----------|
| `login(email, password)` | `Observable<TokenResponse>` | Login e armazena JWT |
| `register(name, email, password)` | `Observable<void>` | Cadastro |
| `logout()` | `void` | Limpa token e redireciona |
| `getMe()` | `Observable<User>` | Busca perfil do logado |
| `isLoggedIn()` | `boolean` | Verifica se está autenticado |
| `getToken()` | `string \| null` | Retorna token JWT |

#### Auth Interceptor

- Adiciona header `Authorization: Bearer <token>` em todas as requisições
- Ignora rotas `/auth/login` e `/auth/register`

#### Auth Guard

- Verifica se usuário está autenticado
- Redireciona para `/login` se não estiver

### Models

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
}

interface TokenResponse {
  accessToken: string;
}
```

---

## Fase 3 — Layout (Sidebar + Header)

### Componentes

#### SidebarComponent

- Logo/nome da aplicação
- Links de navegação:
  - Dashboard
  - Transações
  - Categorias
  - Contas
  - Orçamentos
  - Metas
- Botão de logout
- Colapsável em telas pequenas

#### HeaderComponent

- Título da página atual
- Botão do perfil do usuário
- Toggle da sidebar (mobile)

### Layout Principal

```
┌─────────────────────────────────────────┐
│ Sidebar │        Header                  │
│         │────────────────────────────────│
│  Menu   │                                │
│         │        Conteúdo                │
│         │                                │
│         │                                │
└─────────────────────────────────────────┘
```

---

## Fase 4 — Auth (Login/Cadastro)

### Páginas

#### LoginPage

- Formulário com email e senha
- Link "Criar conta" para `/register`
- Mensagem de erro
- Redirecionamento para `/dashboard` após login

#### RegisterPage

- Formulário com nome, email e senha
- Link "Já tenho conta" para `/login`
- Mensagem de sucesso/erro
- Redirecionamento para `/login` após cadastro

---

## Fase 5 — Dashboard

### Endpoints Utilizados

- `GET /api/v1/dashboard/summary?month=&year=`
- `GET /api/v1/dashboard/expenses-by-category?month=&year=`
- `GET /api/v1/dashboard/monthly-evolution?months=12`

### Componentes

#### SummaryCardsComponent

- Card: Total de Receitas (verde)
- Card: Total de Despesas (vermelho)
- Card: Saldo (azul)
- Seletor de mês/ano

#### ExpensesByCategoryChartComponent

- Gráfico de pizza/doughnut
- Gastos agrupados por categoria
- Legenda com cores

#### MonthlyEvolutionChartComponent

- Gráfico de linha
- Evolução de receitas vs despesas
- Últimos 12 meses

---

## Fase 6 — Transações

### Endpoints Utilizados

- `GET /api/v1/transactions`
- `POST /api/v1/transactions`
- `PUT /api/v1/transactions/{id}`
- `DELETE /api/v1/transactions/{id}`
- `GET /api/v1/transactions/installments/{parentId}`

### Componentes

#### TransactionListComponent

- Tabela com lista de transações
- Filtros: data, categoria, conta, tipo
- Botão "Nova Transação"
- Ações: editar, excluir
- Indicador de parcelamento

#### TransactionFormComponent

- Formulário de criação/edição
- Campos: descrição, valor, data, tipo, categoria, conta, notas
- Checkbox "Parcelado"
- Campos de parcelamento (número de parcelas)
- Validação de campos obrigatórios

---

## Fase 7 — Categorias

### Endpoints Utilizados

- `GET /api/v1/categories`
- `POST /api/v1/categories`
- `PUT /api/v1/categories/{id}`
- `DELETE /api/v1/categories/{id}`

### Componentes

#### CategoryListComponent

- Lista de categorias (globais + do usuário)
- Botão "Nova Categoria"
- Ações: editar, excluir

#### CategoryFormComponent

- Formulário de criação/edição
- Campos: nome, tipo (receita/despesa), ícone, cor

---

## Fase 8 — Contas Bancárias

### Endpoints Utilizados

- `GET /api/v1/accounts`
- `POST /api/v1/accounts`
- `PUT /api/v1/accounts/{id}`
- `DELETE /api/v1/accounts/{id}`

### Componentes

#### AccountListComponent

- Lista de contas
- Saldo atual de cada conta
- Botão "Nova Conta"
- Ações: editar, excluir

#### AccountFormComponent

- Formulário de criação/edição
- Campos: nome, tipo (corrente/poupança/crédito), saldo inicial

---

## Fase 9 — Orçamentos

### Endpoints Utilizados

- `GET /api/v1/budgets`
- `POST /api/v1/budgets`
- `PUT /api/v1/budgets/{id}`
- `DELETE /api/v1/budgets/{id}`
- `GET /api/v1/budgets/summary?month=&year=`

### Componentes

#### BudgetListComponent

- Lista de orçamentos
- Resumo gasto vs orçado (barra de progresso)
- Botão "Novo Orçamento"
- Ações: editar, excluir

#### BudgetFormComponent

- Formulário de criação/edição
- Campos: nome, valor limite, categoria, mês, ano

#### BudgetSummaryComponent

- Barra de progresso (gasto/orçado)
- Percentual utilizado
- Cor: verde (< 70%), amarelo (70-90%), vermelho (> 90%)

---

## Fase 10 — Metas Financeiras

### Endpoints Utilizados

- `GET /api/v1/goals`
- `POST /api/v1/goals`
- `PUT /api/v1/goals/{id}`
- `DELETE /api/v1/goals/{id}`
- `GET /api/v1/goals/{id}/progress`

### Componentes

#### GoalListComponent

- Lista de metas
- Progresso visual (barra de progresso)
- Botão "Nova Meta"
- Ações: editar, excluir

#### GoalFormComponent

- Formulário de criação/edição
- Campos: nome, valor alvo, valor atual, prazo

#### GoalProgressComponent

- Barra de progresso
- Percentual atingido
- Valor atual / valor alvo
- Dias restantes (se prazo definido)

---

## Rotas

| Rota | Componente | Guard |
|------|-----------|-------|
| `/login` | LoginComponent | - |
| `/register` | RegisterComponent | - |
| `/dashboard` | DashboardComponent | authGuard |
| `/transactions` | TransactionListComponent | authGuard |
| `/transactions/new` | TransactionFormComponent | authGuard |
| `/transactions/:id/edit` | TransactionFormComponent | authGuard |
| `/categories` | CategoryListComponent | authGuard |
| `/categories/new` | CategoryFormComponent | authGuard |
| `/categories/:id/edit` | CategoryFormComponent | authGuard |
| `/accounts` | AccountListComponent | authGuard |
| `/accounts/new` | AccountFormComponent | authGuard |
| `/accounts/:id/edit` | AccountFormComponent | authGuard |
| `/budgets` | BudgetListComponent | authGuard |
| `/budgets/new` | BudgetFormComponent | authGuard |
| `/budgets/:id/edit` | BudgetFormComponent | authGuard |
| `/goals` | GoalListComponent | authGuard |
| `/goals/new` | GoalFormComponent | authGuard |
| `/goals/:id/edit` | GoalFormComponent | authGuard |
| `/**` | Redirect para `/dashboard` | - |

---

## Dependências

### Package.json

```json
{
  "dependencies": {
    "@angular/animations": "^22.1.0",
    "@angular/common": "^22.1.0",
    "@angular/compiler": "^22.1.0",
    "@angular/core": "^22.1.0",
    "@angular/forms": "^22.1.0",
    "@angular/platform-browser": "^22.1.0",
    "@angular/platform-browser-dynamic": "^22.1.0",
    "@angular/router": "^22.1.0",
    "chart.js": "^4.0.0",
    "ng2-charts": "^10.0.0",
    "rxjs": "^7.4.0",
    "tailwindcss": "^4.0.0",
    "tslib": "^2.6.0",
    "zone.js": "^0.15.0"
  },
  "devDependencies": {
    "@angular/cli": "^22.1.0",
    "@angular/compiler-cli": "^22.1.0",
    "typescript": "^5.8.0"
  }
}
```

---

## Ambiente

### Variáveis de Ambiente

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `apiBaseUrl` | URL da API backend | `http://localhost:8080` |

### environment.ts

```typescript
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:8080'
};
```

### environment.prod.ts

```typescript
export const environment = {
  production: true,
  apiBaseUrl: ''
};
```

---

## Ordem de Execução

| Fase | Descrição | Depende de |
|------|-----------|-----------|
| 1 | Projeto Base e Configuração | — |
| 2 | Core (Auth, Interceptor, Guards) | Fase 1 |
| 3 | Layout (Sidebar + Header) | Fase 1 |
| 4 | Auth (Login/Cadastro) | Fases 2, 3 |
| 5 | Dashboard | Fases 2, 3 |
| 6 | Transações | Fases 2, 3 |
| 7 | Categorias | Fases 2, 3 |
| 8 | Contas Bancárias | Fases 2, 3 |
| 9 | Orçamentos | Fases 2, 3 |
| 10 | Metas Financeiras | Fases 2, 3 |

---

## Notas

- **Não incluir IA por enquanto** — Fase futura
- **Repositório separado** — Criar `fincore-frontend` no GitHub
- **Tailwind CSS v4** — Configuração CSS-first (sem `tailwind.config.js`)
- **Standalone components** — Sem NgModules
- **Functional guards** — Sem classes de guard
- **Lazy loading** — `loadComponent` em vez de `loadChildren`
