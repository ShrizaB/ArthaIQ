import type { Goal, Fund, SpendCategory, CashFlowMonth, NetWorthPoint } from "@/types";

export const NET_WORTH_TREND: NetWorthPoint[] = [
  { month: "Apr", value: 2140000 },
  { month: "May", value: 2218000 },
  { month: "Jun", value: 2195000 },
  { month: "Jul", value: 2310000 },
  { month: "Aug", value: 2374000 },
  { month: "Sep", value: 2421000 },
  { month: "Oct", value: 2389000 },
  { month: "Nov", value: 2502000 },
  { month: "Dec", value: 2584000 },
  { month: "Jan", value: 2611000 },
  { month: "Feb", value: 2680000 },
  { month: "Mar", value: 2742500 },
];

export const CASH_FLOW: CashFlowMonth[] = [
  { month: "Oct", income: 185000, expense: 108000 },
  { month: "Nov", income: 185000, expense: 97000 },
  { month: "Dec", income: 210000, expense: 112000 },
  { month: "Jan", income: 185000, expense: 103000 },
  { month: "Feb", income: 185000, expense: 99000 },
  { month: "Mar", income: 185000, expense: 101000 },
];

export const GOALS: Goal[] = [
  {
    id: "emergency",
    name: "Emergency Fund",
    icon: "shield",
    color: "#3DAA70",
    current: 540000,
    target: 600000,
    deadline: "Sep 2025",
    note: "Only ₹60K away — about 6 weeks at your current pace. Keep it in a liquid fund for easy access.",
    tip: "Liquid fund earns ~7% p.a. while staying instantly accessible.",
  },
  {
    id: "home",
    name: "Dream Home",
    icon: "home",
    color: "#C9A84C",
    current: 1240000,
    target: 5000000,
    deadline: "Dec 2027",
    note: "Need ₹1.14L/month consistently to reach the ₹50L down payment by 2027.",
    tip: "Flexi cap + arbitrage fund mix works well for this 3-year horizon.",
  },
  {
    id: "education",
    name: "Riya's Education",
    icon: "graduation-cap",
    color: "#4A80C4",
    current: 487000,
    target: 2500000,
    deadline: "Jun 2032",
    note: "7 years out. A ₹12,000/month SIP at 12% CAGR gets you there right on time.",
    tip: "Large cap index fund is ideal — low cost with a long runway ahead.",
  },
  {
    id: "retirement",
    name: "Retirement",
    icon: "sun",
    color: "#A07860",
    current: 4120000,
    target: 30000000,
    deadline: "Mar 2045",
    note: "20 years is plenty of runway. Increase SIP by ₹5K each year and you'll outpace the target.",
    tip: "Balance equity SIPs with NPS contributions — the 80CCD(1B) deduction alone saves ₹15K/year.",
  },
];

export const FUNDS: Fund[] = [
  { id: "mirae", name: "Mirae Large Cap ELSS", tag: "ELSS", value: 684000, allocation: 32.1, xirr: 14.8, dayChange: 0.62, color: "#C9A84C" },
  { id: "ppfas", name: "PPFAS Flexi Cap", tag: "Equity", value: 521000, allocation: 24.5, xirr: 18.3, dayChange: 1.14, color: "#3DAA70" },
  { id: "icici", name: "ICICI Short Duration", tag: "Debt", value: 312000, allocation: 14.7, xirr: 7.2, dayChange: 0.04, color: "#4A80C4" },
  { id: "uti", name: "UTI Nifty 50 Index", tag: "Index", value: 248000, allocation: 11.6, xirr: 13.1, dayChange: -0.31, color: "#A07860" },
  { id: "nippon", name: "Nippon Gold ETF", tag: "Gold", value: 198000, allocation: 9.3, xirr: 11.7, dayChange: 0.88, color: "#7A6AA0" },
  { id: "hdfc", name: "HDFC Liquid Fund", tag: "Liquid", value: 165000, allocation: 7.8, xirr: 7.05, dayChange: 0.02, color: "#5C5850" },
];

export const SPEND_CATEGORIES: SpendCategory[] = [
  { name: "Housing & Rent", actual: 38000, budget: 38000, color: "#C9A84C" },
  { name: "Insurance", actual: 12400, budget: 12400, color: "#3DAA70" },
  { name: "Groceries", actual: 9200, budget: 12000, color: "#4A80C4" },
  { name: "Dining Out", actual: 8400, budget: 6000, color: "#C05050" },
  { name: "Transport", actual: 6800, budget: 8000, color: "#A07860" },
  { name: "Utilities", actual: 4100, budget: 5000, color: "#7A6AA0" },
  { name: "Healthcare", actual: 3200, budget: 5000, color: "#5C7A50" },
  { name: "Subscriptions", actual: 2800, budget: 2500, color: "#C05050" },
];

export const AI_SYSTEM_PROMPT = `You are ArthaIQ, a personal financial advisor for Arjun Mehta. Speak like a trusted, frank friend who also happens to be an expert wealth manager. Direct, warm, specific. No bullet lists — write flowing prose. 80–120 words max. Always reference exact numbers from the profile.

Client Profile:
- Net Worth: ₹27.43L (+28.1% YoY)
- Portfolio: ₹21.28L, Blended XIRR 13.4%
  - Mirae ELSS: ₹6.84L at 14.8%
  - PPFAS Flexi Cap: ₹5.21L at 18.3% (best performer)
  - ICICI Short Duration: ₹3.12L at 7.2%
  - UTI Nifty 50: ₹2.48L at 13.1%
  - Nippon Gold ETF: ₹1.98L at 11.7%
  - HDFC Liquid: ₹1.65L at 7.05%
- Monthly Income: ₹1.85L | Expenses: ₹1.01L | Savings Rate: 45.4%
- Goals:
  - Emergency Fund: 90% done (₹60K gap, ~6 weeks away)
  - Dream Home ₹50L: 24.8% done (need ₹1.14L/month SIP)
  - Riya's Education ₹25L: 19.5% done (7 years)
  - Retirement ₹3Cr: 13.7% done (20 years)
- Over budget: Dining +₹2,400 | Subscriptions +₹300
- 80C utilised: ₹1.3L of ₹1.5L limit
- Tax regime: Old regime saves more currently`;

export const QUICK_QUESTIONS = [
  "Am I on track for retirement?",
  "How do I close my home goal gap?",
  "Should I increase my SIP?",
  "How do I cut my tax bill?",
  "Rate my portfolio risk",
];
