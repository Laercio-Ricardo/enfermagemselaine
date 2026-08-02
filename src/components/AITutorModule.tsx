import React, { useState, useRef, useEffect } from 'react';
import Markdown from 'react-markdown';
import { askTutorAI } from '../services/geminiService';
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
  HelpCircle,
  Edit2,
  Check
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

const USER_NAME_KEY = 'enfermagem_pro_user_name';

export const AITutorModule: React.FC = () => {
  const [userName, setUserName] = useState<string>(() => {
    return localStorage.getItem(USER_NAME_KEY) || '';
  });

  const [isAskingName, setIsAskingName] = useState<boolean>(!localStorage.getItem(USER_NAME_KEY));
  const [isEditingName, setIsEditingName] = useState<boolean>(false);
  const [editNameInput, setEditNameInput] = useState<string>('');

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const savedName = localStorage.getItem(USER_NAME_KEY);
    if (savedName) {
      return [
        {
          id: 'm-1',
          role: 'assistant',
          content: `Olá, **${savedName}**! Eu sou o **Professor Lalá**, seu tutor de Enfermagem 24 horas por dia. 👨‍⚕️✨\n\nTodas as minhas dicas e explicações estão preparadas especialmente para você!\n\nPosso te ajudar com:\n- 🧪 **Cálculos de medicação e gotejamento de soro** passo a passo\n- 📜 **Legislação e Resoluções do COFEN/COREN**\n- 💉 **Técnicas de punção, sondagem e sinais vitais**\n- 🎯 **Dicas estratégicas personalizadas para seu concurso**\n\nEm que posso te ajudar nos seus estudos hoje, **${savedName}**?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ];
    } else {
      return [
        {
          id: 'm-1',
          role: 'assistant',
          content: 'Olá! Eu sou o **Professor Lalá**, seu tutor dedicado de Enfermagem 24 horas por dia. 👨‍⚕️✨\n\nAntes de começarmos e tirarmos suas dúvidas, **qual é o seu nome** (ou como gostaria de ser chamado/a)?\n\nPor favor, digite seu nome no campo abaixo para que eu possa personalizar todas as nossas dicas de estudo! 😊',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ];
    }
  });

  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSaveName = (nameToSave: string) => {
    const cleanName = nameToSave.trim();
    if (!cleanName) return;

    localStorage.setItem(USER_NAME_KEY, cleanName);
    setUserName(cleanName);
    setIsAskingName(false);
    setIsEditingName(false);

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: `Meu nome é ${cleanName}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const assistantMsg: ChatMessage = {
      id: `a-${Date.now()}`,
      role: 'assistant',
      content: `Prazer enorme te conhecer, **${cleanName}**! 🎉✨\n\nA partir de agora, todas as minhas dicas, resoluções de questões e orientações de concurso serão personalizadas para você!\n\nQual é a sua dúvida de Enfermagem hoje, **${cleanName}**?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setInput('');
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || isLoading) return;

    // Intercept if asking for name
    if (isAskingName && !userName) {
      handleSaveName(query);
      return;
    }

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

      const reply = await askTutorAI(query, historyPayload, userName);
      const assistantMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        content: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content: `Desculpe, ${userName || 'estudante'}, tive um problema ao processar sua dúvida. Verifique sua conexão ou a chave de API.`,
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
            Suporte técnico e pedagógico instantâneo 24 horas por dia com dicas personalizadas.
          </p>
        </div>

        {/* User Name Badge & Live Badge */}
        <div className="flex flex-wrap items-center gap-2">
          {userName && !isEditingName ? (
            <div className="flex items-center space-x-2 bg-rose-50 dark:bg-slate-900 border border-rose-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 px-3 py-1.5 rounded-xl text-xs font-bold">
              <User className="w-3.5 h-3.5 text-rose-600" />
              <span>Estudante: <strong>{userName}</strong></span>
              <button
                onClick={() => {
                  setEditNameInput(userName);
                  setIsEditingName(true);
                }}
                className="ml-1 p-1 hover:text-rose-600 text-slate-400 transition-colors"
                title="Editar meu nome"
              >
                <Edit2 className="w-3 h-3" />
              </button>
            </div>
          ) : isEditingName ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveName(editNameInput);
              }}
              className="flex items-center space-x-1"
            >
              <input
                type="text"
                value={editNameInput}
                onChange={(e) => setEditNameInput(e.target.value)}
                placeholder="Seu nome..."
                className="bg-white dark:bg-slate-900 border border-rose-300 rounded-lg px-2 py-1 text-xs text-slate-800 dark:text-white font-medium focus:outline-hidden"
              />
              <button
                type="submit"
                className="bg-rose-600 text-white p-1 rounded-lg text-xs hover:bg-rose-500"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
            </form>
          ) : null}

          <div className="flex items-center space-x-2 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 px-3 py-1.5 rounded-xl text-xs font-bold">
            <div className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />
            <span>Disponível 24h</span>
          </div>
        </div>
      </div>

      {/* Asking Name Banner */}
      {isAskingName && (
        <div className="bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 p-4 rounded-2xl flex items-center justify-between text-xs text-amber-900 dark:text-amber-200 font-medium">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
            <span>O Professor Lalá quer te conhecer! Digite seu nome abaixo para receber dicas de estudo personalizadas.</span>
          </div>
        </div>
      )}

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
                    className={`p-4 rounded-2xl text-sm leading-relaxed shadow-2xs ${
                      isUser
                        ? 'bg-rose-600 text-white rounded-tr-none whitespace-pre-wrap'
                        : 'bg-rose-50/70 dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-tl-none border border-rose-100 dark:border-slate-700/80'
                    }`}
                  >
                    {isUser ? (
                      msg.content
                    ) : (
                      <div className="markdown-content text-slate-800 dark:text-slate-100 space-y-2.5 [&_strong]:font-bold [&_strong]:text-slate-900 dark:[&_strong]:text-white [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:my-1 [&_h1]:text-base [&_h1]:font-bold [&_h2]:text-base [&_h2]:font-bold [&_h3]:text-sm [&_h3]:font-bold [&_hr]:my-3 [&_hr]:border-rose-200 dark:[&_hr]:border-slate-700">
                        <Markdown>{msg.content}</Markdown>
                      </div>
                    )}
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
                <span>Professor Lalá está preparando sua resposta personalizada...</span>
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
              placeholder={
                isAskingName
                  ? 'Digite seu nome aqui para o Professor Lalá...'
                  : 'Digite sua dúvida de Enfermagem (ex: Cálculo de gotejamento, vacinas PNI)...'
              }
              disabled={isLoading}
              className="flex-1 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-rose-100 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-hidden focus:ring-2 focus:ring-rose-500 font-medium"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-rose-600 hover:bg-rose-500 text-white font-bold px-4 py-3 rounded-xl transition-all shadow-md disabled:opacity-50 flex items-center space-x-1"
            >
              <Send className="w-5 h-5" />
              {isAskingName && <span className="text-xs font-bold hidden sm:inline">Enviar Nome</span>}
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};

