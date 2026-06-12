import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardLabel, CardLabelRow } from "@/components/ui/card";
import { TaxBarChart, DonutChart } from "@/components/charts/Charts";
import type { TaxState } from "@/types";
import { formatINR } from "@/lib/utils";

const SLIDERS: Array<{ key: keyof TaxState; label: string; min: number; max: number; step: number; note?: string }> = [
  { key: "income", label: "Annual income", min: 500000, max: 10000000, step: 50000 },
  { key: "elss", label: "ELSS investment (80C)", min: 0, max: 150000, step: 5000 },
  { key: "ppf", label: "PPF / EPF (80C)", min: 0, max: 150000, step: 5000, note: "Combined 80C limit: ₹1,50,000" },
  { key: "nps", label: "NPS — 80CCD(1B)", min: 0, max: 200000, step: 5000, note: "Extra ₹50,000 beyond 80C" },
  { key: "hra", label: "HRA exemption", min: 0, max: 600000, step: 10000 },
  { key: "d80", label: "Health insurance — 80D", min: 0, max: 100000, step: 5000 },
];

function calcOldTax(ti: number) {
  if (ti <= 250000) return 0;
  if (ti <= 500000) return (ti - 250000) * 0.05;
  if (ti <= 1000000) return 12500 + (ti - 500000) * 0.2;
  return 112500 + (ti - 1000000) * 0.3;
}

function calcNewTax(income: number) {
  if (income <= 300000) return 0;
  if (income <= 600000) return (income - 300000) * 0.05;
  if (income <= 900000) return 15000 + (income - 600000) * 0.1;
  if (income <= 1200000) return 45000 + (income - 900000) * 0.15;
  if (income <= 1500000) return 90000 + (income - 1200000) * 0.2;
  return 150000 + (income - 1500000) * 0.3;
}

