export type TransactionType = 'INCOME' | 'EXPENSE';

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string;
  type: TransactionType;
  categoryId: string;
  categoryName: string;
  accountId: string;
  accountName: string;
  userId: string;
  notes?: string;
  isRecurring?: boolean;
  installmentNumber?: number;
  totalInstallments?: number;
  parentTransactionId?: string;
  createdAt: string;
}

export interface TransactionRequest {
  description: string;
  amount: number;
  date: string;
  categoryId: string;
  accountId: string;
  notes?: string;
  isRecurring?: boolean;
  totalInstallments?: number;
}

export interface TransactionFilters {
  dateFrom?: string;
  dateTo?: string;
  categoryId?: string;
  accountId?: string;
  type?: TransactionType;
}
