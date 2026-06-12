/**
 * dummyAuth.tsx — Simple dummy auth for ArthaIQ (no external service needed)
 * Drop-in replacement for civicAuth.tsx — same exports, same API.
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { motion, AnimatePresence } from "framer-motion";

const SESSION_KEY = "arthaiq_user_session";

// ── Types ────────────────────────────────────────────────────────────────────
export interface CivicUser {
  id: string;
  email?: string;
  name?: string;
  picture?: string;
  claims: Record<string, unknown>;
}

interface CivicAuthCtx {
  user: CivicUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: () => Promise<void>;
  logout: () => void;
}

const saveSession = (u: CivicUser) =>
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(u));
const loadSession = (): CivicUser | null => {
  try {
    return JSON.parse(sessionStorage.getItem(SESSION_KEY) ?? "null");
  } catch {
    return null;
  }
};
const clearSession = () => sessionStorage.removeItem(SESSION_KEY);

// ── Context ──────────────────────────────────────────────────────────────────
const Ctx = createContext<CivicAuthCtx | null>(null);

export function useCivicAuth(): CivicAuthCtx {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCivicAuth must be inside <CivicAuthProvider>");
  return c;
}

// ── Provider ─────────────────────────────────────────────────────────────────
export function CivicAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<CivicUser | null>(() => loadSession());
  const [isLoading] = useState(false);

  const login = useCallback(async () => {
    // login is triggered by the gate form; this is a no-op here
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
  }, []);

  const loginWithCredentials = useCallback((email: string, name: string) => {
    const u: CivicUser = {
      id: Math.random().toString(36).slice(2),
      email,
      name: name || email.split("@")[0],
      claims: {},
    };
    saveSession(u);
    setUser(u);
  }, []);

  return (
    <Ctx.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        // @ts-ignore — internal extra for the gate
        loginWithCredentials,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

// ── Auth Gate ─────────────────────────────────────────────────────────────────
export function CivicAuthGate({ children }: { children: React.ReactNode }) {
  const ctx = useCivicAuth();
  const { isAuthenticated } = ctx;
  // @ts-ignore
  const loginWithCredentials = ctx.loginWithCredentials as (email: string, name: string) => void;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isSignup, setIsSignup] = useState(false);

  useEffect(() => { setError(""); }, [isSignup]);

  if (isAuthenticated) return <>{children}</>;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError("Please fill in all fields."); return; }
    if (password.length < 4) { setError("Password must be at least 4 characters."); return; }
    loginWithCredentials(email, name);
  };

  return (
    <AnimatePresence>
      <motion.div
        key="gate"
        className="min-h-screen flex flex-col items-center justify-center bg-bg overflow-hidden relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Subtle radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 55% 35% at 50% 50%, rgba(201,168,76,0.06) 0%, transparent 70%)",
          }}
        />

        <div className="relative z-10 flex flex-col items-center gap-8 px-6 text-center w-full max-w-sm">
          {/* Logo */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 180 }}
          >
            <div className="w-16 h-16 rounded-2xl bg-surface-2 border border-rule flex items-center justify-center mb-4 mx-auto">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path
                  d="M16 3L4 8v8c0 6 4.5 11.5 12 13 7.5-1.5 12-7 12-13V8L16 3z"
                  fill="#C9A84C"
                  fillOpacity="0.15"
                  stroke="#C9A84C"
                  strokeWidth="1.5"
                />
                <path
                  d="M11 16l3.5 3.5L22 12"
                  stroke="#C9A84C"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="font-serif text-4xl text-ink tracking-[-0.02em]">ArthaIQ</div>
            <div className="text-[11px] font-mono text-ink-3 tracking-[0.15em] uppercase mt-1.5">
              Your Money, Planned
            </div>
          </motion.div>

          {/* Card */}
          <motion.div
            className="w-full bg-surface-1 border border-rule rounded-2xl p-8"
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.12 }}
          >
            <h2 className="text-base font-medium text-ink mb-1">
              {isSignup ? "Create account" : "Welcome back"}
            </h2>
            <p className="text-[12px] text-ink-2 mb-6">
              {isSignup
                ? "Sign up to access your dashboard"
                : "Sign in to access your dashboard"}
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              {isSignup && (
                <div className="flex flex-col gap-1 text-left">
                  <label className="text-[11px] font-mono text-ink-3 uppercase tracking-wider">
                    Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Rahul Sharma"
                    className="w-full px-3 py-2.5 rounded-xl bg-surface-2 border border-rule text-ink text-[13px] placeholder:text-ink-3 focus:outline-none focus:border-gold/50 transition-colors"
                  />
                </div>
              )}

              <div className="flex flex-col gap-1 text-left">
                <label className="text-[11px] font-mono text-ink-3 uppercase tracking-wider">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-3 py-2.5 rounded-xl bg-surface-2 border border-rule text-ink text-[13px] placeholder:text-ink-3 focus:outline-none focus:border-gold/50 transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1 text-left">
                <label className="text-[11px] font-mono text-ink-3 uppercase tracking-wider">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2.5 rounded-xl bg-surface-2 border border-rule text-ink text-[13px] placeholder:text-ink-3 focus:outline-none focus:border-gold/50 transition-colors"
                />
              </div>

              {error && (
                <p className="text-[12px] text-loss text-left">{error}</p>
              )}

              <motion.button
                type="submit"
                className="w-full py-3 px-6 rounded-xl font-medium text-[13px] text-bg bg-gold hover:bg-gold/90 transition-colors mt-1"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                {isSignup ? "Create Account" : "Sign In"}
              </motion.button>
            </form>

            <p className="text-[12px] text-ink-3 text-center mt-4">
              {isSignup ? "Already have an account? " : "Don't have an account? "}
              <button
                onClick={() => setIsSignup((p) => !p)}
                className="text-gold hover:text-gold/80 transition-colors"
              >
                {isSignup ? "Sign in" : "Sign up"}
              </button>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// ── User Badge ────────────────────────────────────────────────────────────────
export function CivicUserBadge() {
  const { user, isAuthenticated, logout } = useCivicAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  if (!isAuthenticated) return null;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-surface-3 transition-colors w-full"
      >
        <div className="w-7 h-7 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center text-gold text-[11px] font-mono font-medium">
          {(user?.name?.[0] ?? user?.email?.[0] ?? "U").toUpperCase()}
        </div>
        <span className="text-[12px] text-ink-2 max-w-[90px] truncate">
          {user?.name ?? user?.email ?? "User"}
        </span>
        <svg
          width="10"
          height="10"
          viewBox="0 0 12 12"
          fill="none"
          className="text-ink-3 ml-auto"
        >
          <path
            d="M2 4l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute left-0 right-0 mt-1 bg-surface-2 border border-rule rounded-xl overflow-hidden z-50"
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            transition={{ duration: 0.12 }}
          >
            <div className="px-4 py-3 border-b border-rule">
              <p className="text-[10px] text-ink-3">Signed in as</p>
              <p className="text-[12px] text-ink font-medium truncate mt-0.5">
                {user?.email ?? "User"}
              </p>
            </div>
            <button
              onClick={() => { logout(); setOpen(false); }}
              className="w-full text-left px-4 py-2.5 text-[12px] text-loss hover:bg-loss/10 transition-colors"
            >
              Sign out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}