export default function TaxPage() {
  const [ts, setTs] = useState<TaxState>({
    income: 2200000,
    elss: 80000,
    ppf: 50000,
    nps: 50000,
    hra: 180000,
    d80: 25000,
  });

  const sec80c = Math.min(150000, ts.elss + ts.ppf);
  const sec80ccd = Math.min(50000, ts.nps);
  const stdDed = 50000;
  const totalDed = sec80c + sec80ccd + ts.hra + ts.d80 + stdDed;
  const taxableOld = Math.max(0, ts.income - totalDed);

  const rawOld = calcOldTax(taxableOld);
  const rawNew = calcNewTax(ts.income);
  const taxOld = Math.round(rawOld * 1.04);
  const taxNew = Math.round(rawNew * 1.04);
  const better = taxOld <= taxNew ? "Old" : "New";
  const saving = Math.abs(taxOld - taxNew);

  const dedData = [
    { name: "Std Deduction", value: stdDed, color: "#5C5850" },
    { name: "80C", value: sec80c, color: "#C9A84C" },
    { name: "NPS", value: sec80ccd, color: "#4A80C4" },
    { name: "HRA", value: ts.hra, color: "#3DAA70" },
    { name: "80D", value: ts.d80, color: "#A07860" },
  ].filter((d) => d.value > 0);

  const more80c = Math.max(0, 150000 - sec80c);
  const moreNPS = Math.max(0, 50000 - ts.nps);
  const more80d = Math.max(0, 25000 - ts.d80);

  const actions = [
    more80c > 0 && { color: "#C9A84C", tag: "ACTION", text: `Invest ${formatINR(more80c)} more in ELSS or PPF to fully use your ₹1.5L 80C limit.` },
    moreNPS > 0 && { color: "#4A80C4", tag: "ACTION", text: `Add ${formatINR(moreNPS)} to NPS for extra deduction under 80CCD(1B).` },
    more80d > 0 && { color: "#3DAA70", tag: "NOTE", text: `Claim ${formatINR(more80d)} more under 80D via family health insurance.` },
    { color: "#5C5850", tag: "INFO", text: "All figures are estimates based on FY 2024-25 slabs. Verify with your CA before filing." },
  ].filter(Boolean) as { color: string; tag: string; text: string }[];

  return (
    <div className="p-8 space-y-5">
      <div className="grid grid-cols-2 gap-5">
        {/* Sliders */}
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
          <Card>
            <CardLabel>FY 2024–25 inputs</CardLabel>
            {SLIDERS.map((s) => (
              <div key={s.key} className="mb-5">
                <div className="flex justify-between mb-1.5">
                  <span className="text-[12px] text-ink-2">{s.label}</span>
                  <span className="text-[12px] font-mono font-medium text-ink">{formatINR(ts[s.key])}</span>
                </div>
                <input
                  type="range"
                  min={s.min}
                  max={s.max}
                  step={s.step}
                  value={ts[s.key]}
                  onChange={(e) => setTs((p) => ({ ...p, [s.key]: +e.target.value }))}
                  className="w-full h-1 bg-surface-4 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gold [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-bg [&::-webkit-slider-thumb]:cursor-pointer"
                />
                {s.note && <div className="text-[10px] font-mono text-ink-3 mt-1">{s.note}</div>}
              </div>
            ))}
          </Card>
        </motion.div>

        {/* Results */}
        <div className="space-y-5">
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06, duration: 0.2 }}>
            <Card>
              <CardLabelRow right={<span className={better === "Old" ? "aq-tag-gold" : "aq-tag-green"}>{better} regime better</span>}>
                Old vs new regime
              </CardLabelRow>
              <TaxBarChart oldTax={taxOld} newTax={taxNew} height={170} />
              <div className="h-px bg-rule my-4" />
              <div className="grid grid-cols-2 gap-3 mb-4">
                {[
                  { regime: "Old Regime", tax: taxOld, effRate: ((taxOld / ts.income) * 100).toFixed(1), isBetter: better === "Old" },
                  { regime: "New Regime", tax: taxNew, effRate: ((taxNew / ts.income) * 100).toFixed(1), isBetter: better === "New" },
                ].map((r) => (
                  <div
                    key={r.regime}
                    className="p-3.5 rounded-xl"
                    style={{
                      background: r.isBetter ? "rgba(61,170,112,0.08)" : "rgba(255,255,255,0.02)",
                      border: `1px solid ${r.isBetter ? "rgba(61,170,112,0.25)" : "#282520"}`,
                    }}
                  >
                    <div className="aq-label mb-1.5">{r.regime}</div>
                    <div className="font-serif text-xl text-ink tracking-tight">{formatINR(r.tax)}</div>
                    <div className="text-[10px] font-mono text-ink-3 mt-1">eff. rate {r.effRate}%</div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-3 rounded-xl bg-gain/8 border border-gain/25 text-[13px] font-medium text-gain">
                {better} Regime saves you {formatINR(saving)} in taxes
              </div>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.2 }}>
            <Card>
              <CardLabel>Deduction mix</CardLabel>
              <DonutChart data={dedData} height={130} innerRadius={38} outerRadius={58} />
              <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3">
                {dedData.map((d) => (
                  <span key={d.name} className="flex items-center gap-1.5 text-[10px] font-mono text-ink-3">
                    <span className="w-2 h-2 rounded-sm inline-block" style={{ background: d.color }} />
                    {d.name}: {formatINR(d.value)}
                  </span>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Actions */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14, duration: 0.2 }}>
        <Card>
          <CardLabel>What to do now</CardLabel>
          <div className="space-y-2.5">
            {actions.map((a, i) => (
              <div
                key={i}
                className="flex gap-2.5 p-3.5 rounded-xl"
                style={{
                  background: `${a.color}10`,
                  border: `1px solid ${a.color}28`,
                }}
              >
                <span className="text-[9px] font-mono font-bold flex-shrink-0 mt-0.5 pt-px" style={{ color: a.color }}>{a.tag}</span>
                <span className="text-[12px] text-ink-2 leading-relaxed">{a.text}</span>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
