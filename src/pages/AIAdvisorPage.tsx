import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Sparkles, Send } from "lucide-react";
import { Card, CardLabel } from "@/components/ui/card";
import { HealthRadar } from "@/components/charts/Charts";
import { AI_SYSTEM_PROMPT, QUICK_QUESTIONS } from "@/lib/data";
import { formatINR } from "@/lib/utils";
import type { ChatMessage } from "@/types";

const HEALTH_DATA = [
  { label: "Savings", value: 88 },
  { label: "Investing", value: 82 },
  { label: "Goals", value: 65 },
  { label: "Tax", value: 74 },
  { label: "Spending", value: 70 },
];

const SNAPSHOT = [
  { label: "Net worth", value: "₹27.43L", color: "" },
  { label: "Portfolio XIRR", value: "13.4%", color: "#3DAA70" },
  { label: "Savings rate", value: "45.4%", color: "#3DAA70" },
  { label: "Dining overspend", value: "+₹2,400", color: "#C05050" },
  { label: "80C gap", value: "₹20,000", color: "#C9A84C" },
  { label: "Emergency fund", value: "90% done", color: "#3DAA70" },
];

const INITIAL_MSG: ChatMessage = {
  role: "assistant",
  content:
    "Hey Arjun. I've looked at everything. Net worth is ₹27.43L — up 28% this year, solid work. Portfolio is earning 13.4% XIRR. Emergency fund is almost done, but your home goal at 25% needs a ₹1.14L/month SIP to stay on track. What would you like to dig into?",
};

async function askClaude(messages: ChatMessage[]): Promise<string> {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: AI_SYSTEM_PROMPT,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    }),
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const data = await res.json();
  return (data.content?.[0]?.text as string) ?? "Sorry, I couldn't process that. Please try again.";
}

export default function AIAdvisorPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MSG]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [dots, setDots] = useState(".");
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (!loading) return;
    const t = setInterval(() => setDots((d) => (d.length >= 3 ? "." : d + ".")), 400);
    return () => clearInterval(t);
  }, [loading]);

  const send = useCallback(
    async (text?: string) => {
      const q = (text ?? input).trim();
      if (!q || loading) return;
      setInput("");
      const next: ChatMessage[] = [...messages, { role: "user", content: q }];
      setMessages(next);
      setLoading(true);
      try {
        const reply = await askClaude(next.filter((m) => m.role !== "assistant" || next.indexOf(m) > 0));
        setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
      } catch {
        setMessages((prev) => [...prev, { role: "assistant", content: "Connection error. Please try again." }]);
      } finally {
        setLoading(false);
        setTimeout(() => inputRef.current?.focus(), 50);
      }
    },
    [input, loading, messages]
  );

  return (
    <div className="p-8">
      <div className="grid grid-cols-[1fr_260px] gap-5 items-start">
        {/* Chat panel */}
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
          <Card padding="none" className="overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-rule">
              <div className="w-8 h-8 rounded-xl bg-gold flex items-center justify-center flex-shrink-0">
                <Sparkles size={14} className="text-bg" />
              </div>
              <div>
                <div className="text-[13px] font-medium text-ink">ArthaIQ Advisor</div>
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-gain mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-gain animate-pulse2 inline-block" />
                  Knows your full profile
                </div>
              </div>
            </div>

            {/* Quick pills */}
            <div className="flex flex-wrap gap-2 px-5 py-3 border-b border-rule">
              {QUICK_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => send(q)}
                  disabled={loading}
                  className="px-3 py-1.5 rounded-full border border-rule text-[11px] text-ink-2 hover:bg-surface-3 hover:text-ink hover:border-surface-4 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Messages */}
            <div className="h-[340px] overflow-y-auto px-5 py-4 flex flex-col gap-4">
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.15 }}
                  className={`flex flex-col ${m.role === "assistant" ? "items-start" : "items-end"}`}
                >
                  <div className="text-[10px] font-mono text-ink-3 mb-1.5">
                    {m.role === "assistant" ? "ArthaIQ Advisor" : "You"}
                  </div>
                  <div className={m.role === "assistant" ? "chat-bubble-ai" : "chat-bubble-me"}>
                    {m.content}
                  </div>
                </motion.div>
              ))}
              {loading && (
                <div className="flex flex-col items-start">
                  <div className="text-[10px] font-mono text-ink-3 mb-1.5">ArthaIQ Advisor</div>
                  <div className="chat-bubble-ai text-ink-3">{dots}</div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            {/* Input */}
            <div className="flex gap-2.5 px-5 py-4 border-t border-rule">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
                placeholder="Ask about your finances…"
                disabled={loading}
                className="flex-1 bg-surface-2 border border-rule rounded-xl px-4 py-2.5 text-[13px] text-ink placeholder:text-ink-3 outline-none focus:border-surface-4 transition-colors disabled:opacity-50"
              />
              <button
                onClick={() => send()}
                disabled={loading || !input.trim()}
                className="px-4 py-2.5 bg-gold rounded-xl text-bg text-[12px] font-medium flex items-center gap-1.5 hover:bg-gold-2 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Send size={13} />
                Send
              </button>
            </div>
          </Card>
        </motion.div>

        {/* Side panels */}
        <div className="space-y-4">
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08, duration: 0.2 }}>
            <Card>
              <CardLabel>Your snapshot</CardLabel>
              <div className="space-y-2">
                {SNAPSHOT.map((s) => (
                  <div key={s.label} className="flex items-center justify-between px-3 py-2 bg-surface-2 rounded-xl">
                    <span className="text-[12px] text-ink-2">{s.label}</span>
                    <span
                      className="text-[12px] font-mono font-medium"
                      style={{ color: s.color || "#F5F0E8" }}
                    >
                      {s.value}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12, duration: 0.2 }}>
            <Card>
              <CardLabel>Financial health</CardLabel>
              <HealthRadar data={HEALTH_DATA} height={200} />
              <div className="grid grid-cols-2 gap-2 mt-3">
                {HEALTH_DATA.map((d) => (
                  <div key={d.label} className="flex items-center justify-between px-2.5 py-1.5 bg-surface-2 rounded-lg">
                    <span className="text-[10px] font-mono text-ink-3">{d.label}</span>
                    <span
                      className="text-[11px] font-mono font-medium"
                      style={{ color: d.value >= 80 ? "#3DAA70" : d.value >= 70 ? "#C9A84C" : "#A09A90" }}
                    >
                      {d.value}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
