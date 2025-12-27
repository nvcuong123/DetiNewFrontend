
import React, { useState, useRef, useEffect } from 'react';
import { getMarketInsight } from '../services/geminiService';
import { ChatMessage } from '../types';
import { Sparkles, Send, X, Bot, RefreshCcw } from 'lucide-react';

interface AIAdvisorProps {
  contextData: string;
}

export const AIAdvisor: React.FC<AIAdvisorProps> = ({ contextData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'model',
      text: 'Hello! I am DETI AI. Ask me about market trends, technical indicators, or tokenomics based on current chart data.',
      timestamp: Date.now()
    }
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const responseText = await getMarketInsight(userMsg.text, contextData);

    const aiMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: responseText,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, aiMsg]);
    setLoading(false);
  };

  return (
    <>
      {/* Floating Toggle - Changed to Brand Gradient */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-40 p-4 rounded-full shadow-[0_0_20px_rgba(245,158,11,0.5)] transition-all hover:scale-105 ${isOpen ? 'bg-deti-surface text-white rotate-45' : 'bg-gradient-brand text-white'}`}
      >
         {isOpen ? <X /> : <Sparkles />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 md:w-96 h-[500px] bg-deti-surface/95 backdrop-blur-xl border border-deti-primary/30 rounded-2xl shadow-2xl z-40 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-300">
          {/* Header */}
          <div className="p-4 border-b border-white/10 bg-gradient-to-r from-deti-primary/10 to-transparent flex items-center gap-2">
            <Bot className="text-deti-primary w-5 h-5" />
            <h3 className="font-bold text-white">DETI AI Advisor</h3>
            <span className="ml-auto text-xs px-2 py-0.5 rounded bg-deti-primary/20 text-deti-primary border border-deti-primary/20">Gemini 2.5</span>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    msg.role === 'user' 
                    ? 'bg-deti-primary text-white rounded-br-none shadow-md' 
                    : 'bg-white/5 text-gray-200 rounded-bl-none border border-white/5'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white/5 rounded-2xl px-4 py-3 rounded-bl-none flex items-center gap-2">
                  <RefreshCcw className="w-4 h-4 animate-spin text-deti-primary" />
                  <span className="text-xs text-gray-400">Analyzing market data...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-white/10 bg-deti-bg/50">
            <div className="relative">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about BTC trend..."
                className="w-full bg-deti-card border border-white/10 rounded-xl pl-4 pr-12 py-3 text-sm text-white focus:border-deti-primary outline-none shadow-inner"
              />
              <button 
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-deti-primary rounded-lg text-white disabled:opacity-50 hover:brightness-110 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
