import React from 'react';
import { FrameworkType, UserProfile } from '../types';
import { Sparkles, FileText, Image as ImageIcon, Video, ArrowRight, CheckCircle2, BookmarkCheck, BookOpen, ShieldCheck, Smartphone, Download, QrCode } from 'lucide-react';
import { DennelLogo } from './DennelLogo';

interface HomepageProps {
  user: UserProfile | null;
  onOpenAuthModal: () => void;
  onSelectFramework: (framework: FrameworkType) => void;
  onNavigate: (view: 'home' | 'selector' | 'builder' | 'twoWindow' | 'training' | 'myWork' | 'templates', framework?: FrameworkType) => void;
  onToggleAndroidMode?: () => void;
  onOpenAndroidExportModal?: () => void;
}

export const Homepage: React.FC<HomepageProps> = ({
  user,
  onOpenAuthModal,
  onSelectFramework,
  onNavigate,
  onToggleAndroidMode,
  onOpenAndroidExportModal,
}) => {
  return (
    <div className="space-y-16 py-8">
      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto space-y-6 px-4">
        <div className="flex justify-center mb-2">
          <DennelLogo size={72} showText={false} />
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs font-bold tracking-wide">
          <Sparkles className="w-4 h-4 text-emerald-600 animate-pulse" />
          <span>Powered by Dennel Technologies AI</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
          AI Prompt Master
        </h1>

        <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
          Craft high-performing prompts for <strong className="text-slate-900 font-semibold">text</strong>, <strong className="text-slate-900 font-semibold">images</strong>, and <strong className="text-slate-900 font-semibold">videos</strong> using guided visual options — built by Dennel Technologies AI.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <button
            id="home-btn-start-building"
            onClick={() => onNavigate('selector')}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3.5 rounded-xl shadow-lg shadow-indigo-200 hover:shadow-xl transition-all text-base cursor-pointer"
          >
            <span>Start Building a Prompt</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <a
            id="home-btn-download-apk"
            href="/downloads/prompt-master-v1.0.apk"
            download="prompt-master-v1.0.apk"
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-3.5 rounded-xl shadow-lg shadow-emerald-200 hover:shadow-xl transition-all text-base cursor-pointer"
          >
            <Download className="w-5 h-5" />
            <span>Download Android APK</span>
          </a>

          <button
            id="home-btn-templates"
            onClick={() => onNavigate('templates')}
            className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-800 font-semibold px-6 py-3.5 rounded-xl border border-slate-200 shadow-xs transition-all text-base cursor-pointer"
          >
            <FileText className="w-5 h-5 text-emerald-600" />
            <span>Templates</span>
          </button>
        </div>

        {/* Quick status bar */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 pt-4">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> 100% Free Open Access
          </span>
          <span className="flex items-center gap-1.5">
            <Smartphone className="w-4 h-4 text-emerald-600" /> Android PWA & APK Package Support
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-indigo-500" /> Google Auth Sync for Saved Work
          </span>
        </div>
      </section>

      {/* Android Feature Callout Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 sm:p-10 text-white shadow-2xl border border-slate-800 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <span>Android Smartphone & Tablet Version</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Install Prompt Master Directly on Your Android Phone
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Use Prompt Master as a full-screen, standalone Android app with Google Material Design, touch optimization, local storage persistence, and native sharing.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                id="banner-link-download-apk"
                href="/downloads/prompt-master-v1.0.apk"
                download="prompt-master-v1.0.apk"
                className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl transition-all text-xs cursor-pointer shadow-lg shadow-emerald-500/20"
              >
                <Download className="w-4 h-4" />
                <span>Download Android APK (.apk)</span>
              </a>

              {onOpenAndroidExportModal && (
                <button
                  id="banner-btn-export-apk"
                  onClick={onOpenAndroidExportModal}
                  className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold px-5 py-2.5 rounded-xl border border-slate-700 transition-all text-xs cursor-pointer"
                >
                  <Smartphone className="w-4 h-4 text-emerald-400" />
                  <span>Android Build Hub & Installation</span>
                </button>
              )}
            </div>
          </div>

          <div className="relative shrink-0 flex items-center justify-center z-10">
            <div className="w-44 h-72 bg-slate-950 border-4 border-slate-700 rounded-[28px] p-2 shadow-2xl flex flex-col justify-between overflow-hidden relative">
              <div className="w-12 h-2 bg-slate-800 rounded-full mx-auto" />
              <div className="flex-1 my-2 bg-indigo-950/60 rounded-xl p-3 border border-indigo-800/40 flex flex-col justify-center items-center text-center">
                <div className="w-10 h-10 rounded-xl bg-emerald-500 text-slate-950 font-bold flex items-center justify-center mb-2 shadow-md">
                  <Sparkles className="w-5 h-5" />
                </div>
                <p className="text-[11px] font-bold text-white">Prompt Master</p>
                <p className="text-[9px] text-emerald-400 mt-1">Android Edition</p>
              </div>
              <div className="w-16 h-1 bg-slate-600 rounded-full mx-auto" />
            </div>
          </div>
        </div>
      </section>

      {/* Three Core Framework Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Choose Your Prompt Framework</h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            Select a specialized framework engineered specifically for your content medium.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          
          {/* CLEAR Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm hover:shadow-xl hover:border-indigo-300 transition-all flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <FileText className="w-6 h-6" />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2.5 py-1 rounded-md">
                    C L E A R
                  </span>
                  <span className="text-xs font-medium text-slate-400">Text Generation</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mt-2">CLEAR Framework</h3>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                  Craft flawless text prompts for emails, proposals, SOPs, marketing copy, articles, and executive reports.
                </p>
              </div>

              <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100 text-xs text-slate-600 space-y-1.5">
                <p className="font-semibold text-slate-800">Framework Breakdown:</p>
                <ul className="grid grid-cols-2 gap-1 text-[11px]">
                  <li>• <strong>C</strong> — Context</li>
                  <li>• <strong>L</strong> — Length</li>
                  <li>• <strong>E</strong> — Examples</li>
                  <li>• <strong>A</strong> — Action</li>
                  <li>• <strong>R</strong> — Restrictions</li>
                </ul>
              </div>
            </div>

            <button
              onClick={() => onSelectFramework('CLEAR')}
              className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-indigo-100"
            >
              <span>Build a Text Prompt</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* SAEALD Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <ImageIcon className="w-6 h-6" />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2.5 py-1 rounded-md">
                    S A E A L D
                  </span>
                  <span className="text-xs font-medium text-slate-400">Image & Flyer</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mt-2">SAEALD Framework</h3>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                  Generate precise visual prompts for event flyers, social media ads, product graphics, posters, and logos.
                </p>
              </div>

              <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100 text-xs text-slate-600 space-y-1.5">
                <p className="font-semibold text-slate-800">Framework Breakdown:</p>
                <ul className="grid grid-cols-2 gap-1 text-[11px]">
                  <li>• <strong>S</strong> — Subject</li>
                  <li>• <strong>A</strong> — Action</li>
                  <li>• <strong>E</strong> — Environment</li>
                  <li>• <strong>A</strong> — Art Style</li>
                  <li>• <strong>L</strong> — Lighting</li>
                  <li>• <strong>D</strong> — Details</li>
                </ul>
              </div>
            </div>

            <button
              onClick={() => onSelectFramework('SAEALD')}
              className="mt-6 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-100"
            >
              <span>Build an Image Prompt</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* SCENE Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm hover:shadow-xl hover:border-amber-300 transition-all flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                <Video className="w-6 h-6" />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-700 uppercase tracking-widest bg-amber-50 px-2.5 py-1 rounded-md">
                    S C E N E
                  </span>
                  <span className="text-xs font-medium text-slate-400">Video & Story</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mt-2">SCENE Framework</h3>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                  Design cinematic storyboards and prompts for commercial reels, TikTok shorts, tutorials, and brand videos.
                </p>
              </div>

              <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100 text-xs text-slate-600 space-y-1.5">
                <p className="font-semibold text-slate-800">Framework Breakdown:</p>
                <ul className="grid grid-cols-2 gap-1 text-[11px]">
                  <li>• <strong>S</strong> — Story</li>
                  <li>• <strong>C</strong> — Characters</li>
                  <li>• <strong>E</strong> — Environment</li>
                  <li>• <strong>N</strong> — Narration</li>
                  <li>• <strong>E</strong> — Effects</li>
                </ul>
              </div>
            </div>

            <button
              onClick={() => onSelectFramework('SCENE')}
              className="mt-6 w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-amber-100"
            >
              <span>Build a Video Prompt</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 max-w-7xl mx-auto shadow-2xl">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">How It Works in 4 Simple Steps</h2>
          <p className="text-slate-400 text-sm sm:text-base mt-2">
            No technical knowledge or number codes required. Just check options and build.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700 space-y-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-500 text-white font-bold flex items-center justify-center text-sm">
              1
            </div>
            <h4 className="font-bold text-base text-white">Select a Framework</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Pick CLEAR for text, SAEALD for images/flyers, or SCENE for videos.
            </p>
          </div>

          <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700 space-y-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white font-bold flex items-center justify-center text-sm">
              2
            </div>
            <h4 className="font-bold text-base text-white">Tick Visual Options</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Select checkboxes, radio buttons, and dropdown options for tone, audience, style, and effects.
            </p>
          </div>

          <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700 space-y-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-white font-bold flex items-center justify-center text-sm">
              3
            </div>
            <h4 className="font-bold text-base text-white">Review Live Preview</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Watch your prompt assemble automatically in real-time with an instant Quality Score.
            </p>
          </div>

          <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700 space-y-3">
            <div className="w-8 h-8 rounded-lg bg-purple-500 text-white font-bold flex items-center justify-center text-sm">
              4
            </div>
            <h4 className="font-bold text-base text-white">Copy, Save & Export</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Copy to AI, edit, download, generate content templates, or save to your Google account.
            </p>
          </div>
        </div>
      </section>

      {/* Training & Account Callout Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-8">
        {/* Training Feature */}
        <div className="bg-amber-50/60 rounded-2xl border border-amber-200 p-8 space-y-4 flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-semibold mb-3">
              <BookOpen className="w-4 h-4 text-amber-700" />
              <span>Interactive Training Mode</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900">Learn Why Prompts Succeed or Fail</h3>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              Explore weak vs. improved prompt comparisons, master each framework letter, and learn how specific option selections directly impact AI output quality.
            </p>
          </div>
          <button
            onClick={() => onNavigate('training')}
            className="mt-4 inline-flex items-center gap-2 bg-amber-800 hover:bg-amber-900 text-white font-semibold px-5 py-2.5 rounded-xl transition-all text-sm w-fit cursor-pointer"
          >
            <span>Open Training Mode</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Saved Work Feature */}
        <div className="bg-indigo-50/60 rounded-2xl border border-indigo-200 p-8 space-y-4 flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-semibold mb-3">
              <BookmarkCheck className="w-4 h-4 text-indigo-700" />
              <span>Saved Work & Account Sync</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900">Save Your Prompts & Templates</h3>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              Sign in with Google to organize your favorite prompts, save unfinished drafts, bookmark custom content templates, and access your work anywhere.
            </p>
          </div>
          {user ? (
            <button
              onClick={() => onNavigate('myWork')}
              className="mt-4 inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-all text-sm w-fit cursor-pointer"
            >
              <span>View My Saved Work</span>
              <BookmarkCheck className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="mt-4 inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold px-5 py-2.5 rounded-xl transition-all text-sm w-fit cursor-pointer"
            >
              <span>Continue with Google</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </section>
    </div>
  );
};
