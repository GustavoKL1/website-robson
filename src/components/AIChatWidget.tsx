import React, { useState, useRef, useEffect } from "react";
import { Sparkles, X, Send, Bot, User, ArrowRight, BookOpen, RotateCw } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { sendChatMessage, ChatMessage } from "../utils/api";

const colors = {
  bg: "#1c1c1e",
  surface: "#26262a",
  border: "#3a3a40",
  accent: "#6b8f7a",
  text: "#e4e4e6",
  muted: "#8a8a94",
} as const;

const SUGGESTIONS = [
  "Qual o melhor isolamento acústico/térmico?",
  "Como regularizar o container na prefeitura?",
  "Qual tipo de fundação/base devo preparar?",
  "Quais os prazos de fabricação e modelos?"
];

const INITIAL_GREETING: ChatMessage = {
  role: "assistant",
  text: "Olá! Sou o Assistente Técnico da Delivery Container.\n\nEstou aqui para tirar todas as suas dúvidas técnicas sobre fabricação, isolamento, fundação e regularização.\n\nComo posso ajudar?"
};

const AIChatWidget = React.memo(function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_GREETING]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 80);
    }
  }, [messages, isOpen]);

  const handleSend = async (text: string) => {
    if (!text.trim() || isLoading) return;
    const userMsg: ChatMessage = { role: "user", text };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput("");
    setIsLoading(true);
    try {
      const reply = await sendChatMessage(updated);
      setMessages(prev => [...prev, { role: "assistant", text: reply }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", text: "Desculpe, ocorreu um erro de conexão. Tente novamente." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-[88px] right-6 sm:bottom-6 sm:right-24 z-50 flex flex-col items-end select-none">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            style={{ backgroundColor: colors.surface, border: `1px solid ${colors.border}`, borderRadius: "10px", width: "92vw", maxWidth: "410px", height: "550px", maxHeight: "82vh", display: "flex", flexDirection: "column", overflow: "hidden", marginBottom: "10px" }}
          >
            <div style={{ backgroundColor: colors.bg, borderBottom: `1px solid ${colors.border}`, padding: "15px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "32px", height: "32px", backgroundColor: colors.accent, borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Bot size={18} color={colors.text} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: "12px", color: colors.text }}>Assistente Delivery Container</div>
                  <div style={{ fontSize: "10px", color: colors.muted, letterSpacing: "0.05em" }}>CONTAINERS</div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} style={{ background: "none", border: "none", color: colors.muted, cursor: "pointer", padding: "5px" }}>
                <X size={16} />
              </button>
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: "15px", display: "flex", flexDirection: "column", gap: "15px", backgroundColor: colors.bg }}>
              {messages.map((m, i) => (
                <div key={i} style={{ display: "flex", alignItems: "start", gap: "10px", flexDirection: m.role === "assistant" ? "row" : "row-reverse" }}>
                  {m.role === "assistant" && (
                    <div style={{ width: "28px", height: "28px", backgroundColor: colors.accent, borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Bot size={14} color={colors.text} />
                    </div>
                  )}
                  <div style={{ maxWidth: "82%", padding: "10px", borderRadius: "10px", fontSize: "12px", lineHeight: 1.5, backgroundColor: m.role === "assistant" ? colors.surface : colors.accent, color: colors.text }}>
                    {m.text}
                  </div>
                  {m.role !== "assistant" && (
                    <div style={{ width: "28px", height: "28px", backgroundColor: colors.accent, borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <User size={14} color={colors.text} />
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ width: "28px", height: "28px", backgroundColor: colors.accent, borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Sparkles size={14} color={colors.text} />
                  </div>
                  <div style={{ backgroundColor: colors.surface, padding: "10px", borderRadius: "10px", display: "flex", gap: "5px", alignItems: "center" }}>
                    <span style={{ width: "6px", height: "6px", backgroundColor: colors.accent, borderRadius: "50%", animation: "fancybox-fadeIn 0.5s infinite" }} />
                    <span style={{ width: "6px", height: "6px", backgroundColor: colors.accent, borderRadius: "50%", animation: "fancybox-fadeIn 0.5s infinite 0.15s" }} />
                    <span style={{ width: "6px", height: "6px", backgroundColor: colors.accent, borderRadius: "50%", animation: "fancybox-fadeIn 0.5s infinite 0.3s" }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {messages.length === 1 && !isLoading && (
              <div style={{ padding: "10px 15px", borderTop: `1px solid ${colors.border}`, backgroundColor: colors.surface }}>
                <div style={{ fontSize: "10px", fontWeight: 700, color: colors.muted, marginBottom: "5px", letterSpacing: "0.05em", textTransform: "uppercase" }}>Dúvidas frequentes</div>
                {SUGGESTIONS.map((s, i) => (
                  <button key={i} onClick={() => handleSend(s)}
                    style={{ display: "block", width: "100%", textAlign: "left", backgroundColor: colors.bg, border: `1px solid ${colors.border}`, borderRadius: "5px", padding: "8px 10px", fontSize: "11px", color: colors.muted, cursor: "pointer", marginBottom: "5px", transition: "color 0.3s" }}>
                    {s}
                  </button>
                ))}
              </div>
            )}

            <form onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
              style={{ display: "flex", gap: "5px", padding: "10px 15px", borderTop: `1px solid ${colors.border}`, backgroundColor: colors.surface }}>
              <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Digite sua dúvida..."
                style={{ flex: 1, backgroundColor: colors.bg, border: `1px solid ${colors.border}`, borderRadius: "10px", padding: "10px", color: colors.text, fontSize: "12px", outline: "none" }} />
              <button type="submit" disabled={!input.trim() || isLoading}
                style={{ backgroundColor: input.trim() && !isLoading ? colors.accent : colors.muted, color: colors.text, border: "none", borderRadius: "10px", padding: "10px", cursor: input.trim() && !isLoading ? "pointer" : "not-allowed" }}>
                <Send size={14} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <button onClick={() => setIsOpen(!isOpen)}
        style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          width: isOpen ? "48px" : "56px", height: isOpen ? "48px" : "56px",
          backgroundColor: isOpen ? colors.bg : colors.accent,
          border: isOpen ? `1px solid ${colors.border}` : "none",
          borderRadius: "50%", color: colors.text, cursor: "pointer",
          transition: "all 0.3s",
        }}>
        {isOpen ? <X size={20} /> : <Bot size={24} />}
      </button>
    </div>
  );
});

export default AIChatWidget;
