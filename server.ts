import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client safely
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is missing.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// API: Generate AI Exam Question for Técnico em Enfermagem
app.post('/api/gemini/question', async (req, res) => {
  try {
    const { subject, banca, difficulty } = req.body;
    const ai = getGeminiClient();

    const prompt = `Gere 1 questão inédita no estilo de concurso público brasileiro para Técnico em Enfermagem.
Assunto: ${subject || 'Fundamentos de Enfermagem'}
Banca de referência: ${banca || 'VUNESP / CESPE / FGV'}
Dificuldade: ${difficulty || 'Média'}

Retorne ESTRITAMENTE um JSON no seguinte formato (sem formatação markdown envolvente):
{
  "statement": "Texto do enunciado da questão detalhado e realista de concurso...",
  "options": [
    "A) Alternativa A...",
    "B) Alternativa B...",
    "C) Alternativa C...",
    "D) Alternativa D...",
    "E) Alternativa E..."
  ],
  "correctIndex": 0, // Índice de 0 a 4 da alternativa correta
  "explanation": "Fundamentação técnica e legislação pertinente (ex: Resolução COFEN, Caderno do Ministério da Saúde, Manual de Imunização/PNI)...",
  "subject": "${subject || 'Fundamentos de Enfermagem'}",
  "banca": "${banca || 'VUNESP'}",
  "difficulty": "${difficulty || 'Média'}"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.7,
      },
    });

    const text = response.text || '';
    const questionData = JSON.parse(text);
    res.json({ success: true, data: questionData });
  } catch (error: any) {
    console.error('Error generating question:', error);
    res.status(500).json({ success: false, error: error.message || 'Erro ao gerar questão por IA.' });
  }
});

// API: 24/7 Nursing AI Tutor Chat
app.post('/api/gemini/tutor', async (req, res) => {
  try {
    const { message, history, userName } = req.body;
    const ai = getGeminiClient();

    const userNameContext = userName ? `\n\nIMPORTANTE: O(a) estudante se chama "${userName}". Chame-o(a) pelo nome "${userName}" com frequência nas respostas para manter o atendimento altamente personalizado, acolhedor e motivador!` : '';

    const systemInstruction = `Você é o "Professor Lalá", um Enfermeiro Mestre e tutor especialista dedicado em preparar candidatos e estudantes para exames e concursos de Técnico em Enfermagem.${userNameContext}
Sua comunicação deve ser encorajadora, didática, precisa e fundamentada na legislação e diretrizes da saúde brasileira (COFEN, COREN, Ministério da Saúde, ANVISA, PNI/SUS).
Sempre responda em Português do Brasil com explicações passo a passo (especialmente em cálculo de medicamentos, gotejamento de soro, interpretação de sinais vitais e procedimentos técnicos). Use emojis amigáveis e tópicos claros.`;

    const chatContents = [];
    if (Array.isArray(history) && history.length > 0) {
      for (const msg of history) {
        chatContents.push({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }],
        });
      }
    }
    chatContents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: chatContents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({ success: true, reply: response.text });
  } catch (error: any) {
    console.error('Error in tutor chat:', error);
    res.status(500).json({ success: false, error: error.message || 'Erro no Tutor IA.' });
  }
});

// API: Generate Weekly Performance AI Report & Study Plan Recommendations
app.post('/api/gemini/report', async (req, res) => {
  try {
    const { stats, weakTopics } = req.body;
    const ai = getGeminiClient();

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
    "Dica prática de memorização ou macete para concurso...",
    "Recomendação de técnica de estudos ou cálculo para focar...",
    "Mensagem motivacional para manter a disciplina diária..."
  ],
  "recommendedScheduleFocus": "Sugestão de distribuição de horas para a próxima semana..."
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const reportData = JSON.parse(response.text || '{}');
    res.json({ success: true, data: reportData });
  } catch (error: any) {
    console.error('Error generating report:', error);
    res.status(500).json({ success: false, error: error.message || 'Erro ao gerar relatório.' });
  }
});

// API: Generate Flashcard Deck via AI
app.post('/api/gemini/flashcards', async (req, res) => {
  try {
    const { topic, amount } = req.body;
    const ai = getGeminiClient();

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
      config: {
        responseMimeType: 'application/json',
      },
    });

    const data = JSON.parse(response.text || '{}');
    res.json({ success: true, flashcards: data.flashcards || [] });
  } catch (error: any) {
    console.error('Error generating flashcards:', error);
    res.status(500).json({ success: false, error: error.message || 'Erro ao gerar flashcards.' });
  }
});

// API: Auto-Generate Daily Fresh Question Pool (5 questions across topics)
app.post('/api/gemini/daily-questions', async (req, res) => {
  try {
    const { dateStr } = req.body;
    const ai = getGeminiClient();

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
      config: {
        responseMimeType: 'application/json',
        temperature: 0.8,
      },
    });

    const data = JSON.parse(response.text || '{}');
    res.json({ success: true, questions: data.questions || [] });
  } catch (error: any) {
    console.error('Error generating daily questions batch:', error);
    res.status(500).json({ success: false, error: error.message || 'Erro ao gerar questões diárias.' });
  }
});

// API: Generate Study Summary / Guide with AI
app.post('/api/gemini/generate-summary', async (req, res) => {
  try {
    const { topic, subject } = req.body;
    const ai = getGeminiClient();

    const prompt = `Você é um professor renomado de Técnico em Enfermagem especialista em Concursos Públicos (VUNESP, FGV, CESPE, IBFC).
Crie um resumo de estudo teórico completo e focado para provas sobre o tema: "${topic}".
Matéria relacionada: "${subject || 'Fundamentos de Enfermagem'}".

Forneça um JSON com a seguinte estrutura estrita:
{
  "title": "Título conciso do Resumo",
  "subject": "${subject || 'Fundamentos de Enfermagem'}",
  "summary": "Resumo executivo de 2-3 frases sobre a importância do tema para provas",
  "keyPoints": ["Ponto chave 1 de concurso", "Ponto chave 2 de concurso", "Ponto chave 3 de concurso", "Ponto chave 4"],
  "cofenNorm": "Resolução ou norma COFEN/MS aplicável (ex: Resolução COFEN 564/2017)",
  "mnemonic": "Mnemônico prático para memorização rápida (se aplicável)",
  "readTimeMinutes": 5,
  "contentMarkdown": "# Título\\n\\n## 1. Conceito e Definição\\n...\\n\\n## 2. Passo a Passo Técnico / Procedimento\\n...\\n\\n## 3. Pegadinhas Frequentes de Bancas de Concurso\\n...\\n\\n## 4. Cuidados Importantes de Enfermagem\\n..."
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.7,
      },
    });

    const data = JSON.parse(response.text || '{}');
    res.json({ success: true, article: data });
  } catch (error: any) {
    console.error('Error generating study summary:', error);
    res.status(500).json({ success: false, error: error.message || 'Erro ao gerar resumo de estudos.' });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
