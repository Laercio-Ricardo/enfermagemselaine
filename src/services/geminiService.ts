import { GoogleGenAI } from '@google/genai';

// Helper to safely parse JSON from Gemini (handling markdown code fences)
const cleanAndParseJson = (text: string) => {
  if (!text) return {};
  let cleaned = text.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
  }
  return JSON.parse(cleaned.trim());
};

// Helper to sanitize and format conversation history for Gemini multi-turn chat
const formatChatHistory = (history: any[], newMessage: string) => {
  const contents: { role: 'user' | 'model'; parts: { text: string }[] }[] = [];

  if (Array.isArray(history)) {
    for (const msg of history) {
      if (!msg || !msg.content || typeof msg.content !== 'string') continue;
      const role = msg.role === 'user' ? 'user' : 'model';

      // Gemini requires history to start with a 'user' turn
      if (contents.length === 0 && role === 'model') {
        continue;
      }

      // Merge consecutive messages from the same role
      if (contents.length > 0 && contents[contents.length - 1].role === role) {
        contents[contents.length - 1].parts[0].text += `\n\n${msg.content}`;
      } else {
        contents.push({
          role,
          parts: [{ text: msg.content }],
        });
      }
    }
  }

  // Ensure the new message is appended as a 'user' turn
  if (contents.length > 0 && contents[contents.length - 1].role === 'user') {
    contents[contents.length - 1].parts[0].text += `\n\n${newMessage}`;
  } else {
    contents.push({
      role: 'user',
      parts: [{ text: newMessage }],
    });
  }

  return contents;
};

// Retrieve API key for client-side execution when running as a static SPA (e.g., Netlify)
const getClientApiKey = (): string | undefined => {
  return (import.meta as any).env?.VITE_GEMINI_API_KEY || (typeof process !== 'undefined' ? process.env.GEMINI_API_KEY : undefined);
};

const getDirectGeminiClient = () => {
  const apiKey = getClientApiKey();
  if (!apiKey) {
    throw new Error('Chave de API do Gemini (VITE_GEMINI_API_KEY) não encontrada nas variáveis de ambiente.');
  }
  return new GoogleGenAI({ apiKey });
};

// 1. Tutor Chat
export async function askTutorAI(message: string, history: any[], userName?: string): Promise<string> {
  try {
    // Try Server API route first
    const res = await fetch('/api/gemini/tutor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history, userName }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && data.reply) return data.reply;
      if (data.error) throw new Error(data.error);
    } else {
      const errorJson = await res.json().catch(() => ({}));
      if (errorJson.error) {
        console.warn('Server API returned error:', errorJson.error);
      }
    }
  } catch (err) {
    console.warn('Server API error, checking client fallback:', err);
  }

  // Fallback: Direct Client-Side call for Netlify / Static hosting
  const ai = getDirectGeminiClient();
  const userNameContext = userName ? `\n\nIMPORTANTE: O(a) estudante se chama "${userName}". Chame-o(a) pelo nome "${userName}" com frequência para manter o atendimento altamente personalizado, acolhedor e motivador!` : '';

  const systemInstruction = `Você é o "Professor Lalá", um Enfermeiro Mestre e tutor especialista dedicado em preparar candidatos e estudantes para exames e concursos de Técnico em Enfermagem.${userNameContext}
Sua comunicação deve ser encorajadora, didática, precisa e fundamentada na legislação e diretrizes da saúde brasileira (COFEN, COREN, Ministério da Saúde, ANVISA, PNI/SUS).
Sempre responda em Português do Brasil com explicações passo a passo (especialmente em cálculo de medicamentos, gotejamento de soro, interpretação de sinais vitais e procedimentos técnicos). Use emojis amigáveis e tópicos claros.`;

  const chatContents = formatChatHistory(history, message);

  const response = await ai.models.generateContent({
    model: 'gemini-3.6-flash',
    contents: chatContents,
    config: {
      systemInstruction,
      temperature: 0.7,
    },
  });

  return response.text || 'Desculpe, não consegui gerar a resposta no momento.';
}

