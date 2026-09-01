import React, { useState } from 'react';
import { PromptItem, ContentTemplateItem, FrameworkType, UserProfile } from '../types';
import { 
  BookmarkCheck, Search, Star, Trash2, Copy, Download, ExternalLink, 
  FileText, Image as ImageIcon, Video, Filter, Lock, Sparkles 
} from 'lucide-react';

interface SavedWorkDrawerProps {
  user: UserProfile | null;
  savedPrompts: PromptItem[];
  savedTemplates: ContentTemplateItem[];
  onOpenAuthModal: () => void;
  onSelectPrompt: (prompt: PromptItem) => void;
  onSelectTemplate: (template: ContentTemplateItem) => void;
  onDeletePrompt: (id: string) => void;
  onDeleteTemplate: (id: string) => void;
  onToggleFavourite: (id: string) => void;
}

export const SavedWorkDrawer: React.FC<SavedWorkDrawerProps> = ({
  user,
  savedPrompts,
  savedTemplates,
  onOpenAuthModal,
  onSelectPrompt,
  onSelectTemplate,
  onDeletePrompt,
  onDeleteTemplate,
  onToggleFavourite,
}) => {
  const [activeTab, setActiveTab] = useState<'prompts' | 'templates' | 'favourites'>('prompts');
  const [searchQuery, setSearchQuery] = useState('');
  const [frameworkFilter, setFrameworkFilter] = useState<'ALL' | FrameworkType>('ALL');

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mx-auto shadow-sm">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Sign in with Google to View Saved Work</h2>
        <p className="text-sm text-slate-600 max-w-md mx-auto">
          Sign in to save prompts, organize custom templates, sync drafts across devices, and manage your favourites.
        </p>
        <button
          onClick={onOpenAuthModal}
          className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold px-6 py-3 rounded-xl shadow-md transition-all cursor-pointer"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>
      </div>
    );
  }

  // Filter prompts
  const filteredPrompts = savedPrompts.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.editedPrompt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFramework = frameworkFilter === 'ALL' || p.framework === frameworkFilter;
    const matchesFav = activeTab !== 'favourites' || p.isFavourite;
    return matchesSearch && matchesFramework && matchesFav;
  });

  // Filter templates
  const filteredTemplates = savedTemplates.filter(t => {
    return t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      t.category.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-2">
            <BookmarkCheck className="w-7 h-7 text-indigo-600" />
            <span>My Saved Work & History</span>
          </h1>
          <p className="text-xs text-slate-500">
            Synced with Google Account ({user.email})
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('prompts')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'prompts' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Prompts ({savedPrompts.length})
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'templates' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Templates ({savedTemplates.length})
          </button>
          <button
            onClick={() => setActiveTab('favourites')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
              activeTab === 'favourites' ? 'bg-white text-amber-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
            <span>Favourites</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search saved prompts or templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white rounded-xl border border-slate-200 text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        {activeTab !== 'templates' && (
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={frameworkFilter}
              onChange={(e) => setFrameworkFilter(e.target.value as any)}
              className="px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500"
            >
              <option value="ALL">All Frameworks</option>
              <option value="CLEAR">CLEAR (Text)</option>
              <option value="SAEALD">SAEALD (Image)</option>
              <option value="SCENE">SCENE (Video)</option>
            </select>
          </div>
        )}
      </div>

      {/* Content Grid */}
      {activeTab === 'prompts' || activeTab === 'favourites' ? (
        filteredPrompts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPrompts.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 relative group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100">
                      {p.framework}
                    </span>
                    <button
                      onClick={() => onToggleFavourite(p.id)}
                      className="p-1 text-slate-300 hover:text-amber-500 transition-colors"
                      title="Toggle Favourite"
                    >
                      <Star className={`w-4 h-4 ${p.isFavourite ? 'fill-amber-400 text-amber-500' : ''}`} />
                    </button>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 line-clamp-1">{p.title}</h3>
                  <p className="text-xs text-slate-600 line-clamp-3 font-mono bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    {p.editedPrompt}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                  <span className="text-[10px] text-slate-400">
                    {new Date(p.updatedDate).toLocaleDateString()}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onDeletePrompt(p.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onSelectPrompt(p)}
                      className="inline-flex items-center gap-1 bg-slate-900 hover:bg-slate-800 text-white font-semibold px-3 py-1.5 rounded-lg text-xs transition-all cursor-pointer"
                    >
                      <span>Open</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 space-y-3">
            <p className="text-sm text-slate-500 font-medium">No saved prompts found matching your filters.</p>
          </div>
        )
      ) : (
        filteredTemplates.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((t) => (
              <div
                key={t.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-100">
                    {t.category} Template
                  </span>

                  <h3 className="font-bold text-sm text-slate-900 line-clamp-1">{t.name}</h3>
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-xs text-slate-600 space-y-1">
                    <p className="font-semibold text-slate-800">{t.sections.length} Sections:</p>
                    <ul className="text-[11px] space-y-0.5">
                      {t.sections.slice(0, 3).map((sec, i) => (
                        <li key={i} className="truncate">• {sec.title}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                  <span className="text-[10px] text-slate-400">
                    {t.isCustom ? 'Custom Template' : 'Preset Template'}
                  </span>

                  <div className="flex items-center gap-2">
                    {t.isCustom && (
                      <button
                        onClick={() => onDeleteTemplate(t.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => onSelectTemplate(t)}
                      className="inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-3 py-1.5 rounded-lg text-xs transition-all cursor-pointer"
                    >
                      <span>Use Template</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 space-y-3">
            <p className="text-sm text-slate-500 font-medium">No templates found matching your search.</p>
          </div>
        )
      )}

    </div>
  );
};
