/**
 * useFinanceData.ts
 * TanStack React Query hooks for fetching financial data.
 *
 * In this demo the hooks return mock data.
 * Replace the fetchers with real API calls to your PostgreSQL backend
 * once you have a server running (e.g. Express / Next.js API routes).
 *
 * Example real fetcher:
 *   const fetchGoals = (userId: string) =>
 *     fetch(`/api/goals?userId=${userId}`).then(r => r.json());
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  GOALS,
  FUNDS,
  SPEND_CATEGORIES,
  CASH_FLOW,
  NET_WORTH_TREND,
} from "@/lib/data";
import type { Goal, Fund, SpendCategory, CashFlowMonth, NetWorthPoint } from "@/types";

// Simulated network delay
const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

// ── Goals ─────────────────────────────────────────────────────────────────────
export function useGoals() {
  return useQuery<Goal[]>({
    queryKey: ["goals"],
    queryFn: async () => { await delay(); return GOALS; },
  });
}

export function useUpdateGoal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (goal: Partial<Goal> & { id: string }) => {
      await delay(200);
      // POST /api/goals/:id with goal data
      return goal;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["goals"] }),
  });
}

// ── Portfolio ─────────────────────────────────────────────────────────────────
export function useHoldings() {
  return useQuery<Fund[]>({
    queryKey: ["holdings"],
    queryFn: async () => { await delay(); return FUNDS; },
  });
}

// ── Spending ──────────────────────────────────────────────────────────────────
export function useSpending(month?: string) {
  return useQuery<SpendCategory[]>({
    queryKey: ["spending", month ?? "current"],
    queryFn: async () => { await delay(); return SPEND_CATEGORIES; },
  });
}

// ── Cash Flow ─────────────────────────────────────────────────────────────────
export function useCashFlow() {
  return useQuery<CashFlowMonth[]>({
    queryKey: ["cashflow"],
    queryFn: async () => { await delay(); return CASH_FLOW; },
  });
}

// ── Net Worth ─────────────────────────────────────────────────────────────────
export function useNetWorthTrend() {
  return useQuery<NetWorthPoint[]>({
    queryKey: ["networth"],
    queryFn: async () => { await delay(); return NET_WORTH_TREND; },
  });
}
