import React, { useState, useEffect, useMemo } from 'react';
import { FrameworkType, FormSelections, UserProfile, Question } from '../types';
import { FRAMEWORKS_DATA } from '../data/frameworksData';
import { assemblePrompt } from '../utils/promptAssembler';
import { calculateQualityScore } from '../utils/qualityChecker';
import { saveDraft, getDraft } from '../utils/storage';
import { 
  ChevronLeft, ChevronRight, Copy, Check, Save, Download, Sparkles, 
  RotateCcw, Eye, ArrowRight, Upload, X, AlertCircle, FileText, Layout
} from 'lucide-react';

interface PromptBuilderProps {
  frameworkType: FrameworkType;
  user: UserProfile | null;
  onOpenAuthModal: () => void;
  onSavePrompt: (promptData: {
    title: string;
    framework: FrameworkType;
    selections: FormSelections;
    generatedPrompt: string;
    editedPrompt: string;
    completenessScore: number;
    missingFields: string[];
  }) => void;
  onGoToOutput: (prompt: string, selections: FormSelections, framework: FrameworkType) => void;
  onBackToSelector: () => void;
}

export const PromptBuilder: React.FC<PromptBuilderProps> = ({
  frameworkType,
  user,
  onOpenAuthModal,
  onSavePrompt,
  onGoToOutput,
  onBackToSelector,
}) => {
  const framework = FRAMEWORKS_DATA[frameworkType];
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [selections, setSelections] = useState<FormSelections>({});
  const [copied, setCopied] = useState(false);
  const [mobilePreviewOpen, setMobilePreviewOpen] = useState(false);
  const [aiEnhancing, setAiEnhancing] = useState(false);
  const [aiEnhancedResult, setAiEnhancedResult] = useState<string | null>(null);
  const [customPromptTitle, setCustomPromptTitle] = useState('');

  // Load draft if available
  useEffect(() => {
    const saved = getDraft(`builder_${frameworkType}`);
    if (saved && Object.keys(saved).length > 0) {
      setSelections(saved);
    }
  }, [frameworkType]);

  // Auto-save draft on selections change
  const handleSelectionChange = (newSelections: FormSelections) => {
    setSelections(newSelections);
    saveDraft(`builder_${frameworkType}`, newSelections);
  };

  const currentSection = framework.sections[activeSectionIndex];

  // Assembled Prompt
  const liveAssembledPrompt = useMemo(() => {
    if (aiEnhancedResult) return aiEnhancedResult;
    return assemblePrompt(frameworkType, selections);
  }, [frameworkType, selections, aiEnhancedResult]);

  // Quality Score
  const quality = useMemo(() => {
    return calculateQualityScore(frameworkType, selections);
  }, [frameworkType, selections]);

  // Checkbox Handler
  const handleCheckboxChange = (questionId: string, optionLabel: string, checked: boolean) => {
    const current = selections[questionId]?.selectedOptions || [];
    let updated: string[];
    if (checked) {
      updated = [...current, optionLabel];
    } else {
      updated = current.filter(o => o !== optionLabel);
    }
    handleSelectionChange({
      ...selections,
      [questionId]: {
        ...selections[questionId],
        selectedOptions: updated,
      },
    });
  };

  // Radio Handler
  const handleRadioChange = (questionId: string, optionLabel: string) => {
    handleSelectionChange({
      ...selections,
      [questionId]: {
        ...selections[questionId],
        singleOption: optionLabel,
      },
    });
  };

  // Text/Textarea Handler
  const handleTextChange = (questionId: string, value: string) => {
    handleSelectionChange({
      ...selections,
      [questionId]: {
        ...selections[questionId],
        customText: value,
      },
    });
  };

  // Custom "Other" Option Handler
  const handleCustomOtherChange = (questionId: string, value: string) => {
    handleSelectionChange({
      ...selections,
      [questionId]: {
        ...selections[questionId],
        customOther: value,
      },
    });
  };

  // File Attachment Handler
  const handleFileUpload = (questionId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleSelectionChange({
          ...selections,
          [questionId]: {
            ...selections[questionId],
            fileName: file.name,
            fileData: reader.result as string,
          },
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove File Attachment
  const handleRemoveFile = (questionId: string) => {
    const updated = { ...selections };
    if (updated[questionId]) {
      delete updated[questionId].fileName;
      delete updated[questionId].fileData;
    }
    handleSelectionChange(updated);
  };

  // Reset Selections
  const handleReset = () => {
    setSelections({});
    setAiEnhancedResult(null);
    saveDraft(`builder_${frameworkType}`, {});
  };

  // Copy Prompt
  const handleCopy = () => {
    navigator.clipboard.writeText(liveAssembledPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // AI Enhance Call
  const handleAiEnhance = async () => {
    if (!liveAssembledPrompt || liveAssembledPrompt.trim().length < 10) return;
    setAiEnhancing(true);
    try {
      const res = await fetch('/api/ai-enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: liveAssembledPrompt, framework: frameworkType }),
      });
      const data = await res.json();
      if (data.enhancedPrompt) {
        setAiEnhancedResult(data.enhancedPrompt);
      } else if (data.error) {
        alert(data.error);
      }
    } catch (err) {
      console.error('AI enhance failed:', err);
      alert('Could not enhance prompt via AI. Please check server status.');
    } finally {
      setAiEnhancing(false);
    }
  };

  // Save Prompt
  const handleSave = () => {
    if (!user) {
      onOpenAuthModal();
      return;
    }
    const defaultTitle = `${frameworkType} Prompt - ${new Date().toLocaleDateString()}`;
    const titleToUse = customPromptTitle.trim() || defaultTitle;
    onSavePrompt({
      title: titleToUse,
      framework: frameworkType,
      selections,
      generatedPrompt: liveAssembledPrompt,
      editedPrompt: liveAssembledPrompt,
      completenessScore: quality.score,
      missingFields: quality.missingFields,
    });
  };

  // Download Prompt
  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([liveAssembledPrompt], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${frameworkType}_prompt_${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToSelector}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            title="Back to Frameworks"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700">
                {framework.acronym}
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{framework.name}</h1>
            </div>
            <p className="text-xs text-slate-500">{framework.tagline} • Guided Checkbox & Selection Engine</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Selections</span>
          </button>

          <button
            onClick={() => onGoToOutput(liveAssembledPrompt, selections, frameworkType)}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-xl shadow-sm transition-all cursor-pointer"
          >
            <Layout className="w-4 h-4" />
            <span>Open Two-Window View</span>
          </button>
        </div>
      </div>

      {/* Main 3-Column Desktop / Mobile Wizard Layout */}
      <div className="grid lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Panel: Framework Navigation Steps (3 Cols) */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-2">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider px-3 py-1">
            Framework Letters
          </p>
          <div className="space-y-1">
            {framework.sections.map((sec, idx) => {
              const isActive = idx === activeSectionIndex;
              // Check if section has filled answers
              const isAnswered = sec.questions.some(q => {
                const sel = selections[q.id];
                return sel && (sel.singleOption || (sel.selectedOptions && sel.selectedOptions.length > 0) || sel.customText);
              });

              return (
                <button
                  key={idx}
                  onClick={() => setActiveSectionIndex(idx)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-all cursor-pointer ${
                    isActive
                      ? 'bg-slate-900 text-white font-semibold shadow-md'
                      : 'hover:bg-slate-50 text-slate-700 font-medium'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-7 h-7 rounded-lg text-xs font-extrabold flex items-center justify-center ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : isAnswered
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {sec.letter}
                    </span>
                    <div>
                      <p className="text-xs font-bold leading-tight">{sec.name}</p>
                      <p className={`text-[10px] truncate max-w-[130px] ${isActive ? 'text-slate-300' : 'text-slate-400'}`}>
                        {sec.questions.length} Questions
                      </p>
                    </div>
                  </div>

                  {isAnswered && (
                    <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-emerald-400' : 'bg-emerald-500'}`}></span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Completeness Badge */}
          <div className="pt-4 border-t border-slate-100 px-2 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-600">Prompt Score</span>
              <span className={quality.score >= 80 ? 'text-emerald-600 font-bold' : 'text-amber-600 font-bold'}>
                {quality.score}%
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  quality.score >= 80 ? 'bg-emerald-500' : quality.score >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                }`}
                style={{ width: `${quality.score}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Centre Panel: Questions & Controls (5 Cols on LG) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          
          {/* Section Banner */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white font-black text-lg flex items-center justify-center shrink-0">
              {currentSection.letter}
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">
                Step {activeSectionIndex + 1} of {framework.sections.length}
              </span>
              <h2 className="text-lg font-bold text-slate-900">{currentSection.name}</h2>
              <p className="text-xs text-slate-500">{currentSection.description}</p>
            </div>
          </div>

          {/* Render Questions */}
          <div className="space-y-6">
            {currentSection.questions.map((q: Question) => {
              const currentVal = selections[q.id] || {};

              return (
                <div key={q.id} className="space-y-2.5 pb-5 border-b border-slate-100 last:border-none last:pb-0">
                  <div className="flex items-start justify-between gap-2">
                    <label className="text-sm font-bold text-slate-800 leading-snug">
                      {q.questionText}
                      {q.required && <span className="text-rose-500 ml-1">*</span>}
                    </label>
                  </div>

                  {q.helperTip && (
                    <p className="text-xs text-slate-500 italic">{q.helperTip}</p>
                  )}

                  {/* CHECKBOX INPUT */}
                  {q.inputType === 'checkbox' && q.options && (
                    <div className="space-y-2 pt-1">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {q.options.map((opt) => {
                          const isChecked = (currentVal.selectedOptions || []).includes(opt.label);
                          return (
                            <label
                              key={opt.id}
                              className={`flex items-start gap-2.5 p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                                isChecked
                                  ? 'bg-indigo-50/70 border-indigo-400 text-indigo-900 font-semibold shadow-xs'
                                  : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={(e) => handleCheckboxChange(q.id, opt.label, e.target.checked)}
                                className="mt-0.5 rounded-sm text-indigo-600 focus:ring-indigo-500"
                              />
                              <span>{opt.label}</span>
                            </label>
                          );
                        })}
                      </div>

                      {q.allowCustomOther && (
                        <div className="pt-1">
                          <input
                            type="text"
                            placeholder="Or type custom entry / other detail..."
                            value={currentVal.customOther || ''}
                            onChange={(e) => handleCustomOtherChange(q.id, e.target.value)}
                            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* RADIO INPUT */}
                  {q.inputType === 'radio' && q.options && (
                    <div className="space-y-2 pt-1">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {q.options.map((opt) => {
                          const isSelected = currentVal.singleOption === opt.label;
                          return (
                            <label
                              key={opt.id}
                              className={`flex items-start gap-2.5 p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                                isSelected
                                  ? 'bg-indigo-50/70 border-indigo-400 text-indigo-900 font-semibold shadow-xs'
                                  : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                              }`}
                            >
                              <input
                                type="radio"
                                name={q.id}
                                checked={isSelected}
                                onChange={() => handleRadioChange(q.id, opt.label)}
                                className="mt-0.5 text-indigo-600 focus:ring-indigo-500"
                              />
                              <span>{opt.label}</span>
                            </label>
                          );
                        })}
                      </div>

                      {q.allowCustomOther && (
                        <div className="pt-1">
                          <input
                            type="text"
                            placeholder="Or type custom entry / other detail..."
                            value={currentVal.customOther || ''}
                            onChange={(e) => handleCustomOtherChange(q.id, e.target.value)}
                            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* DROPDOWN INPUT */}
                  {q.inputType === 'dropdown' && q.options && (
                    <div className="space-y-2 pt-1">
                      <select
                        value={currentVal.singleOption || ''}
                        onChange={(e) => handleRadioChange(q.id, e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="">-- Choose an Option --</option>
                        {q.options.map((opt) => (
                          <option key={opt.id} value={opt.label}>
                            {opt.label}
                          </option>
                        ))}
                      </select>

                      {q.allowCustomOther && (
                        <div className="pt-1">
                          <input
                            type="text"
                            placeholder="Or enter custom option..."
                            value={currentVal.customOther || ''}
                            onChange={(e) => handleCustomOtherChange(q.id, e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-700 focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* TEXT INPUT */}
                  {q.inputType === 'text' && (
                    <input
                      type="text"
                      placeholder={q.placeholder || 'Enter response...'}
                      value={currentVal.customText || ''}
                      onChange={(e) => handleTextChange(q.id, e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  )}

                  {/* TEXTAREA INPUT */}
                  {q.inputType === 'textarea' && (
                    <textarea
                      rows={3}
                      placeholder={q.placeholder || 'Enter detailed response...'}
                      value={currentVal.customText || ''}
                      onChange={(e) => handleTextChange(q.id, e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
                    />
                  )}

                  {/* FILE UPLOAD INPUT */}
                  {q.inputType === 'file' && (
                    <div className="space-y-2 pt-1">
                      {currentVal.fileName ? (
                        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                          <div className="flex items-center gap-2 truncate">
                            <FileText className="w-4 h-4 text-indigo-600 shrink-0" />
                            <span className="font-medium text-slate-800 truncate">{currentVal.fileName}</span>
                          </div>
                          <button
                            onClick={() => handleRemoveFile(q.id)}
                            className="text-rose-500 hover:text-rose-700 p-1 rounded-full hover:bg-rose-50"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <label className="flex items-center justify-center gap-2 p-4 rounded-xl border-2 border-dashed border-slate-300 hover:border-indigo-500 bg-slate-50 hover:bg-indigo-50/40 text-xs font-medium text-slate-600 cursor-pointer transition-all">
                          <Upload className="w-4 h-4 text-slate-400" />
                          <span>Click to Upload Reference File or Logo</span>
                          <input
                            type="file"
                            onChange={(e) => handleFileUpload(q.id, e)}
                            className="hidden"
                            accept=".png,.jpg,.jpeg,.pdf,.txt,.docx"
                          />
                        </label>
                      )}
                    </div>
                  )}

                </div>
              );
            })}
          </div>

          {/* Section Navigation Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setActiveSectionIndex(Math.max(0, activeSectionIndex - 1))}
              disabled={activeSectionIndex === 0}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 transition-all cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous Letter</span>
            </button>

            {activeSectionIndex < framework.sections.length - 1 ? (
              <button
                onClick={() => setActiveSectionIndex(activeSectionIndex + 1)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 transition-all cursor-pointer"
              >
                <span>Next Letter ({framework.sections[activeSectionIndex + 1].letter})</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => onGoToOutput(liveAssembledPrompt, selections, frameworkType)}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md transition-all cursor-pointer"
              >
                <span>Generate Output Windows</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>

        </div>

        {/* Right Panel: Live Prompt Preview & Quality Checker (4 Cols) */}
        <div className="lg:col-span-4 space-y-4 sticky top-20">
          
          {/* Live Prompt Preview Box */}
          <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold tracking-wider text-slate-200 uppercase">
                  Live Prompt Preview
                </span>
              </div>
              <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md font-mono">
                Auto-Updating
              </span>
            </div>

            <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 text-xs text-slate-200 font-mono leading-relaxed max-h-[280px] overflow-y-auto whitespace-pre-wrap select-all">
              {liveAssembledPrompt || (
                <span className="text-slate-500 italic">
                  Select framework options on the left to watch your prompt construct automatically...
                </span>
              )}
            </div>

            {/* Quick Action Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={handleCopy}
                disabled={!liveAssembledPrompt}
                className="flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white text-xs font-medium py-2 rounded-lg transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Prompt'}</span>
              </button>

              <button
                onClick={handleAiEnhance}
                disabled={aiEnhancing || !liveAssembledPrompt}
                className="flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-xs font-medium py-2 rounded-lg transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-200 animate-pulse" />
                <span>{aiEnhancing ? 'Enhancing...' : 'AI Enhance'}</span>
              </button>
            </div>

            {/* Save & Download Controls */}
            <div className="pt-2 border-t border-slate-800 space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Optional prompt title..."
                  value={customPromptTitle}
                  onChange={(e) => setCustomPromptTitle(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 text-xs text-white px-2.5 py-1.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <button
                  onClick={handleSave}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 shrink-0 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save</span>
                </button>
              </div>

              <button
                onClick={handleDownload}
                disabled={!liveAssembledPrompt}
                className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs py-1.5 rounded-lg font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download (.txt)</span>
              </button>
            </div>
          </div>

          {/* Quality Checker Box */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-indigo-600" />
                <span>Prompt Completeness</span>
              </h3>
              <span className="text-sm font-extrabold text-slate-900">{quality.score}%</span>
            </div>

            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  quality.score >= 80 ? 'bg-emerald-500' : quality.score >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                }`}
                style={{ width: `${quality.score}%` }}
              ></div>
            </div>

            {quality.feedbackMessages.length > 0 ? (
              <div className="bg-amber-50 rounded-xl p-3 border border-amber-200/80 space-y-1.5">
                <p className="text-[11px] font-bold text-amber-900">Missing Information Tips:</p>
                <ul className="text-[11px] text-amber-800 space-y-1">
                  {quality.feedbackMessages.slice(0, 3).map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-1">
                      <span>•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-200 text-xs text-emerald-800 font-medium flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>All key framework criteria provided! Excellent prompt quality.</span>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Mobile Live Preview Floating Button */}
      <div className="lg:hidden fixed bottom-4 right-4 z-40">
        <button
          onClick={() => setMobilePreviewOpen(!mobilePreviewOpen)}
          className="bg-indigo-600 text-white font-semibold px-4 py-3 rounded-full shadow-2xl flex items-center gap-2 text-xs cursor-pointer"
        >
          <Eye className="w-4 h-4" />
          <span>Preview Prompt ({quality.score}%)</span>
        </button>
      </div>

    </div>
  );
};
