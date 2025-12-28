export enum StressLevel {
  Stable = 'Stable',
  Mild = 'Mild',
  High = 'High',
  Critical = 'Critical'
}

export interface TransactionPoint {
  date: string;
  amount: number;
  category: string;
  type: 'discretionary' | 'essential';
}

export interface FinancialAnalysis {
  score: number;
  level: StressLevel;
  observations: string[];
  recentChanges: string;
  importance: string;
  recommendations: string[];
  analyzedTransactions: TransactionPoint[];
}

export interface AnalysisState {
  status: 'idle' | 'analyzing' | 'complete' | 'error';
  data: FinancialAnalysis | null;
  error?: string;
}

export type FinancialInput = 
  | { type: 'text'; content: string }
  | { type: 'file'; data: string; mimeType: string };
