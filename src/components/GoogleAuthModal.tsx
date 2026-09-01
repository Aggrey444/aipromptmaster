import React, { useState } from 'react';
import { UserProfile } from '../types';
import { isEmailPaid, getPaymentRecord } from '../utils/storage';
import { DennelLogo } from './DennelLogo';
import { X, ShieldCheck, CheckCircle2, Lock, Smartphone } from 'lucide-react';

interface GoogleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignInSuccess: (user: UserProfile) => void;
  onRequirePayment?: (email: string, fullName: string) => void;
}

export const GoogleAuthModal: React.FC<GoogleAuthModalProps> = ({
  isOpen,
  onClose,
  onSignInSuccess,
  onRequirePayment
}) => {
  const [customEmail, setCustomEmail] = useState('');

  if (!isOpen) return null;

  const handleSelectAccount = (email: string, name: string) => {
    const isPaid = isEmailPaid(email);
    const paymentRecord = getPaymentRecord(email);

    const newUser: UserProfile = {
      id: `usr_${Date.now()}`,
      googleId: `google_oauth_${Math.random().toString(36).substring(2, 9)}`,
      fullName: name,
      email: email,
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
      signedInDate: new Date().toISOString(),
      lastActiveDate: new Date().toISOString(),
      isPaid: isPaid,
      paymentDate: paymentRecord?.paymentDate,
      paymentRef: paymentRecord?.transRefNo,
      paymentMethod: paymentRecord?.mobileNetwork || 'Interpay',
      amountPaid: isPaid ? 50 : undefined,
    };

    onSignInSuccess(newUser);
    onClose();

    if (!isPaid && onRequirePayment) {
      onRequirePayment(email, name);
    }
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail || !customEmail.includes('@')) return;
    const nameFromEmail = customEmail.split('@')[0].replace(/[._]/g, ' ');
    const capitalizedName = nameFromEmail
      .split(' ')
      .map(s => s.charAt(0).toUpperCase() + s.slice(1))
      .join(' ');

    handleSelectAccount(customEmail, capitalizedName);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Google Logo Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center mx-auto mb-3 shadow-xs">
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-slate-900">Sign in with Google</h3>
          <p className="text-sm text-slate-500 mt-1">
            Choose an account to save prompts, sync work, and manage templates.
          </p>
        </div>

          {/* Account Selector Cards */}
          <div className="space-y-3 mb-6">
            <button
              onClick={() => handleSelectAccount('christlife4core@gmail.com', 'Christ Life')}
              className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 transition-all text-left group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <img
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=ChristLife"
                  alt="Christ Life"
                  className="w-10 h-10 rounded-full border border-slate-200"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-semibold text-slate-800 group-hover:text-emerald-900">Christ Life</p>
                    {isEmailPaid('christlife4core@gmail.com') ? (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">Ghc 1.00 Paid</span>
                    ) : (
                      <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold">Ghc 1.00 Fee</span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500">christlife4core@gmail.com</p>
                </div>
              </div>
              <span className="text-xs text-emerald-600 font-semibold group-hover:translate-x-0.5 transition-transform">
                {isEmailPaid('christlife4core@gmail.com') ? 'Log In →' : 'Pay Ghc 1.00 →'}
              </span>
            </button>

            <button
              onClick={() => handleSelectAccount('dennel.tech@gmail.com', 'Dennel Tech Member')}
              className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 transition-all text-left group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <img
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=DennelTech"
                  alt="Dennel Tech"
                  className="w-10 h-10 rounded-full border border-slate-200"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-semibold text-slate-800 group-hover:text-emerald-900">Dennel Tech</p>
                    {isEmailPaid('dennel.tech@gmail.com') ? (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">Ghc 1.00 Paid</span>
                    ) : (
                      <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold">Ghc 1.00 Fee</span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500">dennel.tech@gmail.com</p>
                </div>
              </div>
              <span className="text-xs text-emerald-600 font-semibold group-hover:translate-x-0.5 transition-transform">
                {isEmailPaid('dennel.tech@gmail.com') ? 'Log In →' : 'Pay Ghc 1.00 →'}
              </span>
            </button>
          </div>

        {/* Or enter another Gmail account */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-slate-400 font-medium">Or enter Gmail address</span>
          </div>
        </div>

        <form onSubmit={handleCustomSubmit} className="space-y-3 mb-6">
          <input
            type="email"
            value={customEmail}
            onChange={(e) => setCustomEmail(e.target.value)}
            placeholder="your.email@gmail.com"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <button
            type="submit"
            disabled={!customEmail.includes('@')}
            className="w-full bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-sm font-medium py-2.5 rounded-xl transition-colors cursor-pointer"
          >
            Continue with Google
          </button>
        </form>

        {/* Privacy & Permissions notice */}
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-xs text-slate-500 space-y-1.5">
          <div className="flex items-center gap-1.5 font-medium text-slate-700">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Minimum Permissions Requested</span>
          </div>
          <p className="text-[11px] leading-relaxed">
            Prompt Master requests basic profile info (name, email, avatar). We never access your Gmail messages, contacts, or files.
          </p>
          <div className="flex items-center gap-3 pt-1 text-[11px] text-emerald-700 font-medium">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> No Password Required
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Open Core Tools
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
