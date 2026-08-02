import React, { useState, useRef } from 'react';
import { Image as ImageIcon, Upload, Trash2, Check, X, Sliders, Eye, Sparkles } from 'lucide-react';

interface WallpaperModalProps {
  isOpen: boolean;
  onClose: () => void;
  wallpaper: string;
  setWallpaper: (url: string) => void;
  wallpaperOpacity: number;
  setWallpaperOpacity: (val: number) => void;
  wallpaperBlur: number;
  setWallpaperBlur: (val: number) => void;
}

export const WallpaperModal: React.FC<WallpaperModalProps> = ({
  isOpen,
  onClose,
  wallpaper,
  setWallpaper,
  wallpaperOpacity,
  setWallpaperOpacity,
  wallpaperBlur,
  setWallpaperBlur,
}) => {
  const [urlInput, setUrlInput] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione um arquivo de imagem válido (JPG, PNG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Url = event.target?.result as string;
      if (base64Url) {
        setWallpaper(base64Url);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleApplyUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    setWallpaper(urlInput.trim());
    setUrlInput('');
  };

  const presetWallpapers = [
    {
      name: 'Sem Foto (Padrão)',
      url: '',
      thumb: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=300&auto=format&fit=crop&q=80',
    },
    {
      name: 'Enfermagem & Cuidado',
      url: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1600&auto=format&fit=crop&q=80',
      thumb: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=300&auto=format&fit=crop&q=80',
    },
    {
      name: 'Clínica Clean',
      url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1600&auto=format&fit=crop&q=80',
      thumb: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=300&auto=format&fit=crop&q=80',
    },
    {
      name: 'Tropical Sunset',
      url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&auto=format&fit=crop&q=80',
      thumb: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&auto=format&fit=crop&q=80',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6 my-8 animate-scale-up">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-600/10 text-rose-600 flex items-center justify-center">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white font-display">
                Papel de Parede do App
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Coloque sua foto personalizada ou imagem de fundo no aplicativo!
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Upload Action Box */}
        <div className="p-5 rounded-2xl bg-rose-50/60 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/80 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-rose-600" />
              <span className="text-sm font-bold text-slate-900 dark:text-white">
                Enviar Foto do Seu Dispositivo
              </span>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
            />
          </div>
          
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Selecione a foto no seu celular ou computador (ex: a foto que você enviou aqui na conversa) para ser o plano de fundo do aplicativo!
          </p>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-2"
          >
            <Upload className="w-4 h-4" />
            <span>Escolher Foto do Celular / Computador</span>
          </button>
        </div>

        {/* Adjustments (Opacity & Blur) if Wallpaper Active */}
        {wallpaper && (
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center space-x-1.5">
                <Sliders className="w-4 h-4 text-rose-600" />
                <span>Ajustar Transparência e Nitidez do Fundo</span>
              </span>
              <button
                onClick={() => setWallpaper('')}
                className="text-xs font-bold text-red-600 dark:text-red-400 hover:underline flex items-center space-x-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remover Foto</span>
              </button>
            </div>

            {/* Opacity Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-medium text-slate-600 dark:text-slate-300">
                <span>Visibilidade da Foto (Opacidade)</span>
                <span className="font-bold text-rose-600">{Math.round(wallpaperOpacity * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.85"
                step="0.05"
                value={wallpaperOpacity}
                onChange={(e) => setWallpaperOpacity(parseFloat(e.target.value))}
                className="w-full accent-rose-600 cursor-pointer"
              />
            </div>

            {/* Blur Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-medium text-slate-600 dark:text-slate-300">
                <span>Desfocar Fundo (Efeito Blur)</span>
                <span className="font-bold text-rose-600">{wallpaperBlur}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="12"
                step="1"
                value={wallpaperBlur}
                onChange={(e) => setWallpaperBlur(parseInt(e.target.value))}
                className="w-full accent-rose-600 cursor-pointer"
              />
            </div>
          </div>
        )}

        {/* Or Paste URL */}
        <form onSubmit={handleApplyUrl} className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
            Ou colar Link de Imagem (URL)
          </label>
          <div className="flex space-x-2">
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://exemplo.com/minha-foto.jpg"
              className="flex-1 bg-white dark:bg-slate-800 text-slate-800 dark:text-white border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs focus:outline-hidden focus:ring-2 focus:ring-rose-500 font-medium"
            />
            <button
              type="submit"
              disabled={!urlInput.trim()}
              className="px-4 py-2 bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50"
            >
              Aplicar
            </button>
          </div>
        </form>

        {/* Preset Thumbnails */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
            Ou escolha um Modelo Sugerido
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {presetWallpapers.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => setWallpaper(preset.url)}
                className={`group relative rounded-2xl overflow-hidden border-2 text-left h-20 transition-all ${
                  wallpaper === preset.url
                    ? 'border-rose-600 ring-2 ring-rose-600/30'
                    : 'border-slate-200 dark:border-slate-800 hover:border-rose-300'
                }`}
              >
                <img
                  src={preset.thumb}
                  alt={preset.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-slate-950/40 flex items-end p-1.5">
                  <span className="text-[10px] font-bold text-white drop-shadow-md leading-tight">
                    {preset.name}
                  </span>
                </div>
                {wallpaper === preset.url && (
                  <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center">
                    <Check className="w-3 h-3" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Footer Close */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 font-extrabold text-xs transition-all shadow-md"
          >
            Concluído
          </button>
        </div>

      </div>
    </div>
  );
};
