# Plano do Fincore Frontend

Frontend Angular para o Fincore, focado em gestão de finanças pessoais. O projeto
consome a API do backend em repositório separado.

## Stack atual

- Angular 21
- TypeScript 5.9
- Tailwind CSS 4
- RxJS 7.8
- Angular Router
- chart.js (gráficos)

## Estrutura de pastas

```text
fincore-frontend/
├── src/
│   ├── app/
│   │   ├── core/                         # Infraestrutura transversal
│   │   │   ├── guards/
│   │   │   │   └── auth.guard.ts
│   │   │   └── interceptors/
│   │   │       └── auth.interceptor.ts
│   │   ├── models/                       # Interfaces e tipos de domínio
│   │   │   ├── auth.model.ts
│   │   │   ├── user.model.ts
│   │   │   ├── category.model.ts
│   │   │   ├── account.model.ts
│   │   │   ├── transaction.model.ts
│   │   │   ├── budget.model.ts
│   │   │   ├── goal.model.ts
│   │   │   └── dashboard.model.ts
│   │   ├── services/                     # Serviços compartilhados e API
│   │   │   ├── api.service.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── dashboard.service.ts
│   │   │   ├── category.service.ts
│   │   │   ├── account.service.ts
│   │   │   ├── transaction.service.ts
│   │   │   ├── budget.service.ts
│   │   │   └── goal.service.ts
│   │   ├── pages/                        # Componentes associados a rotas
│   │   │   ├── auth/
│   │   │   │   ├── login/
│   │   │   │   └── register/
│   │   │   ├── dashboard/
│   │   │   ├── transactions/
│   │   │   ├── categories/
│   │   │   ├── accounts/
│   │   │   ├── budgets/
│   │   │   └── goals/
│   │   ├── components/                   # Componentes específicos da aplicação
│   │   │   ├── expenses-by-category-chart/
│   │   │   ├── monthly-evolution-chart/
│   │   │   └── summary-cards/
│   │   ├── shared/                       # Elementos reutilizáveis e sem domínio
│   │   │   ├── components/
│   │   │   │   ├── data-table/
│   │   │   │   ├── header/
│   │   │   │   ├── sidebar/
│   │   │   │   └── layout/
│   │   │   └── pipes/
│   │   ├── environments/
│   │   │   ├── environment.ts
│   │   │   └── environment.development.ts
│   │   ├── app.config.ts
│   │   ├── app.routes.ts
│   │   └── app.ts
│   ├── main.ts
│   └── styles.css
├── angular.json
├── package.json
├── proxy.conf.json
└── tsconfig.json
```

### Convenções

- Todo serviço fica em `app/services`; não criar `services` dentro de páginas ou componentes.
- Todo model, interface ou tipo de domínio fica em `app/models`.
- `app/pages` contém somente telas acessadas por rotas.
- `app/components` contém componentes de domínio usados por uma ou mais páginas.
- `app/shared` contém componentes, pipes e utilitários genéricos, sem regra de negócio.
- Guards e interceptors pertencem a `app/core`.
- Formulários utilizam modal/dialog sobre a listagem.

---

## Fase 1 — Base da aplicação

- [x] Projeto Angular criado
- [x] Tailwind CSS configurado
- [x] Criar models (interfaces TS para cada entidade do backend)
- [x] Criar ambientes (`environment.ts`, `environment.development.ts`)
- [x] Criar proxy (`proxy.conf.json`) e configurar no `angular.json`
- [x] Configurar `provideHttpClient` com interceptor no `app.config.ts`
- [x] Criar `ApiService` (wrapper genérico do `HttpClient`)
- [x] Criar `AuthService` (login, register, logout, persistência do token)
- [x] Criar `AuthInterceptor` (injeta `Authorization: Bearer`)
- [x] Criar `AuthGuard` (protege rotas autenticadas)

### Models a criar

| Model | Campos principais |
|---|---|
| `auth.model.ts` | `LoginRequest`, `RegisterRequest`, `TokenResponse` |
| `user.model.ts` | `User`, `UserRequest`, `UserResponse` |
| `category.model.ts` | `Category`, `CategoryRequest`, `CategoryResponse`, `CategoryType` |
| `account.model.ts` | `Account`, `AccountRequest`, `AccountResponse`, `AccountType` |
| `transaction.model.ts` | `Transaction`, `TransactionRequest`, `TransactionResponse`, `TransactionType` |
| `budget.model.ts` | `Budget`, `BudgetRequest`, `BudgetResponse`, `BudgetSummary` |
| `goal.model.ts` | `FinancialGoal`, `GoalRequest`, `GoalResponse`, `GoalProgress` |
| `dashboard.model.ts` | `DashboardSummary`, `ExpensesByCategory`, `MonthlyEvolution` |

---

## Fase 2 — Layout

- [x] Sidebar responsiva com navegação e estado ativo
- [x] Header com título da página e perfil do usuário
- [x] Layout autenticado (sidebar + header + `<router-outlet>`)
- [x] Limpar placeholder do `app.html`

---

## Fase 3 — Autenticação (telas)

- [x] Login: formulário email + senha, redireciona para `/dashboard`
- [x] Register: formulário nome + email + senha, redireciona para `/dashboard`

---

## Fase 4 — Rotas

- [x] Configurar todas as rotas com lazy loading e `authGuard`

