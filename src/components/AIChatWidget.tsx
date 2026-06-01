/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState, useRef, useEffect } from "react";
import { 
  Sparkles, 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User, 
  HelpCircle, 
  RotateCw, 
  ArrowRight,
  BookOpen
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { sendChatMessage, ChatMessage } from "../utils/api";

const SUGGESTIONS = [
  "Qual o melhor isolamento acústico/térmico?",
  "Como regularizar o container na prefeitura?",
  "Qual tipo de fundação/base devo preparar?",
  "Quais os prazos de fabricação e modelos?"
];

const INITIAL_GREETING: ChatMessage = {
  role: "assistant",
  text: "Olá! Sou o Assistente Técnico Inteligente da Delivery Container. 🤖⚙️\n\nEstou aqui para tirar todas as suas dúvidas técnicas sobre a fabricação dos nossos containers navais (aço Corten AA), memorial de acabamento, isolamento térmoacústico, tipos de fundação ou questões legais de prefeitura.\n\nComo posso apoiar o seu projeto hoje?"
};

const AIChatWidget = React.memo(function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_GREETING]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll logic
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 80);
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    setErrorText(null);
    const userMessage: ChatMessage = { role: "user", text: textToSend };
    const updatedMessages = [...messages, userMessage];
    
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      // Map to API call standard
      const assistantReply = await sendChatMessage(updatedMessages);
      setMessages(prev => [...prev, { role: "assistant", text: assistantReply }]);
    } catch (err: any) {
      console.error(err);
      setErrorText("Ops! Ocorreu um problema ao conectar com o servidor. Verifique sua chave de API.");
      setMessages(prev => [
        ...prev, 
        { 
          role: "assistant", 
          text: "Desculpe, tive um erro de conexão temporário ao tentar gerar sua resposta. Por favor, tente enviar novamente." 
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([INITIAL_GREETING]);
    setErrorText(null);
  };

  // Safe formatting parsing
  const renderFormattedText = (text: string) => {
    const paragraphs = text.split("\n");
    return paragraphs.map((paragraph, pIdx) => {
      if (!paragraph.trim()) return <div key={pIdx} className="h-2" />;

      // Bullet points detect
      const isBullet = paragraph.trim().startsWith("- ") || paragraph.trim().startsWith("* ");
      let cleanText = paragraph.trim();
      if (isBullet) {
        cleanText = cleanText.substring(2);
      }

      // Safe bold parsing
      const parts = cleanText.split(/\*\*([^*]+)\*\*/g);
      const content = parts.map((part, index) => {
        if (index % 2 === 1) {
          return <strong key={index} className="font-extrabold text-gray-900 dark:text-white">{part}</strong>;
        }
        return part;
      });

      if (isBullet) {
        return (
          <li key={pIdx} className="ml-4 list-disc text-xs sm:text-sm text-gray-700 dark:text-neutral-300 leading-relaxed mb-1 last:mb-0">
            {content}
          </li>
        );
      }

      // Check for bullet-heading
      const isHeader = paragraph.trim().match(/^[0-9]+\.|^###/);
      if (isHeader) {
        return (
          <h5 key={pIdx} className="font-extrabold text-sm text-gray-900 dark:text-white mt-3.5 mb-1 bg-red-50/50 dark:bg-red-950/10 px-2 py-0.5 rounded border-l-2 border-red-650">
            {content}
          </h5>
        );
      }

      return (
        <p key={pIdx} className="text-xs sm:text-sm text-gray-700 dark:text-neutral-300 leading-relaxed mb-1.5 last:mb-0">
          {content}
        </p>
      );
    });
  };

  return (
    <div className="fixed bottom-[88px] right-6 sm:bottom-6 sm:right-24 z-50 flex flex-col items-end select-text font-sans">
      
      {/* 1. CHAT OVERLAY WINDOW */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="bg-white dark:bg-neutral-900 w-[92vw] sm:w-[410px] h-[550px] max-h-[82vh] rounded-3xl shadow-2xl border border-gray-150 dark:border-neutral-800 flex flex-col overflow-hidden mb-4"
            id="ai-chat-drawer"
          >
            {/* Header: Brand Styling */}
            <div className="bg-red-600 px-5 py-4 flex items-center justify-between text-white shrink-0 shadow-md">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
                  <Bot size={20} className="text-white animate-pulse" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm tracking-tight leading-none">Assistente Técnico IA</h4>
                  <span className="text-[10px] text-red-100 font-bold tracking-widest uppercase mt-1 block">Fábrica de Containers</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-1">
                {messages.length > 1 && (
                  <button 
                    onClick={clearChat}
                    className="p-1.5 rounded-lg hover:bg-white/15 transition-all text-red-100 hover:text-white"
                    title="Reiniciar conversa"
                  >
                    <RotateCw size={14} />
                  </button>
                )}
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-white/15 transition-all text-red-100 hover:text-white cursor-pointer"
                  aria-label="Minimizar chat"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Content list / Balloon chats */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-gray-50/60 dark:bg-neutral-950/40">
              
              {messages.map((m, index) => {
                const isAssistant = m.role === "assistant";
                return (
                  <div 
                    key={index} 
                    className={`flex items-start gap-2.5 ${isAssistant ? "justify-start" : "justify-end"}`}
                  >
                    {isAssistant && (
                      <div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/30 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                        <Bot size={16} />
                      </div>
                    )}
                    
                    <div className="max-w-[82%] flex flex-col">
                      <div className={`p-4 rounded-2xl text-xs sm:text-sm font-medium ${
                        isAssistant 
                          ? "bg-white dark:bg-neutral-855 text-gray-800 dark:text-neutral-200 shadow-sm border border-gray-150/60 dark:border-neutral-800/60 rounded-tl-none" 
                          : "bg-red-600 text-white shadow-md rounded-tr-none font-semibold"
                      }`}>
                        {isAssistant ? (
                          <div className="space-y-1.5 break-words">
                            {renderFormattedText(m.text)}
                          </div>
                        ) : (
                          <p className="break-words leading-relaxed">{m.text}</p>
                        )}
                      </div>
                      
                      <span className={`text-[9px] font-black text-gray-400 uppercase tracking-widest mt-1 px-1 ${
                        isAssistant ? "text-left" : "text-right"
                      }`}>
                        {isAssistant ? "Delivery IA" : "Você"}
                      </span>
                    </div>

                    {!isAssistant && (
                      <div className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                        <User size={15} />
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Gemini thinking loader */}
              {isLoading && (
                <div className="flex items-start gap-2.5 justify-start">
                  <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0 animate-bounce">
                    <Sparkles size={15} />
                  </div>
                  <div className="bg-white dark:bg-neutral-855 border border-gray-150 dark:border-neutral-800 p-4 rounded-2xl rounded-tl-none shadow-sm flex items-center space-x-2.5">
                    <div className="flex space-x-1">
                      <span className="w-2 h-2 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                    <span className="text-[11px] font-bold text-gray-400 dark:text-neutral-500 uppercase tracking-widest animate-pulse">
                      Analisando Engenharia...
                    </span>
                  </div>
                </div>
              )}

              {errorText && (
                <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 text-amber-800 dark:text-amber-400 p-4 rounded-2xl text-xs flex items-center space-x-2">
                  <span className="font-bold flex-1">{errorText}</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestions block for empty conversations */}
            {messages.length === 1 && !isLoading && (
              <div className="px-4 py-3 border-t border-gray-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 shrink-0">
                <p className="text-[10px] font-black uppercase text-gray-400 tracking-wider mb-2 flex items-center gap-1">
                  <BookOpen size={11} className="text-red-600" />
                  <span>Dúvidas técnicas frequentes</span>
                </p>
                <div className="grid grid-cols-1 gap-1.5">
                  {SUGGESTIONS.map((sug, i) => (
                    <button
                      key={i}
                      onClick={() => handleSendMessage(sug)}
                      className="text-left text-xs bg-gray-50 hover:bg-gray-100 dark:bg-neutral-850 dark:hover:bg-neutral-800/80 p-2.5 rounded-xl text-gray-600 dark:text-neutral-300 font-medium transition-all flex items-center justify-between group border border-gray-100 dark:border-neutral-800/40 cursor-pointer"
                    >
                      <span className="truncate mr-4">{sug}</span>
                      <ArrowRight size={12} className="text-gray-400 group-hover:text-red-500 group-hover:translate-x-0.5 transition-all shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Message input line */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(input);
              }}
              className="p-3 bg-white dark:bg-neutral-900 border-t border-gray-150 dark:border-neutral-800 flex items-center space-x-2 shrink-0 px-4"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Perguntar sobre solda, paredes, teto..."
                className="flex-1 bg-gray-50 dark:bg-neutral-850 border border-gray-150 dark:border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-neutral-500 focus:outline-none focus:border-red-600 transition-all font-medium"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className={`p-2.5 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                  input.trim() && !isLoading
                    ? "bg-red-600 text-white shadow-md hover:bg-red-700 active:scale-95"
                    : "bg-gray-100 dark:bg-neutral-800 text-gray-400 dark:text-neutral-600 cursor-not-allowed"
                }`}
                title="Enviar pergunta"
              >
                <Send size={15} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. CHAT TRIGGER LAUNCHER */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-center text-white rounded-full shadow-2xl transform active:scale-95 transition-all duration-300 group cursor-pointer ${
          isOpen 
            ? "bg-zinc-800 hover:bg-zinc-900 w-12 h-12" 
            : "bg-red-600 hover:bg-red-700 w-14 h-14 animate-pulse"
        }`}
        aria-label="Dúvidas frequentes de engenharia?"
        id="floating-ai-chat-btn"
      >
        {isOpen ? (
          <X size={20} className="transition-transform duration-300 rotate-90" />
        ) : (
          <div className="relative">
            <Bot size={24} className="group-hover:scale-105 transition-all duration-300 fill-white/10" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-100 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
            </span>
          </div>
        )}

        {/* Tooltip label (sliding right to left) */}
        {!isOpen && (
          <span className="absolute right-16 scale-0 group-hover:scale-100 transition-all duration-200 origin-right bg-zinc-950 text-white text-[11px] font-black tracking-wider uppercase px-3 py-1.5 rounded-xl whitespace-nowrap shadow-lg pointer-events-none border border-zinc-805">
            Dúvidas Técnicas? Fale Conosco IA
          </span>
        )}
      </button>

    </div>
  );
});

export default AIChatWidget;
