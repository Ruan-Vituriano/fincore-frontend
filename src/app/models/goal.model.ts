export interface FinancialGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
  userId: string;
  createdAt: string;
}

export interface GoalRequest {
  name: string;
  targetAmount: number;
  currentAmount?: number;
  deadline?: string;
}

export interface GoalProgress {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  percentageAchieved: number;
  deadline?: string;
}
