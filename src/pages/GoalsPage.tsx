import { motion } from "framer-motion";
import { GoalCard } from "@/components/ui/GoalCard";
import { GOALS } from "@/lib/data";
import { formatINR, goalProgress } from "@/lib/utils";

export default function GoalsPage() {
  const totalSaved = GOALS.reduce((s, g) => s + g.current, 0);
  const totalTarget = GOALS.reduce((s, g) => s + g.target, 0);
  const overallPct = Math.round((totalSaved / totalTarget) * 100);

  return (
    <div className="p-8">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="mb-6">
        <div className="font-serif text-[32px] text-ink tracking-[-0.02em] leading-tight">
          Your financial goals
        </div>
        <div className="text-[13px] text-ink-2 mt-2">
          Everything you save and invest maps back to these milestones.
        </div>
      </motion.div>

      {/* Overall progress */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.06, duration: 0.2 }}
        className="bg-surface-1 border border-rule rounded-2xl p-6 mb-6"
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="aq-label mb-1.5">Total corpus built</div>
            <div className="font-serif text-3xl text-ink tracking-tight">{formatINR(totalSaved)}</div>
            <div className="text-[11px] font-mono text-ink-3 mt-1">of {formatINR(totalTarget)} across all goals</div>
          </div>
          <div className="text-right">
            <div className="font-serif text-3xl text-gold tracking-tight">{overallPct}%</div>
            <div className="text-[11px] font-mono text-ink-3 mt-1">overall progress</div>
          </div>
        </div>
        <div className="h-1.5 bg-surface-4 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gold rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${overallPct}%` }}
            transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
          />
        </div>
        <div className="grid grid-cols-4 gap-6 mt-5 pt-5 border-t border-rule">
          {GOALS.map((g) => {
            const p = goalProgress(g.current, g.target);
            return (
              <div key={g.id}>
                <div className="text-[11px] font-medium text-ink-2 mb-1">{g.name}</div>
                <div className="h-0.5 bg-surface-4 rounded-full mb-1.5">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: g.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${p}%` }}
                    transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
                  />
                </div>
                <div className="text-[10px] font-mono" style={{ color: g.color }}>{p}%</div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Goal cards */}
      <div className="grid grid-cols-2 gap-5">
        {GOALS.map((goal, i) => (
          <GoalCard key={goal.id} goal={goal} delay={i * 0.07} />
        ))}
      </div>
    </div>
  );
}