// 2. Generate Question
export async function generateQuestionAI(subject?: string, banca?: string, difficulty?: string) {
  try {
    const res = await fetch('/api/gemini/question', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subject, banca, difficulty }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.data) return data.data;
    }
  } catch (err) {
    console.warn('Server API fallback to direct client-side call:', err);
  }

  const ai = getDirectGeminiClient();
  const prompt = `Gere 1 questão inédita no estilo de concurso público brasileiro para Técnico em Enfermagem.
Assunto: ${subject || 'Fundamentos de Enfermagem'}
Banca de referência: ${banca || 'VUNESP / CESPE / FGV'}
Dificuldade: ${difficulty || 'Média'}

Retorne ESTRITAMENTE um JSON no seguinte formato (sem marcações markdown envolventes):
{
  "statement": "Texto do enunciado da questão detalhado...",
  "options": ["A) ...", "B) ...", "C) ...", "D) ...", "E) ..."],
  "correctIndex": 0,
  "explanation": "Fundamentação técnica e legislação pertinente (ex: Resolução COFEN, Caderno MS)...",
  "subject": "${subject || 'Fundamentos de Enfermagem'}",
  "banca": "${banca || 'VUNESP'}",
  "difficulty": "${difficulty || 'Média'}"
}`;

  const response = await ai.models.generateContent({
    model: 'gemini-3.6-flash',
    contents: prompt,
    config: { responseMimeType: 'application/json', temperature: 0.7 },
  });

  return cleanAndParseJson(response.text || '{}');
}

// 3. Batch Daily Questions
export async function generateDailyQuestionsAI(dateStr?: string) {
  try {
    const res = await fetch('/api/gemini/daily-questions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dateStr }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.questions) return data.questions;
    }
  } catch (err) {
    console.warn('Server API fallback to direct client-side call:', err);
  }

  const ai = getDirectGeminiClient();
  const prompt = `Gere exatamente 5 questões inéditas, diretas e práticas para concurso de Técnico em Enfermagem referentes ao dia ${dateStr || 'de hoje'}.
NÃO crie questões muito difíceis, pegadinhas obscuras ou conceitos extremamente complexos. O foco deve ser o aprendizado consistente e a consolidação de conhecimentos fundamentais.
As questões devem ser de nível "Fácil" ou "Média" e abranger temas essenciais da área (ex: 1 de Fundamentos de Enfermagem, 1 de Farmacologia, 1 de Saúde Pública & SUS, 1 de Urgência & Emergência, 1 de Imunização PNI).
As bancas devem ser variadas (VUNESP, FGV, IBFC, CESPE).

Retorne ESTRITAMENTE um JSON no seguinte formato:
{
  "questions": [
    {
      "statement": "Enunciado claro e objetivo...",
      "options": ["A) ...", "B) ...", "C) ...", "D) ...", "E) ..."],
      "correctIndex": 0,
      "explanation": "Explicação simples e didática com a fundamentação do COFEN/SUS...",
      "subject": "Fundamentos de Enfermagem",
      "banca": "VUNESP",
      "difficulty": "Média"
    }
  ]
}`;

  const response = await ai.models.generateContent({
    model: 'gemini-3.6-flash',
    contents: prompt,
    config: { responseMimeType: 'application/json', temperature: 0.8 },
  });

  const parsed = cleanAndParseJson(response.text || '{}');
  return parsed.questions || [];
}

