import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  CheckCircle2,
  Circle,
  ExternalLink,
  Download,
  Plus,
  Clock,
  BookOpen,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { ScheduleItem, SubjectCategory } from '../types';
import { getGoogleCalendarUrl, downloadIcsSchedule } from '../utils/calendar';

interface ScheduleModuleProps {
  schedule: ScheduleItem[];
  onToggleScheduleItem: (itemId: string) => void;
  onAddScheduleItem: (newItem: ScheduleItem) => void;
}

const DAYS_OF_WEEK = [
  'Domingo',
  'Segunda-Feira',
  'Terça-Feira',
  'Quarta-Feira',
  'Quinta-Feira',
  'Sexta-Feira',
  'Sábado',
];

export const ScheduleModule: React.FC<ScheduleModuleProps> = ({
  schedule,
  onToggleScheduleItem,
  onAddScheduleItem,
}) => {
  const [selectedDay, setSelectedDay] = useState<number>(new Date().getDay() === 0 ? 1 : new Date().getDay());
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // New item form
  const [newDay, setNewDay] = useState<number>(1);
  const [newTime, setNewTime] = useState<string>('09:00 - 10:30');
  const [newSubject, setNewSubject] = useState<SubjectCategory>('Fundamentos de Enfermagem');
  const [newTopic, setNewTopic] = useState<string>('');

  const itemsForSelectedDay = schedule.filter((item) => item.dayOfWeek === selectedDay);

  const handleAddItem = () => {
    if (!newTopic.trim()) return;
    const newItem: ScheduleItem = {
      id: `s-${Date.now()}`,
      dayOfWeek: newDay,
      timeSlot: newTime,
      subject: newSubject,
      topic: newTopic,
      completed: false,
    };
    onAddScheduleItem(newItem);
    setNewTopic('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-800 dark:text-white flex items-center space-x-2">
            <CalendarIcon className="w-6 h-6 text-cyan-600" />
            <span>Cronograma Semanal de Estudos</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Planejamento estruturado para Técnica em Enfermagem com integração direta ao Google Agenda.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => downloadIcsSchedule(schedule)}
            className="bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-semibold text-xs py-2.5 px-4 rounded-xl transition-all flex items-center space-x-1.5"
            title="Baixar arquivo .ics para importar no Google Agenda ou Apple Calendar"
          >
            <Download className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            <span>Exportar .ICS</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-md transition-all flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar Matéria</span>
          </button>
        </div>
      </div>

      {/* Days Tabs Header */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
        {[1, 2, 3, 4, 5, 6, 0].map((dayNum) => {
          const count = schedule.filter((s) => s.dayOfWeek === dayNum).length;
          const completedCount = schedule.filter((s) => s.dayOfWeek === dayNum && s.completed).length;
          const isToday = new Date().getDay() === dayNum;
          const isSelected = selectedDay === dayNum;

          return (
            <button
              key={dayNum}
              onClick={() => setSelectedDay(dayNum)}
              className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-between space-y-1 ${
                isSelected
                  ? 'bg-cyan-600 text-white border-cyan-600 shadow-md font-bold'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-cyan-400'
              }`}
            >
              <div className="flex items-center space-x-1">
                <span className="text-xs">{DAYS_OF_WEEK[dayNum].split('-')[0]}</span>
                {isToday && (
                  <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-amber-300' : 'bg-cyan-500'}`} />
                )}
              </div>
              <span className={`text-[10px] ${isSelected ? 'text-cyan-100' : 'text-slate-400'}`}>
                {completedCount}/{count} concluídos
              </span>
            </button>
          );
        })}
      </div>

      {/* Study Sessions List for Selected Day */}
      <div className="bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
          <h2 className="text-base font-bold text-slate-800 dark:text-white flex items-center space-x-2">
            <Clock className="w-5 h-5 text-cyan-600" />
            <span>Matérias de {DAYS_OF_WEEK[selectedDay]}</span>
          </h2>
          <span className="text-xs text-slate-400">
            {itemsForSelectedDay.length} sessão(ões) agendada(s)
          </span>
        </div>

        {itemsForSelectedDay.length === 0 ? (
          <div className="text-center py-10 text-slate-400 text-xs space-y-2">
            <p>Nenhuma sessão de estudo cadastrada para este dia.</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="text-cyan-600 font-semibold hover:underline"
            >
              + Adicionar sessão de estudo
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {itemsForSelectedDay.map((item) => {
              const googleCalUrl = getGoogleCalendarUrl(item);

              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    item.completed
                      ? 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 opacity-75'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-cyan-300'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <button
                      onClick={() => onToggleScheduleItem(item.id)}
                      className="mt-0.5 text-slate-400 hover:text-emerald-600 transition-colors"
                    >
                      {item.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </button>

                    <div>
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                          item.completed ? 'bg-slate-200 text-slate-600' : 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300'
                        }`}>
                          {item.subject}
                        </span>
                        <span className="text-xs text-slate-400 flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{item.timeSlot}</span>
                        </span>
                      </div>
                      <h3 className={`text-sm font-bold mt-1 ${item.completed ? 'line-through text-slate-400' : 'text-slate-800 dark:text-white'}`}>
                        {item.topic}
                      </h3>
                    </div>
                  </div>

                  {/* Google Calendar Direct Link Button */}
                  <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                    <a
                      href={googleCalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-xs font-semibold transition-all"
                      title="Adicionar evento no Google Agenda"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
                      <span>Google Calendar</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4 animate-scale-up">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Adicionar Matéria ao Cronograma</h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Dia da Semana:
                </label>
                <select
                  value={newDay}
                  onChange={(e) => setNewDay(Number(e.target.value))}
                  className="w-full bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm"
                >
                  {DAYS_OF_WEEK.map((d, idx) => (
                    <option key={idx} value={idx}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Horário (ex: 08:00 - 09:30):
                </label>
                <input
                  type="text"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Matéria de Enfermagem:
                </label>
                <select
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value as SubjectCategory)}
                  className="w-full bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm"
                >
                  <option value="Fundamentos de Enfermagem">Fundamentos de Enfermagem</option>
                  <option value="Farmacologia">Farmacologia</option>
                  <option value="Saúde Pública & SUS">Saúde Pública & SUS</option>
                  <option value="Enfermagem Médico-Cirúrgica & Urgência">Urgência & Cirúrgica</option>
                  <option value="Saúde da Mulher e da Criança">Saúde Mulher & Criança</option>
                  <option value="Ética e Legislação de Enfermagem">Ética e Legislação</option>
                  <option value="Imunização & PNI">Imunização & PNI</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Tópico / Conteúdo a Estudar:
                </label>
                <input
                  type="text"
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                  placeholder="ex: Cálculo de gotejamento de soro, Código de Ética..."
                  className="w-full bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-3">
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
                Cancelar
              </button>
              <button
                onClick={handleAddItem}
                className="bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold px-5 py-2 rounded-xl shadow-md"
              >
                Salvar Sessão
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
