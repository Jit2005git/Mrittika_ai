import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  Sparkles,
  X,
  MessageSquare,
  AlertCircle,
  Send,
  RotateCcw,
  Loader2,
} from 'lucide-react';

const INITIAL_GREETING =
  "Hello! I'm Mrittika AI. Ask me about crops, soil, farming, weather, or crop recommendations.";

const SUGGESTIONS = [
  '🌾 Best crops for loamy soil in Kharif season?',
  '🧪 How to test soil pH and manage nutrients?',
  '💧 Irrigation tips during dry spells',
  '🐛 Organic pest management for crops',
];

/**
 * AgriChatbot Component
 * Embeds the official Mrittika AI Assistant connected to the n8n Chat Trigger workflow.
 * Reads the webhook URL from import.meta.env.VITE_N8N_CHAT_URL.
 * Provides a resilient fallback if the URL is not yet configured.
 */
export const AgriChatbot = () => {
  const chatUrl = import.meta.env.VITE_N8N_CHAT_URL;
  const isConfigured = Boolean(chatUrl && chatUrl.trim());

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'initial_greeting',
      sender: 'bot',
      text: INITIAL_GREETING,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Persistent session ID for n8n conversational memory
  const sessionIdRef = useRef('');

  useEffect(() => {
    let storedSession = '';
    try {
      storedSession = sessionStorage.getItem('mrittika_ai_chat_session');
    } catch {
      // sessionStorage unavailable
    }
    if (!storedSession) {
      storedSession = `session_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
      try {
        sessionStorage.setItem('mrittika_ai_chat_session', storedSession);
      } catch {
        // ignore storage errors
      }
    }
    sessionIdRef.current = storedSession;
  }, []);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isLoading]);

  const handleResetChat = () => {
    const newSession = `session_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    sessionIdRef.current = newSession;
    try {
      sessionStorage.setItem('mrittika_ai_chat_session', newSession);
    } catch {
      // ignore
    }

    setMessages([
      {
        id: `greeting_${Date.now()}`,
        sender: 'bot',
        text: INITIAL_GREETING,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setErrorMessage(null);
  };

  const handleSendMessage = async (textToSend) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isLoading || !isConfigured) return;

    setInputValue('');
    setErrorMessage(null);

    const userMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch(chatUrl.trim(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'sendMessage',
          chatInput: text,
          sessionId: sessionIdRef.current,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }

      const data = await response.json().catch(() => null);
      let replyText = '';

      if (data) {
        replyText =
          data.ai_response ||
          data.output ||
          data.text ||
          data.message ||
          data.response ||
          (typeof data === 'string' ? data : JSON.stringify(data));
      }

      if (!replyText) {
        replyText = "I couldn't retrieve an agricultural response. Please try again.";
      }

      const botMessage = {
        id: `bot_${Date.now()}`,
        sender: 'bot',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error('[Mrittika AI Chat] Error:', err);
      setErrorMessage('Unable to connect to Mrittika AI Assistant. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderFormattedText = (content) => {
    if (!content) return null;
    const lines = content.split('\n');

    return (
      <div className="space-y-1.5 text-xs sm:text-sm leading-relaxed">
        {lines.map((line, idx) => {
          const trimmed = line.trim();
          if (!trimmed) {
            return <div key={idx} className="h-1" />;
          }

          // Parse markdown-style bold (**text**)
          const parseBold = (str) => {
            const parts = str.split(/(\*\*.*?\*\*)/g);
            return parts.map((part, pIdx) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                return (
                  <strong key={pIdx} className="font-semibold text-slate-900">
                    {part.slice(2, -2)}
                  </strong>
                );
              }
              return part;
            });
          };

          // Unordered list (* item or - item)
          if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
            return (
              <div key={idx} className="flex items-start gap-1.5 pl-1 text-slate-700">
                <span className="text-emerald-600 font-bold mt-0.5">•</span>
                <span className="flex-1">{parseBold(trimmed.slice(2))}</span>
              </div>
            );
          }

          // Numbered list (1. item)
          const numMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
          if (numMatch) {
            return (
              <div key={idx} className="flex items-start gap-1.5 pl-1 text-slate-700">
                <span className="text-emerald-700 font-semibold shrink-0">{numMatch[1]}.</span>
                <span className="flex-1">{parseBold(numMatch[2])}</span>
              </div>
            );
          }

          return (
            <p key={idx} className="text-slate-700">
              {parseBold(line)}
            </p>
          );
        })}
      </div>
    );
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 select-none">
      {/* Fallback Standby Dialog (when URL is not configured) */}
      {!isConfigured && isOpen && (
        <div className="mb-3 w-80 sm:w-96 rounded-2xl bg-white shadow-2xl border border-emerald-200 overflow-hidden animate-fadeIn">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-700 via-emerald-800 to-teal-900 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/30 flex items-center justify-center ring-2 ring-white/20">
                <Bot className="w-5 h-5 text-emerald-200" />
              </div>
              <div>
                <h4 className="text-sm font-bold leading-tight">Mrittika AI Assistant</h4>
                <p className="text-3xs text-emerald-200">Powered by n8n Workflow</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-emerald-100 hover:bg-white/10 transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 space-y-3 text-xs text-slate-600 bg-slate-50/50">
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900">
              <p className="font-semibold text-xs flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Agricultural Assistant Greeting</span>
              </p>
              <p className="text-xs mt-1.5 text-slate-700 leading-relaxed italic">
                "{INITIAL_GREETING}"
              </p>
            </div>

            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-2 text-2xs">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-semibold">n8n Chat URL Standby</strong>
                <span>
                  Configure <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">VITE_N8N_CHAT_URL</code> in your{' '}
                  <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">.env</code> to connect the live n8n Chat Trigger workflow.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Live Mrittika AI Assistant Chat Panel (when URL is configured) */}
      {isConfigured && isOpen && (
        <div className="mb-3 w-[calc(100vw-2.5rem)] sm:w-[420px] max-w-[440px] rounded-2xl bg-white shadow-2xl border border-emerald-200/90 overflow-hidden flex flex-col h-[520px] max-h-[82vh] animate-fadeIn transition-all">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-700 via-emerald-800 to-teal-900 text-white p-3.5 sm:p-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/30 flex items-center justify-center ring-2 ring-white/20">
                <Bot className="w-5 h-5 text-emerald-100" />
              </div>
              <div>
                <h4 className="text-sm font-bold leading-tight">Mrittika AI Assistant</h4>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <p className="text-3xs text-emerald-200 font-medium">Online • Precision Agriculture</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleResetChat}
                className="p-1.5 rounded-lg text-emerald-100 hover:bg-white/10 transition-colors"
                title="Start new conversation"
                aria-label="Start new conversation"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-emerald-100 hover:bg-white/10 transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Thread */}
          <div className="flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-3.5 bg-slate-50/70">
            {messages.map((msg) => {
              const isBot = msg.sender === 'bot';
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2 ${isBot ? 'justify-start' : 'justify-end'}`}
                >
                  {isBot && (
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 border border-emerald-200 flex items-center justify-center shrink-0 mt-0.5">
                      <Bot className="w-4 h-4 text-emerald-700" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-2xl p-3 shadow-sm ${
                      isBot
                        ? 'bg-white border border-emerald-100/80 rounded-tl-sm text-slate-800'
                        : 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-tr-sm'
                    }`}
                  >
                    {isBot ? (
                      renderFormattedText(msg.text)
                    ) : (
                      <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                    )}
                    <span
                      className={`block text-3xs mt-1.5 ${
                        isBot ? 'text-slate-400' : 'text-emerald-100'
                      }`}
                    >
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Suggestions Chips (shown when conversation is new) */}
            {messages.length <= 1 && (
              <div className="pt-2 space-y-1.5">
                <p className="text-3xs font-semibold uppercase tracking-wider text-slate-500 pl-1">
                  Suggested Questions
                </p>
                <div className="grid grid-cols-1 gap-1.5">
                  {SUGGESTIONS.map((suggestion, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleSendMessage(suggestion)}
                      className="text-left text-xs px-3 py-2 rounded-xl bg-white border border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50/50 text-slate-700 transition-colors shadow-2xs flex items-center gap-1.5 group"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0 group-hover:scale-110 transition-transform" />
                      <span className="truncate">{suggestion}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex items-start gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 border border-emerald-200 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-4 h-4 text-emerald-700" />
                </div>
                <div className="bg-white border border-emerald-100 rounded-2xl rounded-tl-sm p-3 shadow-sm text-xs text-slate-600 flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 text-emerald-600 animate-spin shrink-0" />
                  <span>Mrittika AI is analyzing...</span>
                </div>
              </div>
            )}

            {/* Error Message */}
            {errorMessage && (
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p>{errorMessage}</p>
                  <button
                    type="button"
                    onClick={() => handleSendMessage(messages[messages.length - 1]?.text)}
                    className="mt-1 text-2xs font-semibold text-rose-700 hover:underline"
                  >
                    Retry last query
                  </button>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-2.5 sm:p-3 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about crops, soil, farming, weather..."
              disabled={isLoading}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="w-9 h-9 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white flex items-center justify-center hover:from-emerald-700 hover:to-teal-800 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm transition-all shrink-0 active:scale-95"
              title="Send message"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-600 via-emerald-700 to-teal-700 text-white shadow-xl shadow-emerald-950/20 flex items-center justify-center hover:scale-105 active:scale-95 transition-all ring-4 ring-emerald-400/20 group"
        title="Mrittika AI Farming Assistant"
        aria-label="Open Mrittika AI Farming Assistant"
      >
        <span className="relative flex items-center justify-center">
          {isOpen ? (
            <X className="w-6 h-6 text-white group-hover:rotate-90 transition-transform" />
          ) : (
            <>
              <Bot className="w-7 h-7 text-white group-hover:rotate-6 transition-transform" />
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 ring-2 ring-white animate-pulse" />
            </>
          )}
        </span>
      </button>
    </div>
  );
};

export default AgriChatbot;
