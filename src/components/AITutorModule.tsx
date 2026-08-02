import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  User,
  Sparkles,
  Calculator,
  BookOpen,
  CheckCircle2,
  Loader2,
  RefreshCw,
  HelpCircle
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export const AITutorModule: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      role: 'assistant',
      content:
        'Olá! Eu sou o **Professor Lalá**, seu tutor dedicado de Enfermagem 24 horas por dia. 👨‍⚕️✨\n\nPosso te ajudar com:\n- 🧪 **Cálculos de medicação e gotejamento de soro** passo a passo\n- 📜 **Legislação e Resoluções do COFEN/COREN**\n- 💉 **Técnicas de punção, sondagem e sinais vitais**\n- 🎯 **Dicas estratégicas para passar em concursos**\n\nEm que posso te ajudar nos seus estudos hoje?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsLoading(true);

    try {
      const historyPayload = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch('/api/gemini/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          history: historyPayload,
        }),
      });

      const data = await res.json();
      if (data.success && data.reply) {
        const assistantMsg: ChatMessage = {
          id: `a-${Date.now()}`,
          role: 'assistant',
          content: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } else {
        throw new Error(data.error || 'Erro no Tutor');
      }
    } catch (err: any) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content: 'Desculpe, tive um problema ao processar sua dúvida. Verifique sua conexão ou a chave de API.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    '🧪 Como calcular gotejamento de soro em macrogotas?',
    '💉 Passo a passo para diluição de Penicilina Cristalina',
    '🤰 Como usar a Regra de Nägele para calcular a DPP?',
    '📜 Resumo dos Direitos e Proibições da Resolução COFEN 564/2017',
    '📊 O que significa cada cor na Triagem de Manchester?',
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-6 border border-rose-100 dark:border-slate-700 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-800 dark:text-white flex items-center space-x-2 font-display">
            <Bot className="w-6 h-6 text-rose-600" />
            <span>Tutor IA 24/7 - Professor Lalá</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Suporte técnico e pedagógico instantâneo 24 horas por dia para tirar dúvidas de Enfermagem.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 px-3 py-1.5 rounded-xl text-xs font-bold">
          <div className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />
          <span>Disponível 24h em Tempo Real</span>
        </div>
      </div>

      {/* Quick Suggestion Chips */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Sugestões rápidas de dúvidas frequentes:</p>
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/80 border border-rose-100 dark:border-slate-700 hover:border-rose-300 text-xs text-slate-700 dark:text-slate-200 whitespace-nowrap transition-all shadow-2xs font-medium"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="bg-white dark:bg-slate-800/90 rounded-2xl border border-rose-100 dark:border-slate-700 shadow-md flex flex-col h-[520px]">
        
        {/* Messages Scroll Area */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex items-start space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-white font-bold text-sm shadow-sm ${
                    isUser ? 'bg-slate-700' : 'bg-gradient-to-tr from-rose-600 to-pink-500'
                  }`}
                >
                  {isUser ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                </div>

                <div className={`max-w-[82%] space-y-1 ${isUser ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-line shadow-2xs ${
                      isUser
                        ? 'bg-rose-600 text-white rounded-tr-none'
                        : 'bg-rose-50/70 dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-tl-none border border-rose-100 dark:border-slate-700/80'
                    }`}
                  >
                    {msg.content}
                  </div>
                  <span className="text-[10px] text-slate-400 px-1">{msg.timestamp}</span>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-start space-x-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 to-pink-500 flex items-center justify-center text-white shrink-0">
                <Bot className="w-5 h-5" />
              </div>
              <div className="p-4 rounded-2xl rounded-tl-none bg-rose-50/70 dark:bg-slate-900 border border-rose-100 dark:border-slate-700 text-slate-500 text-xs flex items-center space-x-2">
                <Loader2 className="w-4 h-4 animate-spin text-rose-600" />
                <span>Professor Lalá está digitando a resposta...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-rose-100 dark:border-slate-700/80 bg-rose-50/30 dark:bg-slate-900/50 rounded-b-2xl">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Digite sua dúvida de Enfermagem (ex: Cálculo de gotejamento, vacinas PNI)..."
              disabled={isLoading}
              className="flex-1 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-rose-100 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-hidden focus:ring-2 focus:ring-rose-500 font-medium"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-rose-600 hover:bg-rose-500 text-white font-bold p-3 rounded-xl transition-all shadow-md disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};
