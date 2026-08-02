import { Question, Flashcard, ScheduleItem, AppState, StudyArticle } from '../types';

export const INITIAL_ARTICLES: StudyArticle[] = [
  {
    id: 'art-1',
    title: 'Cálculo de Gotejamento de Soro e Infusões',
    subject: 'Fundamentos de Enfermagem',
    summary: 'Guia completo de cálculo de infusão em macrogotas, microgotas, horas e minutos para concursos e prática hospitalar.',
    keyPoints: [
      'Macrogotas/minuto = Volume / (Tempo em horas × 3)',
      'Microgotas/minuto = Volume / Tempo em horas',
      '1 Macrogota = 3 Microgotas',
      '1 mL = 20 Macrogotas = 60 Microgotas'
    ],
    cofenNorm: 'Parecer COFEN nº 01/2021 (Segurança na Administração de Medicamentos)',
    mnemonic: 'V / (T x 3) = Macrogotas em Horas. Lembrar: Tempo sempre em Horas!',
    readTimeMinutes: 6,
    contentMarkdown: `### 1. Fórmulas de Gotejamento (Tempo em Horas)

- **Macrogotas (gtts/min):**  
  $$\\text{Gotejamento} = \\frac{\\text{Volume (mL)}}{\\text{Tempo (horas)} \\times 3}$$

- **Microgotas (mgtts/min):**  
  $$\\text{Microgotas} = \\frac{\\text{Volume (mL)}}{\\text{Tempo (horas)}}$$

---

### 2. Fórmulas de Gotejamento (Tempo em Minutos)

- **Macrogotas (gtts/min):**  
  $$\\text{Gotejamento} = \\frac{\\text{Volume (mL)} \\times 20}{\\text{Tempo (minutos)}}$$

- **Microgotas (mgtts/min):**  
  $$\\text{Microgotas} = \\frac{\\text{Volume (mL)} \\times 60}{\\text{Tempo (minutos)}}$$

---

### 3. Exemplo Prático de Concurso (VUNESP)
**Enunciado:** Administrar 500 mL de Soro Fisiológico em 6 horas.  
**Cálculo:**  
$$500 / (6 \\times 3) = 500 / 18 = 27,77 \\Rightarrow 28 \\text{ macrogotas/minuto.}$$`
  },
  {
    id: 'art-2',
    title: 'Código de Ética dos Profissionais de Enfermagem',
    subject: 'Ética e Legislação de Enfermagem',
    summary: 'Principais Direitos, Deveres e Proibições conforme a Resolução COFEN nº 564/2017 para gabaritar questões de legislação.',
    keyPoints: [
      'Direitos: Recusar-se a executar atividades que não sejam de sua competência legal.',
      'Deveres: Registrar no prontuário as informações inerentes ao processo de cuidar.',
      'Proibições: Administrar medicamentos sem conhecer a ação da droga e sem prescrição prévia (salvo emergência).',
      'Penalidades: Advertência verbal, Multa, Censura, Suspensão e Cassações.'
    ],
    cofenNorm: 'Resolução COFEN nº 564/2017',
    mnemonic: 'D-D-P (Direito = Posso recusar o ilegal | Dever = Devo registrar tudo | Proibição = Não posso omitir socorro)',
    readTimeMinutes: 8,
    contentMarkdown: `### 1. Direitos do Profissional (Art. 1º ao 23)
- Exercer a enfermagem com liberdade, segurança e autonomia.
- Recusar-se a executar atividades quando não oferecerem segurança ao profissional e ao paciente.
- Aprimorar seus conhecimentos técnicos e científicos.

### 2. Deveres do Profissional (Art. 24 ao 60)
- Prestar assistência sem discriminação de qualquer natureza.
- Manter segredo profissional sobre fato de que tenha conhecimento em razão da atividade.
- Registrar no prontuário todas as ações de enfermagem prestadas.

### 3. Proibições (Art. 61 ao 102)
- Executar prescrições médicas ilegíveis ou sem assinatura do médico.
- Negar assistência de enfermagem em casos de urgência e emergência.`
  },
  {
    id: 'art-3',
    title: 'Sinais Vitais & Tabela de Valores de Referência 2026',
    subject: 'Fundamentos de Enfermagem',
    summary: 'Parâmetros normais de Pressão Arterial, Frequência Cardíaca, Frequência Respiratória e Temperatura para adultos e pediatria.',
    keyPoints: [
      'Pressão Arterial Ótima Adulto: < 120/80 mmHg (Diretriz Brasileira de PA)',
      'Frequência Cardíaca (Eucárdico): 60 a 100 bpm em adultos',
      'Frequência Respiratória (Eupneico): 12 a 20 irpm',
      'Temperatura Axilar Normal: 35,5ºC a 37,2ºC (Afebril)'
    ],
    cofenNorm: 'Manual de Procedimentos Práticos MS / COFEN',
    mnemonic: 'P-A-F-T (Pressão, Pulso, Respiração e Temperatura - os 4 pilares da triagem)',
    readTimeMinutes: 5,
    contentMarkdown: `### 1. Parâmetros em Adulto Saudável
- **Pressão Arterial:**
  - Ótima: < 120 e < 80 mmHg
  - Normal: 120-129 e/ou 80-84 mmHg
  - Pré-hipertensão: 130-139 e/ou 85-89 mmHg
  - Hipertensão Estágio 1: 140-159 e/ou 90-99 mmHg

- **Frequência Cardíaca:**
  - Normocardia: 60 - 100 bpm
  - Bradicardia: < 60 bpm
  - Taquicardia: > 100 bpm

- **Frequência Respiratória:**
  - Eupneia: 12 - 20 irpm
  - Bradipneia: < 12 irpm
  - Taquipneia: > 20 irpm`
  }
];

