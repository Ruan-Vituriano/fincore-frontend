export interface RecurringExpense {
  id: string;
  description: string;
  amount: number;
  categoryId: string;
  categoryName: string;
  accountId: string;
  accountName: string;
  userId: string;
  dayOfMonth: number;
  isActive: boolean;
  paidInCurrentMonth: boolean;
  createdAt: string;
}

export interface RecurringExpenseRequest {
  description: string;
  amount: number;
  categoryId: string;
  accountId: string;
  dayOfMonth: number;
  isActive: boolean;
}

export interface GenerateResponse {
  totalGenerated: number;
  descriptions: string[];
}