| Rota | Página | Proteção |
|---|---|---|
| `/login` | `pages/auth/login` | Pública |
| `/register` | `pages/auth/register` | Pública |
| `/dashboard` | `pages/dashboard` | `authGuard` |
| `/transactions` | `pages/transactions` | `authGuard` |
| `/categories` | `pages/categories` | `authGuard` |
| `/accounts` | `pages/accounts` | `authGuard` |
| `/budgets` | `pages/budgets` | `authGuard` |
| `/goals` | `pages/goals` | `authGuard` |

---

## Fase 5 — Dashboard

- [x] `DashboardService` (chamadas aos 3 endpoints)
- [x] Cards de resumo financeiro (Receitas, Despesas, Saldo)
- [x] Gráfico de despesas por categoria (chart.js pizza)
- [x] Gráfico de evolução mensal (chart.js linhas)
- [x] Página dashboard com seletor de mês/ano

### Endpoints consumidos

| Endpoint | Params | Response |
|---|---|---|
| `GET /api/v1/dashboard/summary` | `month`, `year` | `{ income, expense, balance }` |
| `GET /api/v1/dashboard/expenses-by-category` | `month`, `year` | `[{ categoryId, categoryName, total, percentage }]` |
| `GET /api/v1/dashboard/monthly-evolution` | `months` (default 12) | `[{ month, year, income, expense }]` |

---

## Fase 6 — Módulos financeiros

Cada módulo: service + página com listagem + modal de criar/editar.

### 6.1 Categorias

- [x] `CategoryService` (CRUD)
- [x] Página com listagem (tabela)
- [x] Modal criar/editar

| Endpoint | Método | Body |
|---|---|---|
| `/api/v1/categories` | GET | — |
| `/api/v1/categories` | POST | `{ name, type, icon?, color? }` |
| `/api/v1/categories/{id}` | PUT | `{ name, type, icon?, color? }` |
| `/api/v1/categories/{id}` | DELETE | — |

### 6.2 Contas

- [x] `AccountService` (CRUD)
- [x] Página com listagem (tabela + saldo)
- [x] Modal criar/editar

| Endpoint | Método | Body |
|---|---|---|
| `/api/v1/accounts` | GET | — |
| `/api/v1/accounts` | POST | `{ name, type, balance }` |
| `/api/v1/accounts/{id}` | PUT | `{ name, type, balance }` |
| `/api/v1/accounts/{id}` | DELETE | — |

### 6.3 Transações

- [x] `TransactionService` (CRUD + filtros)
- [x] Página com listagem + filtros (data, categoria, conta, tipo)
- [x] Modal criar/editar (suporta parcelamento)

| Endpoint | Método | Body / Params |
|---|---|---|
| `/api/v1/transactions` | GET | `?dateFrom=&dateTo=&categoryId=&accountId=&type=` |
| `/api/v1/transactions` | POST | `{ description, amount, date, categoryId, accountId, notes?, isRecurring?, totalInstallments? }` |
| `/api/v1/transactions/{id}` | PUT | `{ ... }` + `?applyToAll=` |
| `/api/v1/transactions/{id}` | DELETE | `?applyToAll=` |
| `/api/v1/transactions/installments/{parentId}` | GET | — |

### 6.4 Orçamentos

- [x] `BudgetService` (CRUD + summary)
- [x] Página com listagem + resumo mensal (gasto vs orçado)
- [x] Modal criar/editar

| Endpoint | Método | Body / Params |
|---|---|---|
| `/api/v1/budgets` | GET | `?month=&year=` |
| `/api/v1/budgets` | POST | `{ name, amount, categoryId, month, year }` |
| `/api/v1/budgets/{id}` | PUT | `{ name, amount, categoryId, month, year }` |
| `/api/v1/budgets/{id}` | DELETE | — |
| `/api/v1/budgets/summary` | GET | `?month=&year=` → `[{ budgeted, spent, remaining, percentageUsed }]` |

### 6.5 Metas

- [x] `GoalService` (CRUD + progress)
- [x] Página com listagem + barra de progresso
- [x] Modal criar/editar

| Endpoint | Método | Body / Params |
|---|---|---|
| `/api/v1/goals` | GET | — |
| `/api/v1/goals` | POST | `{ name, targetAmount, currentAmount?, deadline? }` |
| `/api/v1/goals/{id}` | PUT | `{ name, targetAmount, currentAmount?, deadline? }` |
| `/api/v1/goals/{id}` | DELETE | — |
| `/api/v1/goals/{id}/progress` | GET | → `{ percentageAchieved, ... }` |

---

## Fase 7 — Conclusão

- [x] Atualizar checkboxes neste PLAN.md
- [x] Verificar build sem erros (`ng build`)
- [x] Verificar lint

---

## API esperada (resumo)

| Recurso | Endpoints principais |
|---|---|
| Autenticação | `/api/v1/auth/login`, `/api/v1/auth/register` |
| Usuário | `/api/v1/users/me` (GET, PUT) |
| Dashboard | `/api/v1/dashboard/summary`, `/expenses-by-category`, `/monthly-evolution` |
| Transações | `/api/v1/transactions` (CRUD + filtros + parcelamento) |
| Categorias | `/api/v1/categories` (CRUD) |
| Contas | `/api/v1/accounts` (CRUD) |
| Orçamentos | `/api/v1/budgets` (CRUD + summary) |
| Metas | `/api/v1/goals` (CRUD + progress) |

## Notas

- A integração com IA fica para uma fase posterior.
- A aplicação usa componentes standalone; não criar `NgModules`.
- Priorizar carregamento sob demanda para páginas quando as rotas forem implementadas.
- Formulários utilizam modal/dialog sobre a listagem.
- Gráficos utilizam chart.js (direto, sem wrapper).
