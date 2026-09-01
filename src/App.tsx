import React, { useState, useEffect } from 'react';
import { FrameworkType, UserProfile, PromptItem, ContentTemplateItem, FormSelections } from './types';
import { getUserProfile, saveUserProfile, getSavedPrompts, savePromptItem, deletePromptItem, togglePromptFavourite, getSavedTemplates, saveTemplateItem, deleteTemplateItem } from './utils/storage';
import { Navbar } from './components/Navbar';
import { Homepage } from './components/Homepage';
import { FrameworkSelector } from './components/FrameworkSelector';
import { PromptBuilder } from './components/PromptBuilder';
import { TwoWindowOutput } from './components/TwoWindowOutput';
import { TrainingMode } from './components/TrainingMode';
import { SavedWorkDrawer } from './components/SavedWorkDrawer';
import { GoogleAuthModal } from './components/GoogleAuthModal';
import { InterpayModal } from './components/InterpayModal';
import { LoginPageGate } from './components/LoginPageGate';
import { AndroidFrame } from './components/AndroidFrame';
import { AndroidExportModal } from './components/AndroidExportModal';
import { DennelLogo } from './components/DennelLogo';
import { CheckCircle2 } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [interpayModalOpen, setInterpayModalOpen] = useState(false);
  const [interpayPrefilledEmail, setInterpayPrefilledEmail] = useState('');
  const [androidExportModalOpen, setAndroidExportModalOpen] = useState(false);
  const [isAndroidMode, setIsAndroidMode] = useState(false);
  const [activeView, setActiveView] = useState<'home' | 'selector' | 'builder' | 'twoWindow' | 'training' | 'myWork' | 'templates'>('home');
  const [activeFramework, setActiveFramework] = useState<FrameworkType>('CLEAR');

  // Active Two-Window Output Data
  const [outputData, setOutputData] = useState<{
    prompt: string;
    selections: FormSelections;
    framework: FrameworkType;
  }>({
    prompt: '',
    selections: {},
    framework: 'CLEAR',
  });

  // Saved Data
  const [savedPrompts, setSavedPrompts] = useState<PromptItem[]>([]);
  const [savedTemplates, setSavedTemplates] = useState<ContentTemplateItem[]>([]);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setUser(getUserProfile());
    setSavedPrompts(getSavedPrompts());
    setSavedTemplates(getSavedTemplates());
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSignInSuccess = (newUser: UserProfile) => {
    setUser(newUser);
    saveUserProfile(newUser);
    if (newUser.isPaid) {
      showToast(`Welcome back, ${newUser.fullName}! Lifetime Ghc 1.00 Access active.`);
    } else {
      showToast(`Welcome, ${newUser.fullName}! Complete Ghc 1.00 activation to unlock prompt tools.`);
      setInterpayPrefilledEmail(newUser.email);
      setInterpayModalOpen(true);
    }
  };

  const handleInterpaySuccess = (updatedUser: UserProfile) => {
    setUser(updatedUser);
    saveUserProfile(updatedUser);
    showToast(`Access Activated! Ghc 1.00 received via Interpay.`);
  };

  const handleRequirePayment = (email: string, fullName: string) => {
    setInterpayPrefilledEmail(email);
    setInterpayModalOpen(true);
  };

  const handleSignOut = () => {
    setUser(null);
    saveUserProfile(null);
    showToast('Signed out successfully.');
  };

  const handleSelectFramework = (framework: FrameworkType) => {
    setActiveFramework(framework);
    setActiveView('builder');
  };

  const handleGoToOutput = (prompt: string, selections: FormSelections, framework: FrameworkType) => {
    setOutputData({ prompt, selections, framework });
    setActiveView('twoWindow');
  };

  const handleSavePrompt = (promptData: {
    title: string;
    framework: FrameworkType;
    selections: FormSelections;
    generatedPrompt: string;
    editedPrompt: string;
    completenessScore: number;
    missingFields: string[];
  }) => {
    const newItem: PromptItem = {
      id: `prompt_${Date.now()}`,
      userId: user?.id,
      title: promptData.title,
      framework: promptData.framework,
      selections: promptData.selections,
      generatedPrompt: promptData.generatedPrompt,
      editedPrompt: promptData.editedPrompt,
      completenessScore: promptData.completenessScore,
      missingFields: promptData.missingFields,
      createdDate: new Date().toISOString(),
      updatedDate: new Date().toISOString(),
    };
    const updated = savePromptItem(newItem);
    setSavedPrompts(updated);
    showToast('Prompt saved to My Work!');
  };

  const handleSaveTemplate = (templateData: ContentTemplateItem) => {
    const updated = saveTemplateItem(templateData);
    setSavedTemplates(updated);
    showToast('Template saved to My Work!');
  };

  const handleDeletePrompt = (id: string) => {
    const updated = deletePromptItem(id);
    setSavedPrompts(updated);
    showToast('Prompt removed.');
  };

  const handleDeleteTemplate = (id: string) => {
    const updated = deleteTemplateItem(id);
    setSavedTemplates(updated);
    showToast('Template removed.');
  };

  const handleToggleFavouritePrompt = (id: string) => {
    const updated = togglePromptFavourite(id);
    setSavedPrompts(updated);
  };

  const mainContent = (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navigation Header */}
      <Navbar
        user={user}
        onOpenAuthModal={() => setAuthModalOpen(true)}
        onOpenInterpayModal={() => setInterpayModalOpen(true)}
        onSignOut={handleSignOut}
        onNavigate={(view, fw) => {
          if (fw) setActiveFramework(fw);
          setActiveView(view);
        }}
        activeView={activeView}
        activeFramework={activeFramework}
        isAndroidMode={isAndroidMode}
        onToggleAndroidMode={() => {
          setIsAndroidMode(!isAndroidMode);
          showToast(!isAndroidMode ? 'Android Shell Mode Activated' : 'Switched to Desktop Mode');
        }}
        onOpenAndroidExportModal={() => setAndroidExportModalOpen(true)}
      />

      {/* Main View Switcher */}
      <main className="flex-1">
        {activeView === 'home' && (
          <Homepage
            user={user}
            onOpenAuthModal={() => setAuthModalOpen(true)}
            onSelectFramework={handleSelectFramework}
            onNavigate={(view, fw) => {
              if (fw) setActiveFramework(fw);
              setActiveView(view);
            }}
            onToggleAndroidMode={() => setIsAndroidMode(!isAndroidMode)}
            onOpenAndroidExportModal={() => setAndroidExportModalOpen(true)}
          />
        )}

        {activeView === 'selector' && (
          <FrameworkSelector onSelectFramework={handleSelectFramework} />
        )}

        {activeView === 'builder' && (
          <PromptBuilder
            frameworkType={activeFramework}
            user={user}
            onOpenAuthModal={() => setAuthModalOpen(true)}
            onSavePrompt={handleSavePrompt}
            onGoToOutput={handleGoToOutput}
            onBackToSelector={() => setActiveView('selector')}
          />
        )}

        {(activeView === 'twoWindow' || activeView === 'templates') && (
          <TwoWindowOutput
            initialPrompt={outputData.prompt || 'Create a professional document with clear structure and practical examples.'}
            selections={outputData.selections}
            frameworkType={outputData.framework || activeFramework}
            user={user}
            onOpenAuthModal={() => setAuthModalOpen(true)}
            onSavePrompt={handleSavePrompt}
            onSaveTemplate={handleSaveTemplate}
            onBackToBuilder={() => setActiveView('builder')}
          />
        )}

        {activeView === 'training' && <TrainingMode />}

        {activeView === 'myWork' && (
          <SavedWorkDrawer
            user={user}
            savedPrompts={savedPrompts}
            savedTemplates={savedTemplates}
            onOpenAuthModal={() => setAuthModalOpen(true)}
            onSelectPrompt={(prompt) => {
              setOutputData({
                prompt: prompt.editedPrompt,
                selections: prompt.selections,
                framework: prompt.framework,
              });
              setActiveFramework(prompt.framework);
              setActiveView('twoWindow');
            }}
            onSelectTemplate={(tmpl) => {
              setActiveView('templates');
            }}
            onDeletePrompt={handleDeletePrompt}
            onDeleteTemplate={handleDeleteTemplate}
            onToggleFavourite={handleToggleFavouritePrompt}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white border-t border-slate-800 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center space-y-4">
          <DennelLogo size={48} showText={true} textClassName="text-white font-extrabold text-xl tracking-tight" subtextClassName="text-xs text-emerald-400 font-bold tracking-widest uppercase" />
          
          <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
            <strong className="text-white">AI Prompt Master</strong> • Built for text, image, and video prompt engineering with CLEAR, SAEALD, and SCENE frameworks.
          </p>

          <div className="pt-2 border-t border-slate-800/80 w-full max-w-md flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400">
            <span className="font-semibold text-emerald-400">
              Powered by Dennel Technologies AI
            </span>
            <span>© {new Date().getFullYear()} Dennel Technologies</span>
          </div>
        </div>
      </footer>

      {/* Google Sign-In Modal */}
      <GoogleAuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSignInSuccess={handleSignInSuccess}
        onRequirePayment={handleRequirePayment}
      />

      {/* Interpay One-Time Ghc 50 Access Modal */}
      <InterpayModal
        isOpen={interpayModalOpen}
        onClose={() => setInterpayModalOpen(false)}
        user={user}
        prefilledEmail={interpayPrefilledEmail}
        onPaymentSuccess={handleInterpaySuccess}
      />

      {/* Android Export / APK Release Modal */}
      <AndroidExportModal
        isOpen={androidExportModalOpen}
        onClose={() => setAndroidExportModalOpen(false)}
      />

    </div>
  );

  if (!user || !user.isPaid) {
    return (
      <LoginPageGate
        user={user}
        onSignInSuccess={handleSignInSuccess}
        onPaymentSuccess={handleInterpaySuccess}
      />
    );
  }

  return (
    <AndroidFrame
      isAndroidMode={isAndroidMode}
      onToggleAndroidMode={() => setIsAndroidMode(!isAndroidMode)}
      onOpenAndroidExportModal={() => setAndroidExportModalOpen(true)}
    >
      {mainContent}
    </AndroidFrame>
  );
}
