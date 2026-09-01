import React from 'react';
import { FrameworkType } from '../types';
import { FRAMEWORKS_DATA } from '../data/frameworksData';
import { FileText, Image as ImageIcon, Video, ArrowRight, Check } from 'lucide-react';

interface FrameworkSelectorProps {
  onSelectFramework: (framework: FrameworkType) => void;
}

export const FrameworkSelector: React.FC<FrameworkSelectorProps> = ({ onSelectFramework }) => {
  const clear = FRAMEWORKS_DATA.CLEAR;
  const saeald = FRAMEWORKS_DATA.SAEALD;
  const scene = FRAMEWORKS_DATA.SCENE;

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-10">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Select a Framework Builder
        </h1>
        <p className="text-base text-slate-600">
          Choose the prompt framework engineered for your specific creative goal.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* CLEAR */}
        <div className="bg-white rounded-2xl border border-indigo-200 p-8 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-bl-full -z-0"></div>
          
          <div className="relative z-10 space-y-6">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-lg shadow-xs">
                <FileText className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full border border-indigo-100">
                CLEAR
              </span>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900">{clear.name}</h2>
              <p className="text-xs font-semibold text-indigo-600 uppercase tracking-widest mt-0.5">
                {clear.tagline}
              </p>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                {clear.description}
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100">
              <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">Ideal for creating:</p>
              <ul className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                {clear.examples.map((ex, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <span className="truncate">{ex}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <button
            onClick={() => onSelectFramework('CLEAR')}
            className="relative z-10 mt-8 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3.5 rounded-xl shadow-md shadow-indigo-100 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Build a Text Prompt</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* SAEALD */}
        <div className="bg-white rounded-2xl border border-emerald-200 p-8 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50/50 rounded-bl-full -z-0"></div>

          <div className="relative z-10 space-y-6">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-lg shadow-xs">
                <ImageIcon className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-100">
                SAEALD
              </span>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900">{saeald.name}</h2>
              <p className="text-xs font-semibold text-emerald-600 uppercase tracking-widest mt-0.5">
                {saeald.tagline}
              </p>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                {saeald.description}
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100">
              <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">Ideal for creating:</p>
              <ul className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                {saeald.examples.map((ex, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate">{ex}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <button
            onClick={() => onSelectFramework('SAEALD')}
            className="relative z-10 mt-8 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3.5 rounded-xl shadow-md shadow-emerald-100 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Build an Image Prompt</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* SCENE */}
        <div className="bg-white rounded-2xl border border-amber-200 p-8 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50/50 rounded-bl-full -z-0"></div>

          <div className="relative z-10 space-y-6">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-lg shadow-xs">
                <Video className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider bg-amber-50 text-amber-800 px-3 py-1 rounded-full border border-amber-100">
                SCENE
              </span>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900">{scene.name}</h2>
              <p className="text-xs font-semibold text-amber-700 uppercase tracking-widest mt-0.5">
                {scene.tagline}
              </p>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                {scene.description}
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100">
              <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">Ideal for creating:</p>
              <ul className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                {scene.examples.map((ex, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span className="truncate">{ex}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <button
            onClick={() => onSelectFramework('SCENE')}
            className="relative z-10 mt-8 w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3.5 rounded-xl shadow-md shadow-amber-100 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Build a Video Prompt</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
