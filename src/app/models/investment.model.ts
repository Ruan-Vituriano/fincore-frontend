export type InvestmentType = 'ACAO' | 'FII' | 'RENDA_FIXA' | 'CRIPTO' | 'FUNDO' | 'OUTROS';

export interface Investment {
  id: string;
  name: string;
  ticker: string;
  type: InvestmentType;
  amountInvested: number;
  currentValue: number;
  returnAmount: number;
  returnPercentage: number;
  purchaseDate: string;
  notes: string;
  userId: string;
  createdAt: string;
}

export interface InvestmentRequest {
  name: string;
  ticker: string;
  type: InvestmentType;
  amountInvested: number;
  currentValue: number;
  purchaseDate: string;
  notes: string;
}

export interface PortfolioSummary {
  totalInvested: number;
  totalCurrentValue: number;
  totalReturnAmount: number;
  totalReturnPercentage: number;
  allocationByType: Record<string, AllocationByType>;
}

export interface AllocationByType {
  amount: number;
  percentage: number;
}

export const INVESTMENT_TYPE_LABELS: Record<InvestmentType, string> = {
  ACAO: 'Ação',
  FII: 'FII',
  RENDA_FIXA: 'Renda Fixa',
  CRIPTO: 'Criptomoeda',
  FUNDO: 'Fundo',
  OUTROS: 'Outros',
};
