export interface Budget {
  id: string;
  name: string;
  amount: number;
  categoryId: string;
  categoryName: string;
  userId: string;
  month: number;
  year: number;
  createdAt: string;
}

export interface BudgetRequest {
  name: string;
  amount: number;
  categoryId: string;
  month: number;
  year: number;
}

export interface BudgetSummary {
  budgetId: string;
  categoryId: string;
  categoryName: string;
  budgeted: number;
  spent: number;
  remaining: number;
  percentageUsed: number;
}
