export interface DashboardSummary {
  income: number;
  expense: number;
  balance: number;
}

export interface ExpensesByCategory {
  categoryId: string;
  categoryName: string;
  total: number;
  percentage: number;
}

export interface MonthlyEvolution {
  month: number;
  year: number;
  income: number;
  expense: number;
}
