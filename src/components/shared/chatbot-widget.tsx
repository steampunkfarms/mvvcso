'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { X, Send } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function ChatbotWidget() {
  const t = useTranslations('chatbot');
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: 'assistant', content: data.message || data.error || 'No response' }]);
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Sorry, something went wrong.' }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full shadow-lg hover:scale-105 transition-transform flex items-center justify-center overflow-hidden"
          aria-label={t('title')}
        >
          <Image src="/images/ranchita/yeti-closeup.jpg" alt="Rancheti Yeti" width={56} height={56} className="rounded-full" />
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-6 right-6 z-40 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-sandy-gold flex flex-col max-h-[70vh]">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-sandy-gold bg-cream-light rounded-t-xl">
            <h3 className="font-semibold text-sm text-(--text-primary)">{t('title')}</h3>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="p-1 text-(--text-muted) hover:text-(--text-primary) transition-colors"
              aria-label="Close chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[200px]">
            {messages.length === 0 && (
              <p className="text-sm text-(--text-muted) text-center py-4">
                {t('coming_soon')}
              </p>
            )}
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`text-sm rounded-lg px-3 py-2 max-w-[85%] ${
                  msg.role === 'user'
                    ? 'bg-terra-cotta text-white ml-auto'
                    : 'bg-cream-light text-(--text-primary)'
                }`}
              >
                {msg.content}
              </div>
            ))}
            {loading && (
              <div className="bg-cream-light text-(--text-muted) text-sm rounded-lg px-3 py-2 max-w-[85%]">
                ...
              </div>
            )}
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="flex gap-2 p-3 border-t border-sandy-gold">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t('placeholder')}
              className="flex-1 px-3 py-2 rounded-lg border border-sandy-gold bg-cream-light text-sm text-(--text-primary) placeholder:text-(--text-muted) focus:outline-none focus:border-terra-cotta"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2 rounded-lg bg-terra-cotta text-white hover:bg-terra-cotta-hover transition-colors disabled:opacity-40"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
