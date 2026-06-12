import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardLabel, CardLabelRow } from "@/components/ui/card";
import { NetWorthChart, CashFlowChart } from "@/components/charts/Charts";
import { GoalCard } from "@/components/ui/GoalCard";
import { NET_WORTH_TREND, CASH_FLOW, GOALS } from "@/lib/data";
import { formatINR } from "@/lib/utils";

const STATS = [
  { label: "Invested", value: "₹21.28L", hint: "13.4% XIRR", hintColor: "#3DAA70" },
  { label: "In Bank / FD", value: "₹8.23L", hint: "4 accounts", hintColor: "#5C5850" },
  { label: "Savings Rate", value: "45.4%", hint: "₹84K saved / mo", hintColor: "#5C5850" },
];

const INSIGHTS = [
  {
    icon: "⚠️",
    title: "Dining over budget",
    body: "₹8,400 spent vs ₹6,000 budget. Fixing this adds ₹29K to your wealth each year.",
    bg: "rgba(192,80,80,0.07)",
    border: "rgba(192,80,80,0.2)",
    titleColor: "#C05050",
  },
  {
    icon: "🎯",
    title: "Emergency fund 90% done",
    body: "Only ₹60K more. At your current pace you'll hit 100% in about 6 weeks.",
    bg: "rgba(61,170,112,0.07)",
    border: "rgba(61,170,112,0.2)",
    titleColor: "#3DAA70",
  },
  {
    icon: "💡",
    title: "₹20K 80C gap",
    body: "Top up PPF before March 31. This saves you ₹6,000 in taxes this financial year.",
    bg: "rgba(201,168,76,0.07)",
    border: "rgba(201,168,76,0.2)",
    titleColor: "#C9A84C",
  },
];

export default function DashboardPage() {
  const navigate = useNavigate();

  return (
    <div className="p-8 space-y-5">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="bg-surface-1 border border-rule rounded-2xl p-8"
      >
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="aq-label mb-3">Total net worth</div>
            <div className="font-serif text-[52px] text-ink leading-none tracking-[-0.03em]">
              ₹27.43L
            </div>
            <div className="flex items-center gap-3 mt-3">
              <span className="inline-flex items-center gap-1.5 text-[12px] font-mono text-gain bg-gain/10 border border-gain/20 px-2.5 py-1 rounded-full">
                <TrendingUp size={12} />
                +28.1% this year
              </span>
              <span className="text-[12px] font-mono text-ink-3">↑ ₹5.99L since April 2024</span>
            </div>
          </div>
        </div>

        {/* Sparkline */}
        <NetWorthChart data={NET_WORTH_TREND} height={110} />

        <div className="h-px bg-rule my-5" />

        {/* Sub stats */}
        <div className="grid grid-cols-3 gap-0">
          {STATS.map((s, i) => (
            <div
              key={s.label}
              className={`${i > 0 ? "pl-8 border-l border-rule" : ""} ${i < 2 ? "pr-8" : ""}`}
            >
              <div className="aq-label mb-1.5">{s.label}</div>
              <div className="font-serif text-2xl text-ink tracking-tight">{s.value}</div>
              <div className="text-[11px] font-mono mt-1" style={{ color: s.hintColor }}>
                {s.hint}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Charts row */}
      <div className="grid grid-cols-2 gap-5">
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08, duration: 0.22 }}>
          <Card>
            <CardLabelRow right={<span className="aq-tag">6 months</span>}>Cash flow</CardLabelRow>
            <div className="flex gap-4 mb-3">
              {[["Income", "#3DAA70"], ["Expenses", "#3A3530"], ["Saved", "#C9A84C"]].map(([l, c]) => (
                <span key={l} className="flex items-center gap-1.5 text-[11px] font-mono text-ink-3">
                  <span className="w-2 h-2 rounded-sm inline-block" style={{ background: c }} />
                  {l}
                </span>
              ))}
            </div>
            <CashFlowChart data={CASH_FLOW} height={160} />
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12, duration: 0.22 }}>
          <Card>
            <CardLabel>Insights for you</CardLabel>
            <div className="space-y-2.5">
              {INSIGHTS.map((ins, i) => (
                <div
                  key={i}
                  className="flex gap-2.5 p-3.5 rounded-xl"
                  style={{ background: ins.bg, border: `1px solid ${ins.border}` }}
                >
                  <span className="text-base flex-shrink-0 mt-0.5">{ins.icon}</span>
                  <div>
                    <div className="text-[12px] font-medium mb-0.5" style={{ color: ins.titleColor }}>
                      {ins.title}
                    </div>
                    <div className="text-[12px] text-ink-2 leading-relaxed">{ins.body}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Goals strip */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16, duration: 0.22 }}>
        <div className="flex items-center justify-between mb-3">
          <div className="text-[13px] font-medium text-ink">Goals snapshot</div>
          <button
            onClick={() => navigate("/goals")}
            className="text-[11px] font-mono text-ink-3 hover:text-ink transition-colors"
          >
            View all →
          </button>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {GOALS.map((goal, i) => (
            <GoalCard key={goal.id} goal={goal} compact onClick={() => navigate("/goals")} delay={i * 0.05} />
          ))}
        </div>
      </motion.div>

      {/* Month summary */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.22 }}>
        <Card>
          <CardLabelRow right={<span className="aq-tag">March 2025</span>}>This month</CardLabelRow>
          <div className="grid grid-cols-4 gap-6">
            {[
              { l: "Income", v: "₹1.85L", c: "#F5F0E8" },
              { l: "Spent", v: "₹1.01L", c: "#A09A90" },
              { l: "Saved", v: "₹84K", c: "#3DAA70" },
              { l: "Invested", v: "₹65K", c: "#4A80C4" },
            ].map((m) => (
              <div key={m.l}>
                <div className="aq-label mb-1.5">{m.l}</div>
                <div className="font-serif text-xl tracking-tight" style={{ color: m.c }}>{m.v}</div>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
