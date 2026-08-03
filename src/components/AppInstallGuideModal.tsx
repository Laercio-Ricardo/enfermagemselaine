import React, { useState } from 'react';
import {
  Smartphone,
  Download,
  Share,
  PlusSquare,
  MoreVertical,
  CheckCircle2,
  ExternalLink,
  Laptop,
  Store,
  Sparkles,
  Zap,
  QrCode,
  Globe,
  ArrowUpRight,
  ShieldCheck,
  X
} from 'lucide-react';

interface AppInstallGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  deferredPrompt?: any;
  onInstallDirect?: () => void;
  isInstalled?: boolean;
}

export const AppInstallGuideModal: React.FC<AppInstallGuideModalProps> = ({
  isOpen,
  onClose,
  deferredPrompt,
  onInstallDirect,
  isInstalled,
}) => {
  const [activePlatform, setActivePlatform] = useState<'qr' | 'shortcut' | 'android' | 'ios' | 'desktop'>('qr');

  if (!isOpen) return null;

  const currentAppUrl = window.location.href;
  const isInIframe = window.self !== window.top;

  // Open in new tab (outside iframe) so browser native install bar appears
  const handleOpenOutsideIframe = () => {
    window.open(currentAppUrl, '_blank');
  };

  // Download a .url desktop/phone shortcut
  const handleDownloadShortcut = () => {
    const urlFileContent = `[InternetShortcut]\nURL=${currentAppUrl}\nIconIndex=0`;
    const blob = new Blob([urlFileContent], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'Enfermagem_Pro.url';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Simple QR Code API URL for mobile camera scan
  const qrCodeImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
    currentAppUrl
  )}`;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6 my-8 animate-scale-up">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-rose-600/10 text-rose-600 dark:text-rose-400 border border-rose-600/20">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white font-display">
                Instalação e Acesso Fácil no Celular / PC
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Escolha o método mais rápido para salvar o Enfermagem Pro no seu dispositivo!
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold text-2xl p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Highlight Banner 1: Open Outside Iframe Button (Solves the Netlify/iFrame Install Issue) */}
        {isInIframe && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-700 text-white shadow-lg space-y-2">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span className="font-extrabold text-xs">Abrir em Nova Aba (Habilita Botão de Instalar)</span>
            </div>
            <p className="text-xs text-rose-100 leading-relaxed">
              Como você está visualizando dentro do pré-visualizador, os navegadores bloqueiam o botão automático. Clique abaixo para abrir no navegador padrão e instalar em 1 clique:
            </p>
            <button
              onClick={handleOpenOutsideIframe}
              className="mt-2 w-full py-2.5 px-4 rounded-xl bg-white text-rose-700 hover:bg-rose-50 font-extrabold text-xs shadow-md transition-all flex items-center justify-center space-x-2"
            >
              <ArrowUpRight className="w-4 h-4 text-rose-600" />
              <span>Abrir Fora do Visualizador (Navegador Cheio)</span>
            </button>
          </div>
        )}

        {/* Direct PWA Prompt if Available */}
        {deferredPrompt && (
          <div className="p-4 rounded-2xl bg-emerald-600 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <p className="font-extrabold text-sm flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                <span>Instalação Automática Pronta!</span>
              </p>
              <p className="text-xs text-emerald-100 mt-0.5">
                Seu navegador oferece suporte à instalação PWA direta.
              </p>
            </div>
            <button
              onClick={onInstallDirect}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white text-emerald-800 hover:bg-emerald-50 font-extrabold text-xs shadow-md transition-all flex items-center justify-center space-x-2 shrink-0"
            >
              <Download className="w-4 h-4 text-emerald-600" />
              <span>Instalar Agora</span>
            </button>
          </div>
        )}

        {/* Navigation Methods */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 bg-slate-100 dark:bg-slate-950 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800/80">
          <button
            onClick={() => setActivePlatform('qr')}
            className={`py-2 px-2 rounded-xl text-[11px] font-bold transition-all flex items-center justify-center space-x-1 ${
              activePlatform === 'qr'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>1. QR Code</span>
          </button>

          <button
            onClick={() => setActivePlatform('shortcut')}
            className={`py-2 px-2 rounded-xl text-[11px] font-bold transition-all flex items-center justify-center space-x-1 ${
              activePlatform === 'shortcut'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>2. Baixar Atalho</span>
          </button>

          <button
            onClick={() => setActivePlatform('android')}
            className={`py-2 px-2 rounded-xl text-[11px] font-bold transition-all flex items-center justify-center space-x-1 ${
              activePlatform === 'android'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>3. Android</span>
          </button>

          <button
            onClick={() => setActivePlatform('ios')}
            className={`py-2 px-2 rounded-xl text-[11px] font-bold transition-all flex items-center justify-center space-x-1 ${
              activePlatform === 'ios'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Share className="w-3.5 h-3.5" />
            <span>4. iPhone (iOS)</span>
          </button>

          <button
            onClick={() => setActivePlatform('desktop')}
            className={`py-2 px-2 rounded-xl text-[11px] font-bold transition-all flex items-center justify-center space-x-1 ${
              activePlatform === 'desktop'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Laptop className="w-3.5 h-3.5" />
            <span>5. PC / Mac</span>
          </button>
        </div>

        {/* Option 1: QR Code Scanner */}
        {activePlatform === 'qr' && (
          <div className="space-y-4 text-xs text-slate-700 dark:text-slate-300">
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-slate-800 border border-rose-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-2 text-center sm:text-left">
                <span className="font-extrabold text-sm text-slate-900 dark:text-white block">
                  Abra no Celular Apontando a Câmera
                </span>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  Apunte a câmera do seu celular para este QR Code. O aplicativo abrirá imediatamente no seu navegador móvel, permitindo salvar na tela inicial com 1 toque!
                </p>
                <button
                  onClick={handleOpenOutsideIframe}
                  className="mt-2 text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline inline-flex items-center space-x-1"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Ou copiar/abrir link direto</span>
                </button>
              </div>

              <div className="bg-white p-3 rounded-2xl shadow-md border border-slate-200 shrink-0">
                <img
                  src={qrCodeImageUrl}
                  alt="QR Code Enfermagem Pro"
                  className="w-36 h-36 object-contain"
                />
              </div>
            </div>
          </div>
        )}

        {/* Option 2: Shortcut Download */}
        {activePlatform === 'shortcut' && (
          <div className="space-y-4 text-xs text-slate-700 dark:text-slate-300">
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center space-x-2">
                <Download className="w-4 h-4 text-rose-600" />
                <span>Baixar Ícone de Atalho Direto (.URL)</span>
              </h4>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Clique no botão abaixo para baixar um arquivo de atalho que cria um ícone do <strong>Enfermagem Pro</strong> diretamente na Área de Trabalho do seu computador ou na pasta de arquivos do seu celular.
              </p>
              <button
                onClick={handleDownloadShortcut}
                className="w-full py-3 px-4 rounded-xl bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 font-extrabold text-xs shadow-md transition-all flex items-center justify-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Baixar Atalho "Enfermagem Pro.url"</span>
              </button>
            </div>
          </div>
        )}

        {/* Option 3: Android */}
        {activePlatform === 'android' && (
          <div className="space-y-3 text-xs text-slate-700 dark:text-slate-300">
            <p className="font-bold text-slate-900 dark:text-white">Instalação no Android (Google Chrome):</p>
            <ol className="space-y-2 font-medium">
              <li className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-start space-x-2">
                <span className="w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0">1</span>
                <span>Abra o app pelo navegador Google Chrome no celular.</span>
              </li>
              <li className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-start space-x-2">
                <span className="w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0">2</span>
                <span>Toque nos <strong>3 pontinhos</strong> no canto superior direito do Chrome.</span>
              </li>
              <li className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-start space-x-2">
                <span className="w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0">3</span>
                <span>Selecione <strong>"Instalar aplicativo"</strong> ou <strong>"Adicionar à tela inicial"</strong>.</span>
              </li>
            </ol>
          </div>
        )}

        {/* Option 4: iOS iPhone */}
        {activePlatform === 'ios' && (
          <div className="space-y-3 text-xs text-slate-700 dark:text-slate-300">
            <p className="font-bold text-slate-900 dark:text-white">Instalação no iPhone / iPad (Safari):</p>
            <ol className="space-y-2 font-medium">
              <li className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-start space-x-2">
                <span className="w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0">1</span>
                <span>Abra o site usando obrigatoriamente o navegador <strong>Safari</strong> no iPhone.</span>
              </li>
              <li className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-start space-x-2">
                <span className="w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0">2</span>
                <span>Toque no botão <strong>Compartilhar</strong> (ícone de quadrado com seta no rodapé do Safari).</span>
              </li>
              <li className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-start space-x-2">
                <span className="w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0">3</span>
                <span>Role a lista e toque em <strong>"Adicionar à Tela de Início"</strong>.</span>
              </li>
            </ol>
          </div>
        )}

        {/* Option 5: Desktop */}
        {activePlatform === 'desktop' && (
          <div className="space-y-3 text-xs text-slate-700 dark:text-slate-300">
            <p className="font-bold text-slate-900 dark:text-white">Instalação no Computador (Chrome / Edge):</p>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              No topo do seu navegador, na barra de endereços (onde fica o site), clique no ícone de <strong>instalar monitor</strong> ou no menu de 3 pontinhos &gt; "Salvar e Compartilhar" &gt; "Instalar Enfermagem Pro".
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
          <span className="text-[11px] text-slate-400 flex items-center space-x-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>PWA Seguro e Leve sem Ocupar Memória</span>
          </span>
          <button
            onClick={onClose}
            className="bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-md transition-all"
          >
            Entendi!
          </button>
        </div>

      </div>
    </div>
  );
};
