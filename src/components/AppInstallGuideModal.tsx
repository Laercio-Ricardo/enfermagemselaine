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
  Globe
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
  const [activePlatform, setActivePlatform] = useState<'android' | 'ios' | 'desktop' | 'store'>('android');

  if (!isOpen) return null;

  const isInIframe = window.self !== window.top;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6 my-8 animate-scale-up">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white font-display">
                Instalar Aplicativo (PWA)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Acesse como aplicativo no celular ou computador, inclusive offline!
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold text-2xl p-1"
          >
            ×
          </button>
        </div>

        {/* Direct One-Click Install Banner if prompt available */}
        {deferredPrompt ? (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <p className="font-extrabold text-sm flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Instalação Automática Pronta!</span>
              </p>
              <p className="text-xs text-teal-100 mt-0.5">
                Seu navegador oferece suporte à instalação em 1 clique.
              </p>
            </div>
            <button
              onClick={onInstallDirect}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white text-teal-800 hover:bg-teal-50 font-extrabold text-xs shadow-md transition-all flex items-center justify-center space-x-2 shrink-0"
            >
              <Download className="w-4 h-4 text-teal-600" />
              <span>Instalar Agora no Celular/PC</span>
            </button>
          </div>
        ) : isInstalled ? (
          <div className="p-3.5 rounded-2xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-300 text-xs font-bold flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" />
            <span>O aplicativo Enfermagem Pro já está instalado no seu dispositivo!</span>
          </div>
        ) : isInIframe ? (
          <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs space-y-1">
            <p className="font-bold flex items-center space-x-1.5">
              <span>💡 Nota para Instalação no Celular / Netlify:</span>
            </p>
            <p className="opacity-90">
              Para instalar direto pelo Chrome no Android ou Safari no iPhone, abra o link do seu site público (ex: <strong className="underline">selaine.netlify.app</strong>) diretamente no navegador fora do visualizador do editor.
            </p>
          </div>
        ) : null}

        {/* Platform Selection Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-100 dark:bg-slate-950 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800/80">
          <button
            onClick={() => setActivePlatform('android')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
              activePlatform === 'android'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Android</span>
          </button>

          <button
            onClick={() => setActivePlatform('ios')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
              activePlatform === 'ios'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Share className="w-4 h-4" />
            <span>iPhone (iOS)</span>
          </button>

          <button
            onClick={() => setActivePlatform('desktop')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
              activePlatform === 'desktop'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Laptop className="w-4 h-4" />
            <span>PC / Mac</span>
          </button>

          <button
            onClick={() => setActivePlatform('store')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
              activePlatform === 'store'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>Play Store / APK</span>
          </button>
        </div>

        {/* Tab 1: Android Guide */}
        {activePlatform === 'android' && (
          <div className="space-y-4 text-xs text-slate-700 dark:text-slate-300">
            <div className="p-4 rounded-2xl bg-teal-500/5 dark:bg-teal-500/10 border border-teal-500/20 flex items-center justify-between">
              <span className="font-bold text-teal-800 dark:text-teal-300 text-sm">
                Instalação PWA Direta no Android (Chrome)
              </span>
              <span className="px-2.5 py-1 rounded-full bg-teal-600 text-white text-[10px] font-extrabold uppercase tracking-wider">
                Recomendado
              </span>
            </div>

            <ol className="space-y-3 font-medium">
              <li className="flex items-start space-x-3 bg-slate-50 dark:bg-slate-950 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800">
                <span className="w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center shrink-0 font-bold text-xs">
                  1
                </span>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">Abra no Google Chrome</p>
                  <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                    Certifique-se de estar usando o navegador Chrome no seu celular Android.
                  </p>
                </div>
              </li>

              <li className="flex items-start space-x-3 bg-slate-50 dark:bg-slate-950 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800">
                <span className="w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center shrink-0 font-bold text-xs">
                  2
                </span>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white flex items-center space-x-1">
                    <span>Toque nos 3 Pontinhos no canto superior</span>
                    <MoreVertical className="w-4 h-4 text-slate-400" />
                  </p>
                  <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                    Acesse o menu de opções do navegador no topo da tela.
                  </p>
                </div>
              </li>

              <li className="flex items-start space-x-3 bg-slate-50 dark:bg-slate-950 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800">
                <span className="w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center shrink-0 font-bold text-xs">
                  3
                </span>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white flex items-center space-x-1 text-teal-600 dark:text-teal-400">
                    <Download className="w-4 h-4" />
                    <span>Selecione "Instalar aplicativo" ou "Adicionar à Tela Inicial"</span>
                  </p>
                  <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                    Pronto! O ícone do <strong className="text-slate-700 dark:text-slate-200">Enfermagem Pro</strong> vai aparecer na sua tela inicial como um app normal sem barra de navegação!
                  </p>
                </div>
              </li>
            </ol>
          </div>
        )}

        {/* Tab 2: iOS iPhone Guide */}
        {activePlatform === 'ios' && (
          <div className="space-y-4 text-xs text-slate-700 dark:text-slate-300">
            <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <span className="font-bold text-slate-900 dark:text-white text-sm">
                Instalação PWA no iPhone / iPad (Safari)
              </span>
              <span className="px-2.5 py-1 rounded-full bg-slate-700 text-white text-[10px] font-extrabold uppercase tracking-wider">
                Apple iOS
              </span>
            </div>

            <ol className="space-y-3 font-medium">
              <li className="flex items-start space-x-3 bg-slate-50 dark:bg-slate-950 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800">
                <span className="w-6 h-6 rounded-full bg-slate-800 text-white flex items-center justify-center shrink-0 font-bold text-xs">
                  1
                </span>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">Abra no Safari</p>
                  <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                    No iPhone, a instalação de webapps só funciona pelo navegador Safari padrão.
                  </p>
                </div>
              </li>

              <li className="flex items-start space-x-3 bg-slate-50 dark:bg-slate-950 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800">
                <span className="w-6 h-6 rounded-full bg-slate-800 text-white flex items-center justify-center shrink-0 font-bold text-xs">
                  2
                </span>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white flex items-center space-x-1">
                    <span>Toque no botão de Compartilhar no rodapé</span>
                    <Share className="w-4 h-4 text-blue-500" />
                  </p>
                  <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                    É o ícone de um quadrado com uma seta apontada para cima na parte inferior.
                  </p>
                </div>
              </li>

              <li className="flex items-start space-x-3 bg-slate-50 dark:bg-slate-950 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800">
                <span className="w-6 h-6 rounded-full bg-slate-800 text-white flex items-center justify-center shrink-0 font-bold text-xs">
                  3
                </span>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white flex items-center space-x-1 text-teal-600 dark:text-teal-400">
                    <PlusSquare className="w-4 h-4" />
                    <span>Role a lista e toque em "Adicionar à Tela de Início"</span>
                  </p>
                  <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                    Confirme o nome "Enfermagem Pro" e o app funcionará em tela cheia na sua tela de início!
                  </p>
                </div>
              </li>
            </ol>
          </div>
        )}

        {/* Tab 3: Desktop */}
        {activePlatform === 'desktop' && (
          <div className="space-y-4 text-xs text-slate-700 dark:text-slate-300">
            <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-900 dark:text-blue-200 font-bold text-sm">
              Instalar como Aplicativo no Computador (Windows / Mac)
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              No Google Chrome ou Microsoft Edge no PC, clique no ícone de tela de monitor/download no canto direito da barra de endereço URL ou no menu do navegador e escolha <strong className="text-slate-900 dark:text-white">"Instalar Enfermagem Pro"</strong>.
            </p>
          </div>
        )}

        {/* Tab 4: Store / APK Packaging */}
        {activePlatform === 'store' && (
          <div className="space-y-4 text-xs text-slate-700 dark:text-slate-300">
            <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-900 dark:text-purple-200">
              <h4 className="font-bold text-sm mb-1">Publicação na Google Play Store ou Geração de arquivo APK</h4>
              <p className="text-xs opacity-90">
                Para empacotar este sistema web e gerar um arquivo <strong className="font-mono">.apk</strong> ou publicar na Play Store, você pode utilizar ferramentas gratuitas de conversão PWA para Nativo:
              </p>
            </div>

            <div className="space-y-2">
              <a
                href="https://www.pwabuilder.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between hover:border-teal-500 transition-all group"
              >
                <div>
                  <p className="font-bold text-slate-900 dark:text-white group-hover:text-teal-500 flex items-center space-x-1.5">
                    <span>PWABuilder (Ferramenta da Microsoft)</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </p>
                  <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                    Insira a URL do app para gerar o pacote APK para Android e Play Store em 1 clique.
                  </p>
                </div>
              </a>

              <a
                href="https://capacitorjs.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between hover:border-teal-500 transition-all group"
              >
                <div>
                  <p className="font-bold text-slate-900 dark:text-white group-hover:text-teal-500 flex items-center space-x-1.5">
                    <span>Capacitor / Bubblewrap</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </p>
                  <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                    Transforma o código React/Vite diretamente em projeto Android Studio e Xcode.
                  </p>
                </div>
              </a>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
          <span className="text-[11px] text-slate-400 flex items-center space-x-1">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>PWA Compatível com modo offline</span>
          </span>
          <button
            onClick={onClose}
            className="bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-md transition-all"
          >
            Entendi!
          </button>
        </div>

      </div>
    </div>
  );
};
