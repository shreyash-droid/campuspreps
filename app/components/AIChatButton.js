"use client";

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';
import FormattedMessage from './FormattedMessage';

export default function AIChatButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: input }]);
    const userInput = input;
    setInput('');
    setIsLoading(true);

    try {
      console.log('Sending message:', userInput);
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ message: userInput }),
      });

      let data;
      try {
        data = await response.json();
        console.log('Received response:', data);
      } catch (parseError) {
        console.error('Failed to parse JSON response:', parseError);
        throw new Error('Failed to parse server response');
      }

      if (!response.ok) {
        const errorMessage = data?.error || data?.details || 'Server error';
        console.error('Server returned error:', {
          status: response.status,
          statusText: response.statusText,
          error: errorMessage
        });
        throw new Error(errorMessage);
      }

      if (!data.success || !data.response) {
        console.error('Invalid response format:', data);
        throw new Error('Invalid response format from server');
      }

      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (error) {
      console.error('Error sending message:', {
        message: error.message,
        name: error.name,
        cause: error.cause
      });
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Error: ${error.message}. Please try again or contact support if the issue persists.`
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="group fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full border border-[var(--line-strong)] bg-[var(--surface)] text-[var(--accent)] shadow-[0_10px_30px_-8px_rgba(0,0,0,0.8)] transition hover:border-[var(--accent)]/60 hover:bg-[var(--surface-2)]"
        aria-label="Open AI Chat"
      >
        <MessageCircle className="h-6 w-6" />
        <span className="absolute right-full mr-3 whitespace-nowrap rounded-full border border-[var(--line)] bg-[#0c0c0e] px-3 py-1 text-sm text-[var(--fg-2)] opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          Study Assistant
        </span>
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 flex max-h-[650px] w-[400px] max-w-[calc(100vw-3rem)] flex-col overflow-hidden rounded-3xl border border-[var(--line)] bg-[#0f0f11] text-[var(--fg)] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)]">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[var(--line)] px-5 py-4">
            <div className="flex items-center gap-2.5">
              <span className="h-2 w-2 rounded-full bg-[var(--accent)] shadow-[0_0_10px_2px_rgba(201,168,106,0.7)]" />
              <h3 className="display text-base">Study Assistant</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-[var(--fg-3)] transition hover:text-[var(--fg)]"
              aria-label="Close chat"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-4 overflow-y-auto bg-[var(--ink)] p-4 min-h-[340px] max-h-[440px]">
            {messages.length === 0 && (
              <div className="py-10 text-center text-[var(--fg-3)]">
                <Sparkles className="mx-auto mb-3 h-8 w-8 text-[var(--accent)]" />
                <p className="text-sm text-[var(--fg-2)]">Ask me anything about your studies.</p>
                <p className="mt-1 text-xs">Questions, explanations and study tips.</p>
              </div>
            )}

            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                    message.role === 'user'
                      ? 'rounded-br-sm bg-[var(--fg)] text-[#0a0a0b]'
                      : 'rounded-bl-sm border border-[var(--line)] bg-[var(--surface)] text-[var(--fg)]'
                  }`}
                >
                  <FormattedMessage content={message.content} isUser={message.role === 'user'} />
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[85%] rounded-2xl rounded-bl-sm border border-[var(--line)] bg-[var(--surface)] px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-[var(--accent)]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-[var(--accent)]" style={{ animationDelay: '150ms' }} />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-[var(--accent)]" style={{ animationDelay: '300ms' }} />
                    <span className="ml-2 text-sm text-[var(--fg-3)]">Thinking…</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSendMessage} className="border-t border-[var(--line)] bg-[#0f0f11] p-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your question…"
                className="flex-1 rounded-xl border border-[var(--line)] bg-white/[0.03] px-4 py-2.5 text-[15px] text-[var(--fg)] outline-none transition placeholder:text-[var(--fg-3)] focus:border-[var(--accent)]/70 focus:bg-white/[0.05]"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="btn-primary focus-ring flex h-11 w-11 shrink-0 items-center justify-center rounded-xl disabled:opacity-50"
                aria-label="Send"
              >
                {isLoading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#0a0a0b] border-t-transparent" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}