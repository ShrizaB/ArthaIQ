import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  TooltipProps,
} from "recharts";
import { formatINR } from "@/lib/utils";

// Shared tooltip style
const TIP_STYLE = {
  backgroundColor: "#1A1A1A",
  border: "1px solid #282520",
  borderRadius: 8,
  fontSize: 11,
  fontFamily: "'DM Mono', monospace",
  color: "#F5F0E8",
};

function CustomTooltip({ active, payload, label, formatter }: TooltipProps<number, string> & { formatter?: (v: number, n: string) => string }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={TIP_STYLE} className="px-3 py-2">
      <div className="text-ink-3 mb-1">{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color ?? "#F5F0E8" }}>
          {formatter
            ? formatter(p.value as number, p.name as string)
            : `${p.name}: ${formatINR(p.value as number)}`}
        </div>
      ))}
    </div>
  );
}

// ── Net Worth Area Chart ──────────────────────────────────────────────────────
interface NWChartProps {
  data: { month: string; value: number }[];
  height?: number;
}
export function NetWorthChart({ data, height = 120 }: NWChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="nwGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3DAA70" stopOpacity={0.15} />
            <stop offset="100%" stopColor="#3DAA70" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="2 4" stroke="#282520" vertical={false} />
        <XAxis dataKey="month" tick={{ fill: "#5C5850", fontSize: 10, fontFamily: "DM Mono" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: "#5C5850", fontSize: 9, fontFamily: "DM Mono" }} axisLine={false} tickLine={false} tickFormatter={(v) => formatINR(v)} width={60} />
        <Tooltip content={<CustomTooltip formatter={(v) => formatINR(v, false)} />} />
        <Area type="monotone" dataKey="value" name="Net Worth" stroke="#3DAA70" strokeWidth={1.5} fill="url(#nwGrad)" dot={false} activeDot={{ r: 3, fill: "#3DAA70" }} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// ── Cash Flow Bar Chart ───────────────────────────────────────────────────────
interface CFChartProps {
  data: { month: string; income: number; expense: number }[];
  height?: number;
}
export function CashFlowChart({ data, height = 160 }: CFChartProps) {
  const enriched = data.map((d) => ({ ...d, saved: d.income - d.expense }));
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={enriched} margin={{ top: 4, right: 4, left: 0, bottom: 0 }} barGap={2}>
        <CartesianGrid strokeDasharray="2 4" stroke="#282520" vertical={false} />
        <XAxis dataKey="month" tick={{ fill: "#5C5850", fontSize: 10, fontFamily: "DM Mono" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: "#5C5850", fontSize: 9, fontFamily: "DM Mono" }} axisLine={false} tickLine={false} tickFormatter={(v) => formatINR(v)} width={56} />
        <Tooltip content={<CustomTooltip formatter={(v, n) => `${n}: ${formatINR(v)}`} />} />
        <Bar dataKey="income" name="Income" fill="#3DAA70" radius={[3, 3, 0, 0]} maxBarSize={12} />
        <Bar dataKey="expense" name="Expenses" fill="#3A3530" radius={[3, 3, 0, 0]} maxBarSize={12} />
        <Bar dataKey="saved" name="Saved" fill="#C9A84C" radius={[3, 3, 0, 0]} maxBarSize={12} />
      </BarChart>
    </ResponsiveContainer>
  );
}