export const INITIAL_QUESTIONS: Question[] = [
  {
    id: 'q-1',
    statement: 'Um médico prescreveu 1.000 mL de Soro Fisiológico 0,9% para ser administrado por via endovenosa em 8 horas. O técnico em enfermagem deve calcular a velocidade de infusão em macrogotas por minuto (gtts/min). Qual o valor correto do gotejamento?',
    options: [
      'A) 21 macrogotas/minuto',
      'B) 42 macrogotas/minuto',
      'C) 63 macrogotas/minuto',
      'D) 84 macrogotas/minuto',
      'E) 125 macrogotas/minuto'
    ],
    correctIndex: 1,
    explanation: 'Fórmula de gotejamento em macrogotas = V / (T × 3). Substituindo os valores: 1.000 / (8 × 3) = 1.000 / 24 ≈ 41,66. Arredondando para o número inteiro mais próximo, temos 42 gotas/minuto.',
    subject: 'Fundamentos de Enfermagem',
    banca: 'VUNESP',
    difficulty: 'Média'
  },
  {
    id: 'q-2',
    statement: 'De acordo com a Lei 8.080/1990 (Lei Orgânica da Saúde), são princípios doutrinários e organizacionais do Sistema Único de Saúde (SUS), EXCETO:',
    options: [
      'A) Universalidade de acesso aos serviços de saúde em todos os níveis de assistência.',
      'B) Integralidade de assistência, entendida como conjunto articulado e contínuo de ações e serviços.',
      'C) Preservação da autonomia das pessoas na defesa de sua integridade física e moral.',
      'D) Centralização do comando das ações de saúde em nível federal exclusivo.',
      'E) Equidade na atenção à saúde, sem preconceitos ou privilégios de qualquer espécie.'
    ],
    correctIndex: 3,
    explanation: 'A centralização não é um princípio do SUS. Pelo contrário, o princípio organizacional do SUS é a DESCENTRALIZAÇÃO político-administrativa, com direção única em cada esfera de governo.',
    subject: 'Saúde Pública & SUS',
    banca: 'CESPE/Cebraspe',
    difficulty: 'Fácil'
  },
  {
    id: 'q-3',
    statement: 'Na administração de medicamentos por via subcutânea (SC) em um paciente adulto com peso normal, o ângulo correto de inserção da agulha (com agulha 13x4,5 mm sem prega de espessura excessiva) é de:',
    options: [
      'A) 10 a 15 graus',
      'B) 30 graus',
      'C) 45 a 90 graus',
      'D) 120 graus',
      'E) Exatamente 5 graus (intradérmico)'
    ],
    correctIndex: 2,
    explanation: 'A via subcutânea é administrada no tecido adiposo. O ângulo recomendado varia de 45 a 90 graus dependendo do comprimento da agulha e da quantidade de tecido subcutâneo do paciente (agulhas curtas de 13mm utilizam 90° e agulhas maiores 45°).',
    subject: 'Farmacologia',
    banca: 'FGV',
    difficulty: 'Média'
  },
  {
    id: 'q-4',
    statement: 'Paciente do sexo feminino, 28 anos, gestante, comparece à consulta de pré-natal na Unidade Básica de Saúde. Refere que a data da sua última menstruação (DUM) foi em 10 de maio de 2025. Utilizando a Regra de Nägele, qual é a Data Provável do Parto (DPP)?',
    options: [
      'A) 17 de fevereiro de 2026',
      'B) 17 de janeiro de 2026',
      'C) 10 de fevereiro de 2026',
      'D) 17 de março de 2026',
      'E) 03 de fevereiro de 2026'
    ],
    correctIndex: 0,
    explanation: 'Pela Regra de Nägele: Soma-se 7 ao dia da DUM e subtrai-se 3 do mês (ou soma-se 9 se os meses forem janeiro a março). Dia: 10 + 7 = 17. Mês: Maio (mês 5) - 3 = Fevereiro (mês 2) do ano seguinte. Logo, a DPP é 17 de fevereiro de 2026.',
    subject: 'Saúde da Mulher e da Criança',
    banca: 'IBFC',
    difficulty: 'Média'
  },
  {
    id: 'q-5',
    statement: 'Segundo o Código de Ética dos Profissionais de Enfermagem (Resolução COFEN nº 564/2017), é PROIBIDO ao técnico em enfermagem:',
    options: [
      'A) Recusar-se a executar atividades que não sejam de sua competência técnica ou legal.',
      'B) Administrar medicamentos sem conhecer a ação da droga e sem certificar-se da possibilidade de riscos.',
      'C) Ter acesso a todas as informações relativas à pessoa da sua assistência.',
      'D) Abster-se de revelar informações confidenciais de que tenha conhecimento em razão do exercício profissional.',
      'E) Prestar cuidados de enfermagem livres de discriminação.'
    ],
    correctIndex: 1,
    explanation: 'De acordo com o art. 62 do Código de Ética, é proibido administrar medicamentos sem conhecer a ação da droga e sem certificar-se da possibilidade de riscos, visando garantir a segurança do paciente.',
    subject: 'Ética e Legislação de Enfermagem',
    banca: 'AOCP',
    difficulty: 'Fácil'
  },
  {
    id: 'q-6',
    statement: 'No suporte básico de vida (SBV) em adultos vítimas de parada cardiorrespiratória (PCR), a relação recomendada entre compressões torácicas e ventilações para um único socorrista é de:',
    options: [
      'A) 15 compressões para 2 ventilações',
      'B) 30 compressões para 2 ventilações',
      'C) 50 compressões para 5 ventilações',
      'D) 5 compressões para 1 ventilação',
      'E) Compressões contínuas sem ventilação obrigatória em todos os casos de equipe hospitalar'
    ],
    correctIndex: 1,
    explanation: 'Conforme as Diretrizes de Ressuscitação Cardiopulmonar da American Heart Association (AHA), a relação para adultos é de 30 compressões para 2 ventilações (30:2) a uma frequência de 100 a 120 compressões por minuto.',
    subject: 'Enfermagem Médico-Cirúrgica & Urgência',
    banca: 'Consulplan',
    difficulty: 'Fácil'
  },
  {
    id: 'q-7',
    statement: 'De acordo com o Calendário Nacional de Vacinação do Ministério da Saúde (PNI), a vacina BCG (Bacilo Calmette-Guérin) previne contra:',
    options: [
      'A) Difteria, tétano e coqueluche',
      'B) Formas graves da tuberculose (meníngea e disseminada)',
      'C) Gastroenterite por rotavírus humano',
      'D) Poliomielite paralítica',
      'E) Sarampo, caxumba e rubéola'
    ],
    correctIndex: 1,
    explanation: 'A vacina BCG é administrada em dose única ao nascer e protege contra as formas graves da Tuberculose (principalmente a meningoencefálica e a miliar).',
    subject: 'Imunização & PNI',
    banca: 'VUNESP',
    difficulty: 'Fácil'
  },
  {
    id: 'q-8',
    statement: 'Para a administração de 500 mL de Soro Glicosado 5% em 12 horas utilizando um equipo de microgotas, quantas microgotas por minuto deverão ser administradas?',
    options: [
      'A) 14 microgotas/minuto',
      'B) 28 microgotas/minuto',
      'C) 42 microgotas/minuto',
      'D) 84 microgotas/minuto',
      'E) 100 microgotas/minuto'
    ],
    correctIndex: 2,
    explanation: 'Fórmula de gotejamento em microgotas = Volume (mL) / Tempo (horas). Portanto: 500 / 12 ≈ 41,66 microgotas/minuto. Arredondando, obtém-se 42 microgotas/minuto. Lembre-se: 1 macrogota = 3 microgotas.',
    subject: 'Farmacologia',
    banca: 'CESPE/Cebraspe',
    difficulty: 'Média'
  }
];

