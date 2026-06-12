import { motion } from "framer-motion";
import { Goal } from "@/types";
import { formatINR, goalProgress } from "@/lib/utils";
import { Shield, Home, GraduationCap, Sun } from "lucide-react";

const ICONS: Record<string, React.ElementType> = {
  shield: Shield,
  home: Home,
  "graduation-cap": GraduationCap,
  sun: Sun,
};

interface GoalCardProps {
  goal: Goal;
  compact?: boolean;
  onClick?: () => void;
  delay?: number;
}

export function GoalCard({ goal, compact = false, onClick, delay = 0 }: GoalCardProps) {
  const pct = goalProgress(goal.current, goal.target);
  const gap = goal.target - goal.current;
  const Icon = ICONS[goal.icon] ?? Shield;

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.2 }}
        onClick={onClick}
        className="bg-surface-1 border border-rule rounded-2xl p-4 cursor-pointer hover:border-surface-4 transition-colors"
      >
        <div className="flex items-center gap-2 mb-3">
          <Icon size={14} style={{ color: goal.color }} />
          <span className="text-[12px] font-medium text-ink leading-tight">{goal.name}</span>
        </div>
        <div className="aq-bar-bg">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: goal.color }}
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ delay: delay + 0.1, duration: 0.6, ease: "easeOut" }}
          />
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-[11px] font-mono" style={{ color: goal.color }}>{pct}%</span>
          <span className="text-[10px] font-mono text-ink-3">{goal.deadline}</span>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.22 }}
      className="bg-surface-1 border border-rule rounded-2xl p-5"
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${goal.color}18`, border: `1px solid ${goal.color}30` }}
        >
          <Icon size={18} style={{ color: goal.color }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[14px] font-medium text-ink">{goal.name}</div>
          <div className="text-[11px] font-mono mt-0.5" style={{ color: goal.color }}>
            {pct}% · Target by {goal.deadline}
          </div>
        </div>
        <div className="text-right">
          <div className="font-serif text-xl text-ink tracking-tight">{formatINR(goal.current)}</div>
          <div className="text-[10px] font-mono text-ink-3 mt-0.5">of {formatINR(goal.target)}</div>
        </div>
      </div>

      {/* Bar */}
      <div className="aq-bar-bg">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: goal.color }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ delay: delay + 0.1, duration: 0.7, ease: "easeOut" }}
        />
      </div>
      <div className="flex justify-between text-[10px] font-mono mt-1.5">
        <span style={{ color: goal.color }}>{formatINR(goal.current)} saved</span>
        <span className="text-ink-3">Gap: {formatINR(gap)}</span>
      </div>

      {/* Insight */}
      <div
        className="mt-4 px-3.5 py-3 rounded-xl text-[12px] text-ink-2 leading-relaxed"
        style={{ backgroundColor: `${goal.color}0D`, border: `1px solid ${goal.color}25` }}
      >
        <span className="text-ink font-medium">Arjun's take — </span>
        {goal.note}
      </div>

      {/* Tip */}
      <div className="flex items-start gap-2 mt-3 text-[11px] text-ink-3">
        <span className="mt-0.5">💡</span>
        <span>{goal.tip}</span>
      </div>
    </motion.div>
  );
}
