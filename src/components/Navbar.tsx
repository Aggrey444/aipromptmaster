import React from 'react';
import { UserProfile, FrameworkType } from '../types';
import { Sparkles, BookOpen, BookmarkCheck, LogIn, User, FileText, ChevronDown, Smartphone, Download } from 'lucide-react';
import { DennelLogo } from './DennelLogo';

interface NavbarProps {
  user: UserProfile | null;
  onOpenAuthModal: () => void;
  onOpenInterpayModal?: () => void;
  onSignOut: () => void;
  onNavigate: (view: 'home' | 'selector' | 'builder' | 'twoWindow' | 'training' | 'myWork' | 'templates', framework?: FrameworkType) => void;
  activeView: string;
  activeFramework?: FrameworkType;
  isAndroidMode?: boolean;
  onToggleAndroidMode?: () => void;
  onOpenAndroidExportModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  onOpenAuthModal,
  onOpenInterpayModal,
  onSignOut,
  onNavigate,
  activeView,
  activeFramework,
  isAndroidMode = false,
  onToggleAndroidMode,
  onOpenAndroidExportModal,
}) => {
  const [userDropdownOpen, setUserDropdownOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('home')}>
            <DennelLogo size={42} showText={false} />
            <div>
              <div className="font-extrabold text-slate-900 tracking-tight text-lg flex items-center gap-2">
                <span>AI Prompt Master</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 border border-amber-500/30 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  <span>Dennel AI</span>
                </span>
              </div>
              <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold hidden sm:block">
                Powered by Dennel Technologies AI
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              id="nav-btn-home"
              onClick={() => onNavigate('home')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                activeView === 'home' ? 'bg-slate-100 text-indigo-700 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Home
            </button>

            <button
              id="nav-btn-builders"
              onClick={() => onNavigate('selector')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                activeView === 'selector' || activeView === 'builder'
                  ? 'bg-indigo-50 text-indigo-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Framework Builders
            </button>

            <button
              id="nav-btn-templates"
              onClick={() => onNavigate('templates')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeView === 'templates' ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <FileText className="w-4 h-4 text-emerald-600" />
              <span>Template Generator</span>
            </button>

            <button
              id="nav-btn-training"
              onClick={() => onNavigate('training')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeView === 'training' ? 'bg-amber-50 text-amber-800 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <BookOpen className="w-4 h-4 text-amber-600" />
              <span>Training Mode</span>
            </button>

            <button
              id="nav-btn-mywork"
              onClick={() => onNavigate('myWork')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeView === 'myWork' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <BookmarkCheck className="w-4 h-4 text-indigo-600" />
              <span>My Work</span>
            </button>
          </nav>

          {/* Android APK Download & User Auth */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Direct APK Download Link / Modal Trigger */}
            {onOpenAndroidExportModal && (
              <button
                id="btn-open-android-release-modal"
                onClick={onOpenAndroidExportModal}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer border border-emerald-500/30"
                title="Download Android APK File (.apk)"
              >
                <Download className="w-4 h-4 text-emerald-200" />
                <span>Download Android APK</span>
              </button>
            )}

            {/* Android Device Frame Simulator Toggle */}
            {onToggleAndroidMode && (
              <button
                id="btn-toggle-android-view"
                onClick={onToggleAndroidMode}
                className={`p-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1 border cursor-pointer ${
                  isAndroidMode
                    ? 'bg-slate-900 text-emerald-400 border-slate-700'
                    : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                }`}
                title="Toggle Android Device Viewport Simulator"
              >
                <Smartphone className="w-4 h-4 text-emerald-600" />
              </button>
            )}

            {/* Interpay Ghc 50 Access Button */}
            {onOpenInterpayModal && (
              <button
                id="btn-navbar-interpay-access"
                onClick={onOpenInterpayModal}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border cursor-pointer ${
                  user?.isPaid
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300'
                    : 'bg-amber-500 text-slate-950 border-amber-400 hover:bg-amber-400 shadow-sm'
                }`}
                title="Interpay Ghc 1.00 One-Time Access"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{user?.isPaid ? 'Ghc 1.00 Paid' : 'Pay Ghc 1.00'}</span>
              </button>
            )}

            {user ? (
              <div className="relative">
                <button
                  id="btn-user-dropdown"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-full hover:bg-slate-100 border border-slate-200 transition-all cursor-pointer"
                >
                  <img
                    src={user.avatarUrl}
                    alt={user.fullName}
                    className="w-8 h-8 rounded-full border border-slate-300 object-cover"
                  />
                  <span className="text-sm font-medium text-slate-700 hidden sm:inline-block max-w-[120px] truncate">
                    {user.fullName}
                  </span>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50">
                    <div className="px-4 py-2.5 border-b border-slate-100 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-slate-400 font-medium">Account Profile</p>
                        {user.isPaid ? (
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                            ✓ Ghc 1.00 Paid
                          </span>
                        ) : (
                          <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">
                            Ghc 1.00 Required
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-semibold text-slate-800 truncate">{user.fullName}</p>
                      <p className="text-xs text-slate-500 truncate">{user.email}</p>
                    </div>

                    {onOpenInterpayModal && (
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onOpenInterpayModal();
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-emerald-800 hover:bg-emerald-50 flex items-center gap-2 font-semibold"
                      >
                        <Sparkles className="w-4 h-4 text-emerald-600" />
                        <span>{user.isPaid ? 'Interpay Payment Receipt' : 'Pay Ghc 1.00 via Interpay'}</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onNavigate('myWork');
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <BookmarkCheck className="w-4 h-4 text-indigo-600" />
                      <span>My Saved Work & Drafts</span>
                    </button>
                    {onOpenAndroidExportModal && (
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onOpenAndroidExportModal();
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-emerald-700 hover:bg-emerald-50 flex items-center gap-2"
                      >
                        <Smartphone className="w-4 h-4 text-emerald-600" />
                        <span>Android App Export & APK</span>
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onSignOut();
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                    >
                      <LogIn className="w-4 h-4 rotate-180" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                id="btn-google-sign-in-nav"
                onClick={onOpenAuthModal}
                className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-2 rounded-xl text-xs font-medium transition-all shadow-xs hover:shadow-md cursor-pointer"
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
                <span className="hidden sm:inline">Google Sign In</span>
              </button>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
