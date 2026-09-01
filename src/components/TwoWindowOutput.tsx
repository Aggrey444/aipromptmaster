import React, { useState } from 'react';
import { FrameworkType, FormSelections, ContentTemplateItem, TemplateSection, UserProfile } from '../types';
import { DEFAULT_TEMPLATES } from '../data/templatesData';
import { 
  Copy, Check, Download, Save, Plus, Trash2, Edit2, ArrowUp, ArrowDown, 
  Sparkles, FileText, Bot, RefreshCw, Layout, ArrowLeft, BookmarkCheck 
} from 'lucide-react';

interface TwoWindowOutputProps {
  initialPrompt: string;
  selections: FormSelections;
  frameworkType: FrameworkType;
  user: UserProfile | null;
  onOpenAuthModal: () => void;
  onSavePrompt: (promptData: any) => void;
  onSaveTemplate: (templateData: ContentTemplateItem) => void;
  onBackToBuilder: () => void;
}

export const TwoWindowOutput: React.FC<TwoWindowOutputProps> = ({
  initialPrompt,
  selections,
  frameworkType,
  user,
  onOpenAuthModal,
  onSavePrompt,
  onSaveTemplate,
  onBackToBuilder,
}) => {
  // Window 1 State: Editable Prompt
  const [promptText, setPromptText] = useState(initialPrompt);
  const [promptCopied, setPromptCopied] = useState(false);
  const [promptTitle, setPromptTitle] = useState(`${frameworkType} Prompt - ${new Date().toLocaleDateString()}`);

  // Determine initial template based on framework/selections
  const defaultMatchingTemplate = React.useMemo(() => {
    const contentTypeVal = selections.c_content_type?.singleOption || selections.s_video_type?.singleOption || '';
    const match = DEFAULT_TEMPLATES.find(t => 
      t.category.toLowerCase().includes(contentTypeVal.toLowerCase()) || 
      t.frameworkType === frameworkType
    );
    return match || DEFAULT_TEMPLATES[0];
  }, [frameworkType, selections]);

  // Window 2 State: Editable Template
  const [activeTemplate, setActiveTemplate] = useState<ContentTemplateItem>(defaultMatchingTemplate);
  const [templateSections, setTemplateSections] = useState<TemplateSection[]>(defaultMatchingTemplate.sections);
  const [templateCopied, setTemplateCopied] = useState(false);
  const [templateTitle, setTemplateTitle] = useState(defaultMatchingTemplate.name);

  // Edit inline states
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);

  // Sync template sections when preset changes
  const handleSelectPresetTemplate = (tmpl: ContentTemplateItem) => {
    setActiveTemplate(tmpl);
    setTemplateSections(tmpl.sections);
    setTemplateTitle(tmpl.name);
  };

  // Add Section
  const handleAddSection = () => {
    const newSec: TemplateSection = {
      id: `sec_${Date.now()}`,
      title: `New Section ${templateSections.length + 1}`,
      placeholder: 'Enter placeholder guidelines or structural notes...',
    };
    setTemplateSections([...templateSections, newSec]);
  };

  // Remove Section
  const handleRemoveSection = (id: string) => {
    setTemplateSections(templateSections.filter(s => s.id !== id));
  };

  // Move Section Up/Down
  const handleMoveSection = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= templateSections.length) return;
    const updated = [...templateSections];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    setTemplateSections(updated);
  };

  // Update Section Title/Placeholder
  const handleUpdateSection = (id: string, field: 'title' | 'placeholder', val: string) => {
    setTemplateSections(
      templateSections.map(s => (s.id === id ? { ...s, [field]: val } : s))
    );
  };

  // Copy Window 1 Prompt
  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(promptText);
    setPromptCopied(true);
    setTimeout(() => setPromptCopied(false), 2000);
  };

  // Copy Window 2 Template
  const handleCopyTemplate = () => {
    const formatted = `${templateTitle.toUpperCase()}\n\n` + 
      templateSections.map((s, i) => `${i + 1}. ${s.title}\n${s.placeholder}`).join('\n\n');
    navigator.clipboard.writeText(formatted);
    setTemplateCopied(true);
    setTimeout(() => setTemplateCopied(false), 2000);
  };

  // Convert Template to Prompt
  const handleConvertTemplateToPrompt = () => {
    const generated = `Please generate content structured strictly according to the following template outline:\n\n` +
      `Title: ${templateTitle}\n\n` +
      templateSections.map((s, i) => `Section ${i + 1} [${s.title}]:\n- Guidelines: ${s.placeholder}`).join('\n\n');
    setPromptText(generated);
  };

  // Save Prompt
  const handleSavePromptClick = () => {
    if (!user) {
      onOpenAuthModal();
      return;
    }
    onSavePrompt({
      title: promptTitle,
      framework: frameworkType,
      selections,
      generatedPrompt: initialPrompt,
      editedPrompt: promptText,
      completenessScore: 90,
      missingFields: [],
    });
  };

  // Save Template
  const handleSaveTemplateClick = () => {
    if (!user) {
      onOpenAuthModal();
      return;
    }
    const tmpl: ContentTemplateItem = {
      id: `tmpl_user_${Date.now()}`,
      name: templateTitle,
      category: activeTemplate.category,
      frameworkType,
      sections: templateSections,
      createdDate: new Date().toISOString(),
      updatedDate: new Date().toISOString(),
      isCustom: true,
    };
    onSaveTemplate(tmpl);
  };

  // Download Prompt (.txt / .md / .json)
  const handleDownloadPrompt = (format: 'txt' | 'md' | 'json') => {
    let content = promptText;
    let mime = 'text/plain';
    if (format === 'json') {
      content = JSON.stringify({ title: promptTitle, framework: frameworkType, prompt: promptText }, null, 2);
      mime = 'application/json';
    } else if (format === 'md') {
      content = `# ${promptTitle}\n\n**Framework**: ${frameworkType}\n\n\`\`\`\n${promptText}\n\`\`\``;
      mime = 'text/markdown';
    }

    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${promptTitle.replace(/[^a-z0-9]/gi, '_')}.${format}`;
    a.click();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToBuilder}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Layout className="w-6 h-6 text-indigo-600" />
              <span>Two-Window Output Suite</span>
            </h1>
            <p className="text-xs text-slate-500">
              Separates AI Instructions (Window 1) from Structural Content Templates (Window 2)
            </p>
          </div>
        </div>

        {/* Preset Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 hidden sm:inline-block">Template Preset:</span>
          <select
            value={activeTemplate.id}
            onChange={(e) => {
              const selected = DEFAULT_TEMPLATES.find(t => t.id === e.target.value);
              if (selected) handleSelectPresetTemplate(selected);
            }}
            className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-medium bg-white text-slate-800 focus:ring-2 focus:ring-indigo-500"
          >
            {DEFAULT_TEMPLATES.map(t => (
              <option key={t.id} value={t.id}>
                {t.name} ({t.category})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Side-by-Side Two Windows */}
      <div className="grid lg:grid-cols-2 gap-8 items-start">
        
        {/* WINDOW ONE: PROMPT GENERATOR */}
        <div className="bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-xl p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                1
              </div>
              <div>
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                  Window One: Prompt Generator
                </h2>
                <p className="text-[11px] text-slate-400">Instructions to give to an AI model</p>
              </div>
            </div>

            <span className="text-xs px-2.5 py-1 rounded-md bg-indigo-900/60 border border-indigo-700 text-indigo-300 font-medium">
              {frameworkType} Framework
            </span>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400">Prompt Title:</label>
            <input
              type="text"
              value={promptTitle}
              onChange={(e) => setPromptTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-medium focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-400">Editable AI Prompt:</label>
              <button
                onClick={() => setPromptText(initialPrompt)}
                className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Revert to original</span>
              </button>
            </div>

            <textarea
              rows={12}
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs font-mono text-slate-200 leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
            />
          </div>

          {/* Window 1 Controls */}
          <div className="pt-2 border-t border-slate-800 space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleCopyPrompt}
                className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 rounded-xl text-xs transition-all cursor-pointer"
              >
                {promptCopied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                <span>{promptCopied ? 'Copied to Clipboard!' : 'Copy AI Prompt'}</span>
              </button>

              <button
                onClick={handleSavePromptClick}
                className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2.5 rounded-xl text-xs transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Prompt</span>
              </button>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
              <span>Download Options:</span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleDownloadPrompt('txt')}
                  className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono"
                >
                  .txt
                </button>
                <button
                  onClick={() => handleDownloadPrompt('md')}
                  className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono"
                >
                  .md
                </button>
                <button
                  onClick={() => handleDownloadPrompt('json')}
                  className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono"
                >
                  .json
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* WINDOW TWO: TEMPLATE GENERATOR */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                2
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Window Two: Content Template Generator
                </h2>
                <p className="text-[11px] text-slate-500">Structural layout of the intended final document</p>
              </div>
            </div>

            <span className="text-xs px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 font-medium">
              {templateSections.length} Sections
            </span>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700">Template Name:</label>
            <input
              type="text"
              value={templateTitle}
              onChange={(e) => setTemplateTitle(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Section List */}
          <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
            {templateSections.map((sec, idx) => (
              <div
                key={sec.id}
                className="bg-slate-50 rounded-xl border border-slate-200 p-3.5 space-y-2 relative hover:border-emerald-300 transition-all"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-1">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <input
                      type="text"
                      value={sec.title}
                      onChange={(e) => handleUpdateSection(sec.id, 'title', e.target.value)}
                      className="font-bold text-xs text-slate-900 bg-transparent border-b border-slate-200 focus:border-emerald-500 focus:outline-none flex-1"
                    />
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleMoveSection(idx, 'up')}
                      disabled={idx === 0}
                      className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleMoveSection(idx, 'down')}
                      disabled={idx === templateSections.length - 1}
                      className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleRemoveSection(sec.id)}
                      className="p-1 text-rose-400 hover:text-rose-600"
                      title="Delete Section"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <textarea
                  rows={2}
                  value={sec.placeholder}
                  onChange={(e) => handleUpdateSection(sec.id, 'placeholder', e.target.value)}
                  className="w-full text-xs text-slate-600 bg-white border border-slate-200 rounded-lg p-2 focus:ring-1 focus:ring-emerald-500"
                  placeholder="Section guidelines..."
                />
              </div>
            ))}
          </div>

          <button
            onClick={handleAddSection}
            className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl border border-dashed border-slate-300 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4 text-emerald-600" />
            <span>Add New Template Section</span>
          </button>

          {/* Window 2 Controls */}
          <div className="pt-2 border-t border-slate-200 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleCopyTemplate}
                className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 rounded-xl text-xs transition-all cursor-pointer"
              >
                {templateCopied ? <Check className="w-4 h-4 text-emerald-200" /> : <Copy className="w-4 h-4" />}
                <span>{templateCopied ? 'Template Copied!' : 'Copy Template'}</span>
              </button>

              <button
                onClick={handleSaveTemplateClick}
                className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2.5 rounded-xl text-xs transition-all cursor-pointer"
              >
                <BookmarkCheck className="w-4 h-4 text-emerald-400" />
                <span>Save Template</span>
              </button>
            </div>

            <button
              onClick={handleConvertTemplateToPrompt}
              className="w-full py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-xl border border-indigo-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Convert Template Structure into AI Prompt</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
