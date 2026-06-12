import { motion } from "framer-motion";
import { Card, CardLabel, CardLabelRow } from "@/components/ui/card";
import { DonutChart, TrendChart } from "@/components/charts/Charts";
import { SPEND_CATEGORIES, CASH_FLOW } from "@/lib/data";
import { formatINR } from "@/lib/utils";

export default function SpendingPage() {
  const total = SPEND_CATEGORIES.reduce((s, c) => s + c.actual, 0);
  const budget = SPEND_CATEGORIES.reduce((s, c) => s + c.budget, 0);
  const over = SPEND_CATEGORIES.filter((c) => c.actual > c.budget);
  const under = SPEND_CATEGORIES.filter((c) => c.actual < c.budget);
  const unspent = under.reduce((s, c) => s + (c.budget - c.actual), 0);

  const donutData = SPEND_CATEGORIES.map((c) => ({
    name: c.name,
    value: Math.round((c.actual / total) * 100),
    color: c.color,
  }));

  const KPIS = [
    { label: "Total spent", value: formatINR(total), hint: "March 2025", hintColor: "#5C5850" },
    { label: "Budget set", value: formatINR(budget), hint: "monthly limit", hintColor: "#5C5850" },
    { label: "Categories over", value: over.length.toString(), hint: over.map((c) => c.name.split(" ")[0]).join(", "), hintColor: "#C05050" },
    { label: "Unspent budget", value: formatINR(unspent), hint: "available to invest", hintColor: "#3DAA70" },
  ];

  return (
    <div className="p-8 space-y-5">
      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4">
        {KPIS.map((k, i) => (
          <motion.div
            key={k.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.2 }}
          >
            <Card padding="sm">
              <div className="aq-label mb-1.5">{k.label}</div>
              <div className="font-serif text-xl text-ink tracking-tight">{k.value}</div>
              <div className="text-[11px] font-mono mt-1" style={{ color: k.hintColor }}>{k.hint}</div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Breakdown + Donut */}
      <div className="grid grid-cols-2 gap-5">
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.2 }}>
          <Card>
            <CardLabel>March — where it went</CardLabel>
            <div className="space-y-0">
              {SPEND_CATEGORIES.map((c, i) => {
                const util = Math.min(110, Math.round((c.actual / c.budget) * 100));
                const isOver = c.actual > c.budget;
                return (
                  <div key={i} className="flex items-center gap-3 py-2.5 border-b border-rule last:border-none">
                    <div className={`text-[12px] w-36 flex-shrink-0 ${isOver ? "text-loss" : "text-ink"}`}>
                      {c.name}
                    </div>
                    <div className="flex-1 h-1 bg-surface-4 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: isOver ? "#C05050" : "#3A3530" }}
                        initial={{ width: 0 }}
                        animate={{ width: `${util}%` }}
                        transition={{ delay: 0.1 + i * 0.04, duration: 0.5, ease: "easeOut" }}
                      />
                    </div>
                    <div className={`text-[11px] font-mono w-14 text-right flex-shrink-0 ${isOver ? "text-loss" : "text-ink-2"}`}>
                      {formatINR(c.actual)}
                    </div>
                    <div className="w-8 flex-shrink-0">
                      {isOver && <span className="text-[9px] font-mono text-loss">OVER</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14, duration: 0.2 }}>
          <Card>
            <CardLabel>Spend breakdown</CardLabel>
            <DonutChart data={donutData} height={200} />
            <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4">
              {SPEND_CATEGORIES.map((c, i) => (
                <span key={i} className="flex items-center gap-1.5 text-[10px] font-mono text-ink-3">
                  <span className="w-2 h-2 rounded-sm inline-block" style={{ background: c.color }} />
                  {c.name.split(" ")[0]} {Math.round((c.actual / total) * 100)}%
                </span>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Trend */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18, duration: 0.2 }}>
        <Card>
          <CardLabelRow right={<span className="aq-tag">Oct – Mar</span>}>
            6-month spend trend
          </CardLabelRow>
          <div className="flex gap-4 mb-3">
            {[["Income", "#3DAA70", true], ["Expenses", "#C05050", false]].map(([l, c, dashed]) => (
              <span key={String(l)} className="flex items-center gap-1.5 text-[11px] font-mono text-ink-3">
                <span className="inline-block" style={{ width: 16, height: 2, background: String(c), borderTop: dashed ? `2px dashed ${c}` : undefined }} />
                {l}
              </span>
            ))}
          </div>
          <TrendChart data={CASH_FLOW} height={150} />
        </Card>
      </motion.div>
    </div>
  );
}
