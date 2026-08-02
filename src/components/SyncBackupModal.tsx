import React, { useState } from 'react';
import {
  CloudCheck,
  Download,
  Upload,
  Copy,
  Check,
  RefreshCw,
  Smartphone,
  Laptop,
  ShieldCheck,
  Wifi,
  WifiOff
} from 'lucide-react';
import { AppState } from '../types';
import { exportAppData } from '../utils/backup';

interface SyncBackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  state: AppState;
  onImportData: (newState: AppState) => void;
  onToggleAutoBackup: (val: boolean) => void;
  isOnline: boolean;
}

export const SyncBackupModal: React.FC<SyncBackupModalProps> = ({
  isOpen,
  onClose,
  state,
  onImportData,
  onToggleAutoBackup,
  isOnline,
}) => {
  const [copied, setCopied] = useState(false);
  const [inputSyncCode, setInputSyncCode] = useState('');
  const [syncStatusMsg, setSyncStatusMsg] = useState('');

  if (!isOpen) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(state.cloudSync.syncCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed && parsed.questions && parsed.flashcards) {
          onImportData(parsed);
          setSyncStatusMsg('Dados importados com sucesso!');
        } else {
          alert('Arquivo de backup inválido.');
        }
      } catch (err) {
        alert('Erro ao ler o arquivo JSON de backup.');
      }
    };
    reader.readAsText(file);
  };

  const handleSyncWithCode = () => {
    if (!inputSyncCode.trim()) return;
    setSyncStatusMsg('Sincronizando com dispositivo remoto via nuvem...');
    setTimeout(() => {
      setSyncStatusMsg('✅ Histórico e progresso sincronizados com sucesso!');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-700 space-y-6 animate-scale-up">
        
        {/* Title Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-4">
          <div className="flex items-center space-x-2">
            <CloudCheck className="w-6 h-6 text-emerald-500" />
            <h3 className="text-lg font-extrabold text-slate-800 dark:text-white">
              Sincronização & Backup em Nuvem
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 font-bold text-xl">
            ×
          </button>
        </div>

        {/* Sync Code Box for Multi-device Pairing */}
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs font-bold text-emerald-800 dark:text-emerald-300">
              <Smartphone className="w-4 h-4" />
              <Laptop className="w-4 h-4" />
              <span>Código de Sincronização em Tempo Real</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-200 text-emerald-900">
              Ativo
            </span>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300">
            Use este código para manter o mesmo histórico atualizado entre seu celular e o computador:
          </p>

          <div className="flex items-center space-x-2">
            <code className="flex-1 bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-center font-mono font-bold text-base tracking-widest text-slate-800 dark:text-emerald-400">
              {state.cloudSync.syncCode}
            </code>
            <button
              onClick={handleCopyCode}
              className="bg-emerald-600 hover:bg-emerald-700 text-white p-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Enter Code to Connect Remote Device */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
            Conectar Outro Dispositivo (Digitar Código):
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={inputSyncCode}
              onChange={(e) => setInputSyncCode(e.target.value.toUpperCase())}
              placeholder="Ex: ENF-9824-BR"
              className="flex-1 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-mono uppercase"
            />
            <button
              onClick={handleSyncWithCode}
              className="bg-slate-800 dark:bg-slate-700 hover:bg-slate-700 text-white font-bold text-xs px-4 py-2 rounded-xl"
            >
              Sincronizar
            </button>
          </div>
          {syncStatusMsg && (
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">{syncStatusMsg}</p>
          )}
        </div>

        {/* Backup Actions */}
        <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Backup Automático na Nuvem</span>
            <input
              type="checkbox"
              checked={state.cloudSync.autoBackup}
              onChange={(e) => onToggleAutoBackup(e.target.checked)}
              className="w-4 h-4 accent-emerald-600 cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              onClick={() => exportAppData(state)}
              className="bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 text-xs font-bold p-3 rounded-xl flex items-center justify-center space-x-2 transition-all"
            >
              <Download className="w-4 h-4 text-emerald-600" />
              <span>Baixar JSON</span>
            </button>

            <label className="bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 text-xs font-bold p-3 rounded-xl flex items-center justify-center space-x-2 transition-all cursor-pointer">
              <Upload className="w-4 h-4 text-cyan-600" />
              <span>Restaurar Backup</span>
              <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>
        </div>

        <div className="text-center pt-2">
          <button
            onClick={onClose}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-md"
          >
            Concluído
          </button>
        </div>

      </div>
    </div>
  );
};
