import { Outlet, NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CivicUserBadge } from "@/lib/civicAuth";
import {
  LayoutDashboard, Target, CreditCard, TrendingUp, Receipt, Sparkles,
} from "lucide-react";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/goals", label: "Goals", icon: Target },
  { to: "/spending", label: "Spending", icon: CreditCard },
  { to: "/portfolio", label: "Portfolio", icon: TrendingUp },
  { to: "/tax", label: "Tax Planner", icon: Receipt },
  { to: "/advisor", label: "AI Advisor", icon: Sparkles, badge: "AI" },
];

const MARKET = [
  { label: "NIFTY", value: "22,642", change: "+0.43%" },
  { label: "SENSEX", value: "74,719", change: "+0.38%" },
  { label: "GOLD", value: "₹72,480", change: "+1.1%" },
];

export default function AppLayout() {
  const location = useLocation();
  const currentLabel = NAV.find((n) =>
    n.to === "/" ? location.pathname === "/" : location.pathname.startsWith(n.to)
  )?.label ?? "Dashboard";

  return (
    <div className="flex min-h-screen bg-bg">
      {/* ── Sidebar ── */}
      <aside className="w-[220px] bg-surface-1 border-r border-rule flex flex-col fixed top-0 left-0 h-screen z-50">
        {/* Logo */}
        <div className="px-6 py-6 border-b border-rule">
          <div className="font-serif text-xl text-ink tracking-[-0.02em]">ArthaIQ</div>
          <div className="aq-label mt-1">Your money, planned</div>
        </div>

        {/* User */}
        <div className="px-4 py-3 border-b border-rule">
          <CivicUserBadge />
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <div className="aq-label px-3 mb-3">Overview</div>
          {NAV.slice(0, 3).map((item) => (
            <SideNavItem key={item.to} item={item} />
          ))}
          <div className="aq-label px-3 mt-5 mb-3">Wealth</div>
          {NAV.slice(3, 5).map((item) => (
            <SideNavItem key={item.to} item={item} />
          ))}
          <div className="aq-label px-3 mt-5 mb-3">Intelligence</div>
          {NAV.slice(5).map((item) => (
            <SideNavItem key={item.to} item={item} />
          ))}
        </nav>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-rule">
          <div className="flex items-center gap-2 text-[11px] font-mono text-ink-3">
            <span className="w-1.5 h-1.5 rounded-full bg-gain animate-pulse2 inline-block" />
            Synced just now
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="ml-[220px] flex-1 flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="sticky top-0 z-40 bg-surface-1 border-b border-rule px-8 py-3.5 flex items-center justify-between">
          <div className="text-[11px] font-mono text-ink-2 tracking-[0.1em] uppercase">
            {currentLabel}
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-5">
              {MARKET.map((m) => (
                <div key={m.label} className="flex items-center gap-1.5 text-[11px] font-mono">
                  <span className="text-ink-3">{m.label}</span>
                  <span className="text-ink">{m.value}</span>
                  <span className="text-gain">{m.change}</span>
                </div>
              ))}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

function SideNavItem({ item }: { item: typeof NAV[0] }) {
  const location = useLocation();
  const isActive = item.to === "/"
    ? location.pathname === "/"
    : location.pathname.startsWith(item.to);

  return (
    <NavLink
      to={item.to}
      end={item.to === "/"}
      className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] mb-0.5 transition-all duration-150 ${
        isActive
          ? "bg-surface-2 text-ink border border-rule"
          : "text-ink-2 hover:bg-surface-3 hover:text-ink border border-transparent"
      }`}
    >
      <item.icon size={15} className="flex-shrink-0" />
      <span>{item.label}</span>
      {item.badge && (
        <span className="ml-auto text-[9px] font-mono bg-gold/20 text-gold px-1.5 py-0.5 rounded border border-gold/20">
          {item.badge}
        </span>
      )}
    </NavLink>
  );
}
