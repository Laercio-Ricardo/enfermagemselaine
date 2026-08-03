import React, { useState } from 'react';
import {
  Smartphone,
  Sparkles,
  Download,
  Code2,
  CheckCircle2,
  ExternalLink,
  Copy,
  Check,
  Play,
  X,
  Layers,
  Rocket
} from 'lucide-react';

interface AndroidExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPreviewSplash: () => void;
}

export const AndroidExportModal: React.FC<AndroidExportModalProps> = ({
  isOpen,
  onClose,
  onPreviewSplash,
}) => {
  const [activeTab, setActiveTab] = useState<'pwabuilder' | 'capacitor' | 'splash'>('pwabuilder');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleCopyCode = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const capacitorCommands = [
    `# 1. Instalar dependências do Capacitor
npm install @capacitor/core @capacitor/cli @capacitor/android

# 2. Inicializar o projeto Android
npx cap init "Enfermagem Pro" "com.laercio.enfermagempro"

# 3. Gerar a build Web de produção
npm run build

# 4. Adicionar o módulo nativo Android
npx cap add android

# 5. Abrir no Android Studio para gerar o APK assinado
npx cap open android`
  ];

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
                Como Gerar o APK Android
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Guia completo para transformar o Enfermagem Pro em App Nativo de Celular (.APK)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Button: Test Splash Screen */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-700 text-white shadow-lg flex items-center justify-between gap-3">
          <div className="space-y-0.5">
            <span className="font-extrabold text-xs flex items-center space-x-1">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Splash Screen Personalizada Incluída!</span>
            </span>
            <p className="text-[11px] text-rose-100">
              Contém a dedicação especial: <em>"Criado por Laércio Ricardo para Gisselaine"</em>.
            </p>
          </div>
          <button
            onClick={() => {
              onClose();
              onPreviewSplash();
            }}
            className="px-4 py-2 rounded-xl bg-white text-rose-700 hover:bg-rose-50 font-extrabold text-xs shadow-md transition-all flex items-center space-x-1.5 shrink-0"
          >
            <Play className="w-3.5 h-3.5 fill-rose-600" />
            <span>Testar Splash Agora</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="grid grid-cols-3 gap-2 bg-slate-100 dark:bg-slate-950 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setActiveTab('pwabuilder')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
              activeTab === 'pwabuilder'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Rocket className="w-4 h-4" />
            <span>Método 1: 1-Clique (PWABuilder)</span>
          </button>

          <button
            onClick={() => setActiveTab('capacitor')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
              activeTab === 'capacitor'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>Método 2: Capacitor (Nativo)</span>
          </button>

          <button
            onClick={() => setActiveTab('splash')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
              activeTab === 'splash'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Configurar Splash Nativa</span>
          </button>
        </div>

        {/* Tab 1: PWABuilder (Easiest) */}
        {activeTab === 'pwabuilder' && (
          <div className="space-y-4 text-xs text-slate-700 dark:text-slate-300">
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-slate-800 border border-rose-200 dark:border-slate-700 space-y-3">
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center space-x-2">
                <Rocket className="w-4 h-4 text-rose-600" />
                <span>O Caminho Mais Rápido (Sem Codificar)</span>
              </h4>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                Você pode converter esta URL publica em um arquivo <strong>.APK (ou .AAB para a Google Play Store)</strong> em menos de 2 minutos usando a ferramenta oficial da Microsoft (PWABuilder):
              </p>

              <ol className="space-y-2 font-medium">
                <li className="flex items-start space-x-2">
                  <span className="w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">1</span>
                  <span>Acesse o site gratuito <strong>pwabuilder.com</strong></span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">2</span>
                  <span>Cole a URL do seu aplicativo e clique em <strong>"Start"</strong></span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">3</span>
                  <span>Clique no botão <strong>"Package for Android"</strong> e baixe o arquivo <strong>.apk</strong> gerado para instalar direto no seu celular!</span>
                </li>
              </ol>

              <a
                href="https://www.pwabuilder.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs transition-all shadow-md mt-2"
              >
                <span>Abrir PWABuilder.com</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        )}

        {/* Tab 2: Capacitor (Full Native Android Studio) */}
        {activeTab === 'capacitor' && (
          <div className="space-y-4 text-xs text-slate-700 dark:text-slate-300">
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Para gerar um projeto Android profissional no <strong>Android Studio</strong> com suporte a ícone nativo e câmera/notificações:
            </p>

            <div className="relative">
              <pre className="p-4 rounded-2xl bg-slate-950 text-emerald-400 font-mono text-[11px] overflow-x-auto leading-relaxed border border-slate-800">
                {capacitorCommands[0]}
              </pre>
              <button
                onClick={() => handleCopyCode(capacitorCommands[0], 0)}
                className="absolute top-3 right-3 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors flex items-center space-x-1"
              >
                {copiedIndex === 0 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedIndex === 0 ? 'Copiado!' : 'Copiar'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: Splash Screen Details */}
        {activeTab === 'splash' && (
          <div className="space-y-4 text-xs text-slate-700 dark:text-slate-300">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-rose-600" />
                <span>Como funciona a Tela de Abertura (Splash)</span>
              </h4>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Nós já integramos a <strong>Splash Screen nativa em React</strong> no código do seu aplicativo! Quando o usuário abre o aplicativo:
              </p>
              <ul className="space-y-2 list-disc list-inside font-medium text-slate-700 dark:text-slate-300">
                <li>O fundo em gradiente Carmim surge suavemente com brilhos em névoa.</li>
                <li>O estetoscópio central com efeito neon e título <strong>Enfermagem Pro</strong> é exibido.</li>
                <li>Exibe o crédito: <strong>"Desenvolvido por Laércio Ricardo • Oferecido com amor para Gisselaine"</strong>.</li>
                <li>Após 2.5 segundos, a tela de abertura desliza suavemente para dar lugar ao painel.</li>
              </ul>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={() => {
              onClose();
              onPreviewSplash();
            }}
            className="text-xs font-extrabold text-rose-600 dark:text-rose-400 hover:underline flex items-center space-x-1"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Ver a Splash Screen de Novo</span>
          </button>

          <button
            onClick={onClose}
            className="bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 font-extrabold text-xs px-6 py-2.5 rounded-xl shadow-md transition-all"
          >
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
};
