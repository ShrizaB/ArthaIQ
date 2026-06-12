import { motion } from "framer-motion";
import { Card, CardLabel, CardLabelRow } from "@/components/ui/card";
import { DonutChart, XIRRBar } from "@/components/charts/Charts";
import { FUNDS } from "@/lib/data";
import { formatINR, formatPct } from "@/lib/utils";

export default function PortfolioPage() {
  const total = FUNDS.reduce((s, f) => s + f.value, 0);
  const wtdXIRR = FUNDS.reduce((s, f) => s + f.xirr * (f.value / total), 0);
  const best = [...FUNDS].sort((a, b) => b.xirr - a.xirr)[0];

  const allocData = FUNDS.map((f) => ({ name: f.tag, value: f.allocation, color: f.color }));
  const xirrData = FUNDS.map((f) => ({ name: f.tag, xirr: f.xirr, color: f.color }));

  const KPIS = [
    { label: "Portfolio value", value: formatINR(total), hint: "+₹2.40L unrealised", hintColor: "#3DAA70" },
    { label: "Blended XIRR", value: `${wtdXIRR.toFixed(1)}%`, hint: "weighted average", hintColor: "#C9A84C" },
    { label: "Top performer", value: `${best.xirr}%`, hint: best.name.split(" ").slice(0, 2).join(" "), hintColor: "#5C5850" },
    { label: "Active funds", value: FUNDS.length.toString(), hint: "diversified", hintColor: "#5C5850" },
  ];

  return (
    <div className="p-8 space-y-5">
      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4">
        {KPIS.map((k, i) => (
          <motion.div key={k.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05, duration: 0.2 }}>
            <Card padding="sm">
              <div className="aq-label mb-1.5">{k.label}</div>
              <div className="font-serif text-xl text-ink tracking-tight">{k.value}</div>
              <div className="text-[11px] font-mono mt-1" style={{ color: k.hintColor }}>{k.hint}</div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Alloc + XIRR */}
      <div className="grid grid-cols-2 gap-5">
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.2 }}>
          <Card>
            <CardLabelRow right={<span className="aq-tag">by value</span>}>Allocation</CardLabelRow>
            {/* Strip */}
            <div className="flex h-1.5 rounded-full overflow-hidden gap-0.5 mb-3">
              {FUNDS.map((f) => (
                <div key={f.id} style={{ flex: f.allocation, background: f.color }} title={`${f.tag} ${f.allocation}%`} />
              ))}
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-2 mb-5">
              {FUNDS.map((f) => (
                <span key={f.id} className="flex items-center gap-1.5 text-[10px] font-mono text-ink-3">
                  <span className="w-2 h-2 rounded-sm inline-block" style={{ background: f.color }} />
                  {f.tag} {f.allocation}%
                </span>
              ))}
            </div>
            <DonutChart data={allocData} height={170} />
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14, duration: 0.2 }}>
          <Card>
            <CardLabel>XIRR by fund</CardLabel>
            <XIRRBar data={xirrData} height={270} />
          </Card>
        </motion.div>
      </div>

      {/* Holdings table */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18, duration: 0.2 }}>
        <Card padding="none">
          <div className="px-6 py-4 border-b border-rule flex items-center justify-between">
            <div className="aq-label">Holdings</div>
            <span className="aq-tag-green">Live NAV</span>
          </div>
          <table className="w-full text-[12px]">
            <thead>
              <tr className="bg-surface-2">
                {["Fund", "Type", "Value", "Alloc", "XIRR", "Today"].map((h, i) => (
                  <th key={h} className={`px-5 py-2.5 text-[10px] font-mono text-ink-3 tracking-[0.08em] uppercase font-normal border-b border-rule ${i === 0 ? "text-left" : "text-right"}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {FUNDS.map((f, i) => (
                <motion.tr
                  key={f.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 + i * 0.04 }}
                  className="border-b border-rule last:border-none hover:bg-surface-2 transition-colors"
                >
                  <td className="px-5 py-3 text-left">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-sm flex-shrink-0" style={{ background: f.color }} />
                      <span className="text-ink font-medium text-[13px]">{f.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-right"><span className="aq-tag">{f.tag}</span></td>
                  <td className="px-5 py-3 text-right font-mono text-ink-2">{formatINR(f.value)}</td>
                  <td className="px-5 py-3 text-right font-mono text-ink-3">{f.allocation}%</td>
                  <td className="px-5 py-3 text-right font-mono font-medium" style={{ color: f.xirr >= 10 ? "#3DAA70" : "#A09A90" }}>
                    {f.xirr.toFixed(2)}%
                  </td>
                  <td className="px-5 py-3 text-right font-mono font-medium" style={{ color: f.dayChange >= 0 ? "#3DAA70" : "#C05050" }}>
                    {formatPct(f.dayChange, 2)}
                  </td>
                </motion.tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-surface-2 border-t-2 border-rule">
                <td className="px-5 py-3 text-left text-[11px] font-mono text-ink-3 uppercase tracking-wider" colSpan={2}>Total</td>
                <td className="px-5 py-3 text-right font-mono font-medium text-ink">{formatINR(total)}</td>
                <td className="px-5 py-3 text-right font-mono text-ink-3">100%</td>
                <td className="px-5 py-3 text-right font-mono font-medium text-gain">{wtdXIRR.toFixed(2)}%</td>
                <td />
              </tr>
            </tfoot>
          </table>
        </Card>
      </motion.div>
    </div>
  );
}
