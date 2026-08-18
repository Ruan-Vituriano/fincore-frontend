export type AccountType = 'CHECKING' | 'SAVINGS' | 'CREDIT_CARD';

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
  userId: string;
  createdAt: string;
}

export interface AccountRequest {
  name: string;
  type: AccountType;
  balance: number;
}