// ── Spending Trend Line ───────────────────────────────────────────────────────
interface TrendChartProps {
  data: { month: string; income: number; expense: number }[];
  height?: number;
}
export function TrendChart({ data, height = 150 }: TrendChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="2 4" stroke="#282520" vertical={false} />
        <XAxis dataKey="month" tick={{ fill: "#5C5850", fontSize: 10, fontFamily: "DM Mono" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: "#5C5850", fontSize: 9, fontFamily: "DM Mono" }} axisLine={false} tickLine={false} tickFormatter={(v) => formatINR(v)} width={56} />
        <Tooltip content={<CustomTooltip formatter={(v, n) => `${n}: ${formatINR(v)}`} />} />
        <Line type="monotone" dataKey="income" name="Income" stroke="#3DAA70" strokeWidth={1.5} dot={{ r: 3, fill: "#3DAA70" }} strokeDasharray="5 3" />
        <Line type="monotone" dataKey="expense" name="Expenses" stroke="#C05050" strokeWidth={1.5} dot={{ r: 3, fill: "#C05050" }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

// ── Allocation Donut ──────────────────────────────────────────────────────────
interface DonutProps {
  data: { name: string; value: number; color: string }[];
  height?: number;
  innerRadius?: number;
  outerRadius?: number;
}
export function DonutChart({ data, height = 180, innerRadius = 52, outerRadius = 75 }: DonutProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie data={data} cx="50%" cy="50%" innerRadius={innerRadius} outerRadius={outerRadius} dataKey="value" stroke="none">
          {data.map((d, i) => <Cell key={i} fill={d.color} />)}
        </Pie>
        <Tooltip
          contentStyle={TIP_STYLE}
          formatter={(v: number, n: string) => [`${v}${typeof data[0]?.value === 'number' && data[0]?.value <= 100 ? '%' : ''}`, n]}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

// ── Tax Regime Bar ────────────────────────────────────────────────────────────
interface TaxBarProps {
  oldTax: number;
  newTax: number;
  height?: number;
}
export function TaxBarChart({ oldTax, newTax, height = 170 }: TaxBarProps) {
  const data = [{ name: "Old Regime", value: oldTax }, { name: "New Regime", value: newTax }];
  const better = oldTax <= newTax ? 0 : 1;
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="2 4" stroke="#282520" vertical={false} />
        <XAxis dataKey="name" tick={{ fill: "#5C5850", fontSize: 10, fontFamily: "DM Mono" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: "#5C5850", fontSize: 9, fontFamily: "DM Mono" }} axisLine={false} tickLine={false} tickFormatter={(v) => formatINR(v)} width={60} />
        <Tooltip content={<CustomTooltip formatter={(v) => `Tax: ${formatINR(v, false)}`} />} />
        <Bar dataKey="value" radius={[5, 5, 0, 0]} maxBarSize={60}>
          {data.map((_, i) => (
            <Cell key={i} fill={i === better ? "#3DAA70" : "#3A3530"} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

// ── Health Radar ──────────────────────────────────────────────────────────────
interface RadarProps {
  data: { label: string; value: number }[];
  height?: number;
}
export function HealthRadar({ data, height = 200 }: RadarProps) {
  const formatted = data.map((d) => ({ subject: d.label, value: d.value }));
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RadarChart data={formatted}>
        <PolarGrid stroke="#282520" />
        <PolarAngleAxis dataKey="subject" tick={{ fill: "#5C5850", fontSize: 10, fontFamily: "DM Mono" }} />
        <Radar name="Score" dataKey="value" stroke="#C9A84C" fill="#C9A84C" fillOpacity={0.1} strokeWidth={1.5} dot={{ r: 3, fill: "#C9A84C" }} />
        <Tooltip contentStyle={TIP_STYLE} formatter={(v: number) => [`${v}/100`, "Score"]} />
      </RadarChart>
    </ResponsiveContainer>
  );
}

// ── XIRR Horizontal Bar ───────────────────────────────────────────────────────
interface XIRRProps {
  data: { name: string; xirr: number; color: string }[];
  height?: number;
}
export function XIRRBar({ data, height = 260 }: XIRRProps) {
  const sorted = [...data].sort((a, b) => b.xirr - a.xirr);
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={sorted} layout="vertical" margin={{ top: 4, right: 12, left: 4, bottom: 0 }}>
        <CartesianGrid strokeDasharray="2 4" stroke="#282520" horizontal={false} />
        <XAxis type="number" tick={{ fill: "#5C5850", fontSize: 9, fontFamily: "DM Mono" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
        <YAxis type="category" dataKey="name" tick={{ fill: "#5C5850", fontSize: 10, fontFamily: "DM Mono" }} axisLine={false} tickLine={false} width={90} />
        <Tooltip contentStyle={TIP_STYLE} formatter={(v: number) => [`${v.toFixed(2)}%`, "XIRR"]} />
        <Bar dataKey="xirr" radius={[0, 3, 3, 0]} maxBarSize={16}>
          {sorted.map((d, i) => <Cell key={i} fill={d.color} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