// 4. Generate Flashcards
export async function generateFlashcardsAI(topic?: string, amount?: number) {
  try {
    const res = await fetch('/api/gemini/flashcards', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic, amount }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.flashcards) return data.flashcards;
    }
  } catch (err) {
    console.warn('Server API fallback to direct client-side call:', err);
  }

  const ai = getDirectGeminiClient();
  const prompt = `Gere ${amount || 5} flashcards essenciais de revisão rápida sobre o tema "${topic || 'Farmacologia em Enfermagem'}" direcionados para concursos de Técnico em Enfermagem.
Retorne um JSON no formato:
{
  "flashcards": [
    {
      "front": "Pergunta ou conceito no frente do cartão...",
      "back": "Resposta direta, macete ou explicação sintetizada...",
      "category": "${topic || 'Geral'}"
    }
  ]
}`;

  const response = await ai.models.generateContent({
    model: 'gemini-3.6-flash',
    contents: prompt,
    config: { responseMimeType: 'application/json' },
  });

  const parsed = cleanAndParseJson(response.text || '{}');
  return parsed.flashcards || [];
}

// 5. Generate Weekly Report
export async function generateReportAI(stats: any, weakTopics: string[]) {
  try {
    const res = await fetch('/api/gemini/report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stats, weakTopics }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.data) return data.data;
    }
  } catch (err) {
    console.warn('Server API fallback to direct client-side call:', err);
  }

  const ai = getDirectGeminiClient();
  const prompt = `Análise de desempenho semanal para estudante de Técnico em Enfermagem:
- Total de questões respondidas na semana: ${stats?.totalQuestions || 0}
- Taxa de acerto geral: ${stats?.accuracy || 0}%
- Minutos estudados: ${stats?.minutesStudied || 0}
- Flashcards revisados: ${stats?.flashcardsReviewed || 0}
- Tópicos com menor rendimento: ${weakTopics?.join(', ') || 'Sem dados'}

Forneça um relatório semanal detalhado, motivador e estratégico em formato JSON com:
{
  "diagnostic": "Resumo analítico do rendimento e pontos fortes da aluna...",
  "prioritySubjects": ["Tópico 1", "Tópico 2", "Tópico 3"],
  "tips": [
    "Dica prática de memorização...",
    "Recomendação de técnica de estudos...",
    "Mensagem motivacional..."
  ],
  "recommendedScheduleFocus": "Sugestão de distribuição de horas para a próxima semana..."
}`;

  const response = await ai.models.generateContent({
    model: 'gemini-3.6-flash',
    contents: prompt,
    config: { responseMimeType: 'application/json' },
  });

  return cleanAndParseJson(response.text || '{}');
}

// 6. Generate Study Summary
export async function generateStudySummaryAI(topic: string, subject?: string) {
  try {
    const res = await fetch('/api/gemini/generate-summary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic, subject }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.article) return data.article;
    }
  } catch (err) {
    console.warn('Server API fallback to direct client-side call:', err);
  }

  const ai = getDirectGeminiClient();
  const prompt = `Você é um professor renomado de Técnico em Enfermagem especialista em Concursos Públicos (VUNESP, FGV, CESPE, IBFC).
Crie um resumo de estudo teórico completo e focado para provas sobre o tema: "${topic}".
Matéria relacionada: "${subject || 'Fundamentos de Enfermagem'}".

Forneça um JSON com a seguinte estrutura estrita:
{
  "title": "Título conciso do Resumo",
  "subject": "${subject || 'Fundamentos de Enfermagem'}",
  "summary": "Resumo executivo de 2-3 frases...",
  "keyPoints": ["Ponto chave 1", "Ponto chave 2", "Ponto chave 3", "Ponto chave 4"],
  "cofenNorm": "Resolução ou norma COFEN/MS aplicável",
  "mnemonic": "Mnemônico prático para memorização rápida",
  "readTimeMinutes": 5,
  "contentMarkdown": "# Título\\n\\n## 1. Conceito e Definição\\n...\\n\\n## 2. Passo a Passo Técnico\\n...\\n\\n## 3. Pegadinhas Frequentes\\n...\\n\\n## 4. Cuidados Importantes\\n..."
}`;

  const response = await ai.models.generateContent({
    model: 'gemini-3.6-flash',
    contents: prompt,
    config: { responseMimeType: 'application/json', temperature: 0.7 },
  });

  return cleanAndParseJson(response.text || '{}');
}
