'use client';
import { useState, useRef, useEffect } from 'react';

type Message = { role: string; content: string };

const SUGGESTIONS = [
  'Explain a concept simply',
  'Write me a short poem',
  'Give me an idea for today',
  'Help me plan my week',
];

function Logo({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="sparkGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#c9c0ec" />
          <stop offset="55%" stopColor="#9f92dc" />
          <stop offset="100%" stopColor="#7d6ec2" />
        </linearGradient>
      </defs>
      <path
        d="M50 5 Q61 40 95 50 Q61 60 50 95 Q39 60 5 50 Q39 40 50 5 Z"
        fill="url(#sparkGrad)"
      />
      <circle cx="50" cy="50" r="6" fill="#f7f5fd" />
      <path
        d="M85 6 Q88 13 96 16 Q88 19 85 26 Q82 19 74 16 Q82 13 85 6 Z"
        fill="#e4dff6"
      />
    </svg>
  );
}

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1 py-1">
      <span className="typing-dot h-2 w-2 rounded-full bg-[var(--dot)]" style={{ animationDelay: '0s' }} />
      <span className="typing-dot h-2 w-2 rounded-full bg-[var(--dot)]" style={{ animationDelay: '0.2s' }} />
      <span className="typing-dot h-2 w-2 rounded-full bg-[var(--dot)]" style={{ animationDelay: '0.4s' }} />
    </span>
  );
}

function SunIcon({ className = '' }: { className?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 2v2.5M12 19.5V22M22 12h-2.5M4.5 12H2M19 5l-1.8 1.8M6.8 17.2 5 19M19 19l-1.8-1.8M6.8 6.8 5 5"
        stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function MoonIcon({ className = '' }: { className?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z"
        stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [dark, setDark] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initialise theme from saved preference or system setting
  useEffect(() => {
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDark(stored ? stored === 'dark' : prefersDark);
  }, []);

  // Apply theme to <html> and persist
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || loading) return;

    const newMessages = [...messages, { role: 'user', content }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ messages: newMessages, sessionId: 'demo-session' }),
      });

      const reader = res.body!.getReader();
      let assistantReply = '';
      setMessages([...newMessages, { role: 'assistant', content: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        assistantReply += new TextDecoder().decode(value);
        setMessages([...newMessages, { role: 'assistant', content: assistantReply }]);
      }
    } catch {
      setMessages([
        ...newMessages,
        { role: 'assistant', content: '⚠️ Something went wrong. Please try again.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const isEmpty = messages.length === 0;
  const showTyping =
    loading && (isEmpty || messages[messages.length - 1]?.content === '');

  return (
    <main className="flex min-h-full items-center justify-center p-4 sm:p-6">
      <div className="flex h-[88vh] w-full max-w-2xl flex-col overflow-hidden rounded-[28px] border border-[var(--border-strong)] bg-[var(--panel)] shadow-[0_24px_60px_-24px_rgba(90,60,170,0.45)] backdrop-blur-2xl">
        {/* Header */}
        <header className="flex items-center gap-3 border-b border-[var(--border-soft)] bg-[var(--header)] px-5 py-4 backdrop-blur-md">
          <Logo className="h-9 w-9 animate-glow" />
          <div className="leading-tight">
            <h1 className="bg-gradient-to-r from-[var(--grad-a)] to-[var(--grad-b)] bg-clip-text text-lg font-bold text-transparent">
              MyAi
            </h1>
            <p className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_6px_1px_rgba(52,211,153,0.7)]" />
              Online &middot; ready to chat
            </p>
          </div>
          {/* Theme toggle */}
          <button
            onClick={() => setDark((d) => !d)}
            aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={dark ? 'Light mode' : 'Dark mode'}
            className="ml-auto flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border-strong)] bg-[var(--surface)] text-[var(--text-muted)] transition hover:-translate-y-0.5 hover:text-[var(--text-strong)] hover:shadow-md active:scale-95"
          >
            {dark ? <SunIcon /> : <MoonIcon />}
          </button>
        </header>

        {/* Messages */}
        <div
          ref={scrollRef}
          className="scroll-soft flex-1 space-y-4 overflow-y-auto px-4 py-6 sm:px-6"
        >
          {isEmpty && !loading && (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <Logo className="h-16 w-16 animate-glow" />
              <h2 className="mt-5 text-xl font-semibold text-[var(--text-title)]">
                How can I help you today?
              </h2>
              <p className="mt-1 max-w-xs text-sm text-[var(--text-muted)]">
                Ask me anything, or start with one of these:
              </p>
              <div className="mt-6 flex max-w-md flex-wrap justify-center gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => sendMessage(s)}
                    className="rounded-full border border-[var(--chip-border)] bg-[var(--chip-bg)] px-4 py-2 text-sm text-[var(--text-chip)] transition hover:-translate-y-0.5 hover:border-[var(--chip-hover-border)] hover:bg-[var(--chip-hover-bg)] hover:shadow-md"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) => {
            const isUser = m.role === 'user';
            if (!isUser && m.content === '') return null;
            const isStreaming =
              !isUser && loading && i === messages.length - 1;
            return (
              <div
                key={i}
                className={`animate-rise flex items-end gap-2.5 ${
                  isUser ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                {/* Avatar */}
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold shadow-sm ${
                    isUser
                      ? 'bg-[var(--accent)] text-white'
                      : 'border border-[var(--border-strong)] bg-[var(--surface)]'
                  }`}
                >
                  {isUser ? 'You' : <Logo className="h-5 w-5" />}
                </div>
                {/* Bubble */}
                <div
                  className={`max-w-[78%] whitespace-pre-wrap break-words px-4 py-2.5 text-[15px] leading-relaxed shadow-sm ${
                    isUser
                      ? 'rounded-3xl rounded-br-md bg-[var(--accent)] text-white'
                      : 'rounded-3xl rounded-bl-md border border-[var(--border-strong)] bg-[var(--surface)] text-[var(--text-strong)]'
                  }`}
                >
                  {m.content}
                  {isStreaming && <span className="typing-caret" />}
                </div>
              </div>
            );
          })}

          {showTyping && (
            <div className="animate-rise flex items-end gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--border-strong)] bg-[var(--surface)] shadow-sm">
                <Logo className="h-5 w-5" />
              </div>
              <div className="rounded-3xl rounded-bl-md border border-[var(--border-strong)] bg-[var(--surface)] px-4 py-2.5">
                <TypingDots />
              </div>
            </div>
          )}
        </div>

        {/* Composer */}
        <div className="border-t border-[var(--border-soft)] bg-[var(--header)] px-4 py-4 backdrop-blur-md sm:px-6">
          <div className="flex items-end gap-2 rounded-2xl border border-[var(--chip-border)] bg-[var(--input-bg)] p-1.5 shadow-sm focus-within:border-[var(--grad-b)] focus-within:ring-2 focus-within:ring-[var(--accent-ring)]">
            <textarea
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Type your message…"
              className="max-h-32 flex-1 resize-none bg-transparent px-3 py-2 text-[15px] text-[var(--text-strong)] placeholder-[var(--text-faint)] focus:outline-none"
            />
            <button
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
              aria-label="Send message"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--accent)] text-white shadow-md transition hover:bg-[var(--accent-hover)] active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {loading ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M4 12L20 4L14 20L11 13L4 12Z"
                    fill="currentColor"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
          </div>
          <p className="mt-2 text-center text-[11px] text-[var(--text-faint)]">
            Press Enter to send &middot; Shift + Enter for a new line
          </p>
        </div>
      </div>
    </main>
  );
}