export const INITIAL_FLASHCARDS: Flashcard[] = [
  {
    id: 'fc-1',
    front: 'Qual a fórmula para cálculo de gotejamento em MACROGOTAS por minuto?',
    back: 'Gotas/min = Volume total (mL) ÷ (Tempo em horas × 3)',
    category: 'Fundamentos de Enfermagem',
    nextReviewDate: new Date().toISOString(),
    intervalDays: 1,
    repetitions: 0,
    easeFactor: 2.5
  },
  {
    id: 'fc-2',
    front: 'Qual a equivalência entre gotas e microgotas?',
    back: '1 macrogota = 3 microgotas (1 mL = 20 gotas = 60 microgotas).',
    category: 'Farmacologia',
    nextReviewDate: new Date().toISOString(),
    intervalDays: 1,
    repetitions: 0,
    easeFactor: 2.5
  },
  {
    id: 'fc-3',
    front: 'Quais são as diretrizes de profundidade e frequência das compressões torácicas na RCP em adultos?',
    back: 'Profundidade: 5 a 6 cm no centro do tórax. Frequência: 100 a 120 compressões por minuto. Relação: 30:2.',
    category: 'Enfermagem Médico-Cirúrgica & Urgência',
    nextReviewDate: new Date().toISOString(),
    intervalDays: 1,
    repetitions: 0,
    easeFactor: 2.5
  },
  {
    id: 'fc-4',
    front: 'Como calcular a Data Provável do Parto (DPP) pela Regra de Nägele?',
    back: 'Somar 7 ao DIA da DUM. No MÊS: se DUM for entre jan e mar (soma 9); se for entre abr e dez (subtrai 3 e soma 1 ano).',
    category: 'Saúde da Mulher e da Criança',
    nextReviewDate: new Date().toISOString(),
    intervalDays: 1,
    repetitions: 0,
    easeFactor: 2.5
  },
  {
    id: 'fc-5',
    front: 'Quais são os 5 momentos para a Higienização das Mãos segundo a OMS e Anvisa?',
    back: '1. Antes de tocar o paciente\n2. Antes de realizar procedimento limpo/asséptico\n3. Após risco de exposição a fluidos corporais\n4. Após tocar o paciente\n5. Após tocar superfícies próximas ao paciente.',
    category: 'Fundamentos de Enfermagem',
    nextReviewDate: new Date().toISOString(),
    intervalDays: 1,
    repetitions: 0,
    easeFactor: 2.5
  },
  {
    id: 'fc-6',
    front: 'Quais são as vacinas do recém-nascido administradas ao nascer na maternidade?',
    back: 'BCG (dose única ID na inserção do deltoide direito) e Hepatite B (1ª dose IM no vasto lateral da coxa).',
    category: 'Imunização & PNI',
    nextReviewDate: new Date().toISOString(),
    intervalDays: 1,
    repetitions: 0,
    easeFactor: 2.5
  }
];

