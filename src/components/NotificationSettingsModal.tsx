import React, { useState } from 'react';
import { Bell, Check, Clock, Sparkles, Volume2 } from 'lucide-react';
import { requestNotificationPermission, sendLocalNotification } from '../utils/notifications';

interface NotificationSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: {
    enabled: boolean;
    reminderTime: string;
    frequency: 'daily' | 'weekdays' | 'custom';
    pushPermissionGranted: boolean;
  };
  onUpdateSettings: (newSettings: any) => void;
}

export const NotificationSettingsModal: React.FC<NotificationSettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}) => {
  const [time, setTime] = useState(settings.reminderTime || '20:00');
  const [enabled, setEnabled] = useState(settings.enabled);
  const [testSuccess, setTestSuccess] = useState(false);

  if (!isOpen) return null;

  const handleRequestPermission = async () => {
    const granted = await requestNotificationPermission();
    onUpdateSettings({ ...settings, pushPermissionGranted: granted });
    if (granted) {
      sendLocalNotification('🔔 Notificações Ativas!', {
        body: 'Você receberá lembretes diários para seus estudos de Enfermagem.',
      });
      setTestSuccess(true);
      setTimeout(() => setTestSuccess(false), 3000);
    }
  };

  const handleTestNotification = () => {
    sendLocalNotification('👩‍⚕️ Hora do Estudo - Enfermagem Pro!', {
      body: 'Sua meta diária de questões de concursos e flashcards está aguardando você.',
    });
    setTestSuccess(true);
    setTimeout(() => setTestSuccess(false), 3000);
  };

  const handleSave = () => {
    onUpdateSettings({
      ...settings,
      enabled,
      reminderTime: time,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-700 space-y-6 animate-scale-up">
        
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-4">
          <div className="flex items-center space-x-2">
            <Bell className="w-6 h-6 text-amber-500" />
            <h3 className="text-lg font-extrabold text-slate-800 dark:text-white">
              Lembretes & Notificações Push
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 font-bold text-xl">
            ×
          </button>
        </div>

        <div className="space-y-4">
          {/* Toggle */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
            <div>
              <p className="text-xs font-bold text-slate-800 dark:text-white">Ativar Lembretes Diários</p>
              <p className="text-[11px] text-slate-500">Notificação personalizada no horário escolhido</p>
            </div>
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
              className="w-5 h-5 accent-emerald-600 cursor-pointer"
            />
          </div>

          {/* Timepicker */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Horário Preferido do Lembrete:
            </label>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-slate-400" />
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm font-semibold"
              />
            </div>
          </div>

          {/* Test or Request Permission */}
          <div className="space-y-2 pt-2">
            <button
              onClick={handleRequestPermission}
              className="w-full bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 dark:hover:bg-amber-900/80 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 font-bold text-xs py-2.5 px-4 rounded-xl transition-all flex items-center justify-center space-x-2"
            >
              <Bell className="w-4 h-4" />
              <span>Solicitar Permissão de Notificação Push</span>
            </button>

            <button
              onClick={handleTestNotification}
              className="w-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-semibold text-xs py-2 px-4 rounded-xl transition-all flex items-center justify-center space-x-1.5"
            >
              <Volume2 className="w-4 h-4" />
              <span>Testar Notificação Agora</span>
            </button>

            {testSuccess && (
              <p className="text-center text-xs font-semibold text-emerald-600">
                ✅ Notificação enviada com sucesso!
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-3 border-t border-slate-100 dark:border-slate-700 pt-4">
          <button onClick={onClose} className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2 rounded-xl shadow-md"
          >
            Salvar Preferências
          </button>
        </div>

      </div>
    </div>
  );
};
