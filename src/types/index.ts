export interface User {
  id: string;
  email?: string;
  name?: string;
  picture?: string;
  claims: Record<string, unknown>;
}

export interface Goal {
  id: string;
  name: string;
  icon: string;
  color: string;
  current: number;
  target: number;
  deadline: string;
  note: string;
  tip: string;
}

export interface Fund {
  id: string;
  name: string;
  tag: string;
  value: number;
  allocation: number;
  xirr: number;
  dayChange: number;
  color: string;
}

export interface SpendCategory {
  name: string;
  actual: number;
  budget: number;
  color: string;
}

export interface CashFlowMonth {
  month: string;
  income: number;
  expense: number;
}

export interface TaxState {
  income: number;
  elss: number;
  ppf: number;
  nps: number;
  hra: number;
  d80: number;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface NetWorthPoint {
  month: string;
  value: number;
}