export const INITIAL_SCHEDULE: ScheduleItem[] = [
  {
    id: 's-1',
    dayOfWeek: 1, // Segunda-feira
    timeSlot: '08:00 - 10:00',
    subject: 'Fundamentos de Enfermagem',
    topic: 'Cálculo de Medicamentos & Gotejamento de Soro',
    completed: true,
    notes: 'Revisar fórmulas de macrogotas e microgotas'
  },
  {
    id: 's-2',
    dayOfWeek: 1,
    timeSlot: '14:00 - 15:30',
    subject: 'Farmacologia',
    topic: 'Vias de Administração & Diluição de Penicilina Cristalina',
    completed: false
  },
  {
    id: 's-3',
    dayOfWeek: 2, // Terça-feira
    timeSlot: '09:00 - 11:00',
    subject: 'Saúde Pública & SUS',
    topic: 'Lei 8.080/90, Lei 8.142/90 e Princípios do SUS',
    completed: false
  },
  {
    id: 's-4',
    dayOfWeek: 3, // Quarta-feira
    timeSlot: '08:30 - 10:30',
    subject: 'Enfermagem Médico-Cirúrgica & Urgência',
    topic: 'Suporte Básico de Vida (SBV/AHA) e Triagem Manchester',
    completed: false
  },
  {
    id: 's-5',
    dayOfWeek: 4, // Quinta-feira
    timeSlot: '14:00 - 16:00',
    subject: 'Saúde da Mulher e da Criança',
    topic: 'Assistência ao Pré-Natal, Regra de Nägele e Apgar',
    completed: false
  },
  {
    id: 's-6',
    dayOfWeek: 5, // Sexta-feira
    timeSlot: '10:00 - 11:30',
    subject: 'Imunização & PNI',
    topic: 'Calendário Nacional de Vacinação do Bebê e Idoso',
    completed: false
  },
  {
    id: 's-7',
    dayOfWeek: 6, // Sábado
    timeSlot: '09:00 - 12:00',
    subject: 'Ética e Legislação de Enfermagem',
    topic: 'Simulado Geral & Resolução COFEN 564/2017',
    completed: false
  }
];

export const INITIAL_APP_STATE: AppState = {
  questions: INITIAL_QUESTIONS,
  flashcards: INITIAL_FLASHCARDS,
  articles: INITIAL_ARTICLES,
  schedule: INITIAL_SCHEDULE,
  activities: {
    [new Date().toISOString().split('T')[0]]: {
      date: new Date().toISOString().split('T')[0],
      questionsAnswered: 8,
      correctAnswers: 7,
      minutesStudied: 45,
      flashcardsReviewed: 12
    }
  },
  bookmarks: ['q-1'],
  lastLocation: {
    tab: 'dashboard',
    itemTitle: 'Simulado de Fundamentos',
    timestamp: new Date().toISOString()
  },
  notificationSettings: {
    enabled: true,
    reminderTime: '20:00',
    frequency: 'daily',
    pushPermissionGranted: false
  },
  cloudSync: {
    autoBackup: true,
    lastSyncedAt: new Date().toISOString(),
    syncCode: 'ENF-9824-BR'
  },
  weeklyReports: [
    {
      id: 'rep-1',
      generatedAt: new Date().toISOString(),
      statsSummary: {
        totalQuestions: 28,
        accuracy: 82,
        minutesStudied: 180,
        flashcardsReviewed: 35
      },
      diagnostic: 'Ótimo desempenho em Fundamentos de Enfermagem e Legislação! Identificamos oportunidade de reforço na parte de Regra de Nägele e cálculo de vacinas.',
      prioritySubjects: ['Saúde da Mulher', 'Farmacologia - Diluições'],
      tips: [
        'Pratique diariamente 5 exercícios de gotejamento sem calculadora para fixar o tempo de prova.',
        'Utilize os flashcards SM-2 no período da noite para consolidar a memória de longo prazo.'
      ],
      recommendedScheduleFocus: 'Dedique 30 minutos extras na quarta-feira para Urgência e Emergência.'
    }
  ]
};
