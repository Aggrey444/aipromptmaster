import React, { useState } from 'react';
import { UserProfile } from '../types';
import { DennelLogo } from './DennelLogo';
import { isEmailPaid, getPaymentRecord } from '../utils/storage';
import { ShieldCheck, CheckCircle2, Lock, Smartphone, CreditCard, Sparkles, ArrowRight, Zap, RefreshCw, AlertCircle } from 'lucide-react';

interface LoginPageGateProps {
  user: UserProfile | null;
  onSignInSuccess: (user: UserProfile) => void;
  onPaymentSuccess: (updatedUser: UserProfile) => void;
}

export const LoginPageGate: React.FC<LoginPageGateProps> = ({
  user,
  onSignInSuccess,
  onPaymentSuccess,
}) => {
  const [emailInput, setEmailInput] = useState(user?.email || '');
  const [nameInput, setNameInput] = useState(user?.fullName || '');
  const [step, setStep] = useState<'signin' | 'pay' | 'awaiting_prompt'>('signin');
  const [activeOrderId, setActiveOrderId] = useState<string>('');
  const [activeRefNo, setActiveRefNo] = useState<string>('');
  const [countdown, setCountdown] = useState<number>(60);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  // Interpay form state
  const [selectedTier, setSelectedTier] = useState<'1'>('1');
  const [paymentChannel, setPaymentChannel] = useState<'momo' | 'card'>('momo');
  const [mobileNumber, setMobileNumber] = useState('0241234567');
  const [mobileNetwork, setMobileNetwork] = useState<'MTN' | 'VODAFONE' | 'AIRTEL'>('MTN');
  const [voucherCode, setVoucherCode] = useState('');
  const [isPaymentConfirmed, setIsPaymentConfirmed] = useState<boolean>(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const amountStr = '1.00';
  const amountNum = 1.00;

  // Pre-configured accounts for instant quick login test
  const quickAccounts = [
    { email: 'christlife4core@gmail.com', name: 'Christ Life' },
    { email: 'dennel.tech@gmail.com', name: 'Dennel Tech Member' },
  ];

  const handleSelectQuickAccount = (email: string, name: string) => {
    setEmailInput(email);
    setNameInput(name);
    const paid = isEmailPaid(email);
    const paymentRecord = getPaymentRecord(email);

    const newUser: UserProfile = {
      id: `usr_${Date.now()}`,
      googleId: `google_oauth_${Math.random().toString(36).substring(2, 9)}`,
      fullName: name,
      email: email,
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
      signedInDate: new Date().toISOString(),
      lastActiveDate: new Date().toISOString(),
      isPaid: paid,
      paymentDate: paymentRecord?.paymentDate,
      paymentRef: paymentRecord?.transRefNo,
      paymentMethod: paymentRecord?.mobileNetwork || 'Interpay',
      amountPaid: paid ? 1.00 : undefined,
    };

    onSignInSuccess(newUser);

    if (paid) {
      // User is already paid! App will open automatically
    } else {
      setStep('pay');
    }
  };

  const handleCustomSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim() || !emailInput.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setErrorMessage(null);
    const name = nameInput.trim() || emailInput.split('@')[0];
    const paid = isEmailPaid(emailInput);
    const paymentRecord = getPaymentRecord(emailInput);

    const newUser: UserProfile = {
      id: `usr_${Date.now()}`,
      googleId: `custom_email_${Math.random().toString(36).substring(2, 9)}`,
      fullName: name,
      email: emailInput.trim().toLowerCase(),
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
      signedInDate: new Date().toISOString(),
      lastActiveDate: new Date().toISOString(),
      isPaid: paid,
      paymentDate: paymentRecord?.paymentDate,
      paymentRef: paymentRecord?.transRefNo,
      paymentMethod: paymentRecord?.mobileNetwork || 'Interpay',
      amountPaid: paid ? 1.00 : undefined,
    };

    onSignInSuccess(newUser);

    if (!paid) {
      setStep('pay');
    }
  };

  const handleProcessPayment = async (isSandbox: boolean = false) => {
    const activeEmail = user?.email || emailInput.trim();
    const activeName = user?.fullName || nameInput.trim() || activeEmail.split('@')[0];

    if (!activeEmail || !activeEmail.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      setStep('signin');
      return;
    }

    if (paymentChannel === 'momo' && !mobileNumber.trim()) {
      setErrorMessage('Please enter your Mobile Money phone number.');
      return;
    }

    setErrorMessage(null);
    setIsLoading(true);

    const orderId = `PM-${Date.now().toString().slice(-6)}`;
    const transRefNo = `INT-${Math.floor(10000000 + Math.random() * 90000000)}`;
    setActiveRefNo(transRefNo);

    try {
      if (isSandbox) {
        await new Promise((resolve) => setTimeout(resolve, 800));
        // Instant sandbox approval
        const updatedUser: UserProfile = {
          id: user?.id || `user_${Date.now()}`,
          googleId: user?.googleId || `oauth_${Date.now()}`,
          fullName: activeName,
          email: activeEmail.toLowerCase(),
          avatarUrl: user?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(activeName)}`,
          signedInDate: user?.signedInDate || new Date().toISOString(),
          lastActiveDate: new Date().toISOString(),
          isPaid: true,
          paymentDate: new Date().toISOString(),
          paymentRef: transRefNo,
          paymentMethod: 'Sandbox Test',
          amountPaid: amountNum,
        };
        onPaymentSuccess(updatedUser);
        return;
      } else {
        const response = await fetch('/api/interpay/process-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: activeName,
            email: activeEmail,
            mobile: mobileNumber.trim(),
            mobile_network: mobileNetwork,
            voucher_code: voucherCode,
            amount: amountStr,
            currency: 'GHS',
            order_id: orderId,
            order_desc: selectedTier === '1' ? 'AI Prompt Master - 1 Ghc Test Fee' : 'AI Prompt Master - One-Time Lifetime Access Fee',
          }),
        });

        let data: any = {};
        try {
          const contentType = response.headers.get('content-type') || '';
          if (contentType.includes('application/json')) {
            data = await response.json();
          } else {
            data = {};
          }
        } catch {
          data = {};
        }

        if (data.error) {
          throw new Error(data.error);
        }

        if (data.status_code !== 1 || !data.trans_ref_no) {
          const msg = data.status_message || data.error || 'Payment could not be initiated by Interpay. Please try again.';
          throw new Error(msg);
        }

        // USSD Prompt triggered! Store real order/ref and transition to authorization step
        setActiveOrderId(orderId);
        setActiveRefNo(data.trans_ref_no);
        setStep('awaiting_prompt');
        setCountdown(60);
      }
    } catch (err: any) {
      console.error('Payment failed:', err);
      setErrorMessage(err.message || 'Payment initiation failed. Please check network or try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckPaymentStatus = async () => {
    setIsVerifying(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/interpay/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: activeOrderId,
          trans_ref_no: activeRefNo,
        }),
      });

      let data: any = {};
      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (data.error) {
        throw new Error(data.error);
      }

      if (data.status_code !== 1) {
        const msg = data.status_message || data.error || 'Payment not yet confirmed on phone. Please approve the MoMo prompt with your PIN.';
        throw new Error(msg);
      }

      // Only grant access when Interpay reports the transaction as PAID BY CLIENT
      const paid = data.is_paid === true || String(data.trans_status || '').toUpperCase() === 'PAID BY CLIENT';
      if (!paid) {
        throw new Error('Payment not yet confirmed on phone. Please approve the MoMo prompt with your PIN.');
      }

      if (data.trans_ref_no) {
        setActiveRefNo(data.trans_ref_no);
      }
      // Payment verified! Turn on the Enter Platform button
      setIsPaymentConfirmed(true);
    } catch (err: any) {
      console.error('Payment verification failed:', err);
      setErrorMessage(err.message || 'Payment not yet confirmed on phone. Please approve the MoMo prompt with your PIN.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleEnterPlatform = () => {
    if (!isPaymentConfirmed) return;

    const activeEmail = user?.email || emailInput.trim();
    const activeName = user?.fullName || nameInput.trim() || activeEmail.split('@')[0];

    const updatedUser: UserProfile = {
      id: user?.id || `user_${Date.now()}`,
      googleId: user?.googleId || `oauth_${Date.now()}`,
      fullName: activeName,
      email: activeEmail.toLowerCase(),
      avatarUrl: user?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(activeName)}`,
      signedInDate: user?.signedInDate || new Date().toISOString(),
      lastActiveDate: new Date().toISOString(),
      isPaid: true,
      paymentDate: new Date().toISOString(),
      paymentRef: activeRefNo || `INT-${Math.floor(10000000 + Math.random() * 90000000)}`,
      paymentMethod: mobileNetwork,
      amountPaid: amountNum,
    };

    onPaymentSuccess(updatedUser);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-emerald-500 selection:text-slate-950 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <header className="p-6 max-w-7xl mx-auto w-full flex items-center justify-between border-b border-slate-800/80 relative z-10">
        <DennelLogo size={40} showSubtitle={true} lightText={true} />
        <div className="flex items-center gap-2 bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-inner">
          <Lock className="w-3.5 h-3.5" />
          <span>Restricted Access Gateway</span>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-4 py-12 relative z-10">
        <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Product Value Highlights */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>One-Time Lifetime Access</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Sign In & Activate AI Prompt Master
            </h1>

            <p className="text-sm text-slate-300 leading-relaxed">
              Unlock our complete suite of structured prompt engineering frameworks (RTF, TAG, CARE, BAB, RISEN, etc.), real-time dual-window generator, and Android app build exporter.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3 bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white">Full Prompt Engineering Suite</h4>
                  <p className="text-[11px] text-slate-400">Build high-performing AI prompts for Gemini, ChatGPT, Claude, and Llama.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white">Interpay Ghana MoMo Gateway</h4>
                  <p className="text-[11px] text-slate-400">Pay once via MTN MoMo, Telecel, or AirtelTigo for lifetime access.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white">Test Option (Ghc 1.00) Included</h4>
                  <p className="text-[11px] text-slate-400">Easily test live Mobile Money or Sandbox payments with a 1 Ghc charge.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Sign In & Payment Gate Box */}
          <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6">
            
            {/* Steps Indicator */}
            <div className="flex items-center gap-2 border-b border-slate-800 pb-4">
              <button
                type="button"
                onClick={() => setStep('signin')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-bold transition-all ${
                  step === 'signin'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-slate-800/40 text-slate-400 border border-slate-800'
                }`}
              >
                <span className="w-4 h-4 rounded-full bg-emerald-500/30 flex items-center justify-center text-[10px] text-emerald-300 font-black">1</span>
                <span>Sign In</span>
              </button>

              <button
                type="button"
                disabled={!user && !emailInput}
                onClick={() => setStep('pay')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-bold transition-all ${
                  step === 'pay'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-slate-800/40 text-slate-400 border border-slate-800 opacity-60'
                }`}
              >
                <span className="w-4 h-4 rounded-full bg-amber-500/30 flex items-center justify-center text-[10px] text-amber-300 font-black">2</span>
                <span>Pay Fee</span>
              </button>

              <button
                type="button"
                disabled={step !== 'awaiting_prompt'}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-bold transition-all ${
                  step === 'awaiting_prompt'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 ring-2 ring-amber-500/20'
                    : 'bg-slate-800/20 text-slate-500 border border-slate-800/50'
                }`}
              >
                <span className="w-4 h-4 rounded-full bg-indigo-500/30 flex items-center justify-center text-[10px] text-indigo-300 font-black">3</span>
                <span>Approve Phone</span>
              </button>
            </div>

            {errorMessage && (
              <div className="bg-red-950/50 border border-red-800/80 rounded-xl p-3 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {step === 'signin' ? (
              /* STEP 1: SIGN IN */
              <div className="space-y-5">
                <div>
                  <h3 className="text-lg font-bold text-white">1. Sign In With Email</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Sign in to check if your account is already activated or proceed to payment.
                  </p>
                </div>

                {/* Quick Account Selectors */}
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Quick Select Google Accounts
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {quickAccounts.map((acc) => {
                      const paid = isEmailPaid(acc.email);
                      return (
                        <button
                          key={acc.email}
                          type="button"
                          onClick={() => handleSelectQuickAccount(acc.email, acc.name)}
                          className="w-full flex items-center justify-between p-3 rounded-2xl border border-slate-800 bg-slate-800/40 hover:bg-slate-800/80 hover:border-emerald-500/50 transition-all text-left group cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(acc.name)}`}
                              alt={acc.name}
                              className="w-9 h-9 rounded-full border border-slate-700"
                            />
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="text-xs font-semibold text-white">{acc.name}</p>
                                {paid ? (
                                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-bold">✓ Paid</span>
                                ) : (
                                  <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full font-bold">Unpaid (Ghc 1.00)</span>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-400">{acc.email}</p>
                            </div>
                          </div>
                          <span className="text-xs text-emerald-400 font-bold group-hover:translate-x-1 transition-transform">
                            {paid ? 'Open App →' : 'Select →'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-800"></div></div>
                  <div className="relative flex justify-center text-[10px] uppercase font-bold text-slate-500"><span className="bg-slate-900 px-3">or custom email</span></div>
                </div>

                <form onSubmit={handleCustomSignIn} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Account Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white text-xs font-semibold focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      placeholder="e.g. Kwesi Mensah"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white text-xs font-semibold focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-emerald-600/20 transition-all text-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Continue to Payment</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </div>
            ) : step === 'pay' ? (
              /* STEP 2: INTERPAY PAYMENT FORM */
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white">2. Pay Access Fee via Interpay</h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Account: <strong className="text-emerald-400">{user?.email || emailInput}</strong>
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep('signin')}
                    className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
                  >
                    Change Email
                  </button>
                </div>

                {/* Amount Fee Banner */}
                <div className="p-4 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 text-white flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400">
                      Platform Access Fee
                    </div>
                    <div className="text-2xl font-black text-white mt-0.5">
                      Ghc 1.00
                    </div>
                    <div className="text-[11px] text-slate-300">
                      Flat Rate (All Features Included)
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300 font-bold text-sm">
                    GHS
                  </div>
                </div>

                {/* Payment Channel */}
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Payment Method
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentChannel('momo')}
                      className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                        paymentChannel === 'momo'
                          ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300'
                          : 'border-slate-800 bg-slate-950 text-slate-400'
                      }`}
                    >
                      <Smartphone className="w-4 h-4 text-emerald-400" />
                      <span>Mobile Money</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentChannel('card')}
                      className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                        paymentChannel === 'card'
                          ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300'
                          : 'border-slate-800 bg-slate-950 text-slate-400'
                      }`}
                    >
                      <CreditCard className="w-4 h-4 text-emerald-400" />
                      <span>Bank Card</span>
                    </button>
                  </div>
                </div>

                {paymentChannel === 'momo' ? (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">
                        Select MoMo Provider
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {(['MTN', 'VODAFONE', 'AIRTEL'] as const).map((net) => (
                          <button
                            key={net}
                            type="button"
                            onClick={() => setMobileNetwork(net)}
                            className={`py-2 px-2.5 rounded-lg border text-xs font-bold transition-all ${
                              mobileNetwork === net
                                ? 'border-emerald-500 bg-emerald-600 text-white'
                                : 'border-slate-800 bg-slate-950 text-slate-400'
                            }`}
                          >
                            {net === 'VODAFONE' ? 'Telecel' : net === 'AIRTEL' ? 'AirtelTigo' : 'MTN MoMo'}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">
                        Mobile Money Number
                      </label>
                      <input
                        type="tel"
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value)}
                        placeholder="0241234567"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white text-xs font-semibold focus:ring-2 focus:ring-emerald-500 outline-none"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-400">
                    Standard Visa, Mastercard, or Gh-Link cards supported via Interpay gateway.
                  </div>
                )}

                {/* Submit Action Buttons */}
                <div className="space-y-2.5 pt-2">
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={() => handleProcessPayment(false)}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-600/30 transition-all text-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-white" />
                        <span>Sending Request to Mobile Money...</span>
                      </>
                    ) : (
                      <>
                        <Smartphone className="w-4 h-4 text-emerald-200" />
                        <span>Send MoMo Prompt (Ghc {amountStr})</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={() => handleProcessPayment(true)}
                    className="w-full bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 font-bold py-2.5 rounded-xl transition-all text-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>Instant Sandbox Test Payment (Ghc {amountStr})</span>
                  </button>
                </div>
              </div>
            ) : (
              /* STEP 3: AWAITING MOBILE MONEY USSD PROMPT ON PHONE */
              <div className="space-y-5 text-center py-2">
                {/* Animated Pulsing Phone Graphic */}
                <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                  <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-ping" />
                  <div className="absolute inset-2 bg-emerald-500/30 rounded-full animate-pulse" />
                  <div className="relative w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30 text-white">
                    <Smartphone className="w-7 h-7 animate-bounce" />
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-black text-white">
                    Check Phone for MoMo PIN Prompt
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 max-w-sm mx-auto">
                    A payment prompt of <strong className="text-amber-300 font-black">Ghc {amountStr}</strong> has been sent to phone number <strong className="text-emerald-400 font-bold">{mobileNumber}</strong> ({mobileNetwork}).
                  </p>
                </div>

                {/* Mobile Money USSD Approval Steps Box */}
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-left space-y-3">
                  <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center justify-between">
                    <span>📱 How to approve on your phone:</span>
                    <span className="text-slate-400 font-mono text-[10px]">Ref: {activeRefNo}</span>
                  </div>

                  <ol className="text-xs space-y-2 text-slate-300 list-decimal list-inside">
                    <li>
                      <strong className="text-white">USSD Push Prompt:</strong> Look out for the popup on your phone screen asking for your Mobile Money PIN.
                    </li>
                    <li>
                      <strong className="text-white">Enter PIN:</strong> Enter your secret MoMo PIN to authorize the payment of <strong>Ghc {amountStr}</strong>.
                    </li>
                    {mobileNetwork === 'MTN' && (
                      <li className="bg-amber-950/40 border border-amber-500/30 p-2.5 rounded-xl text-[11px] text-amber-200 mt-2">
                        💡 <strong>MTN Prompt Disappeared?</strong> Dial <code className="bg-amber-900/60 px-1 py-0.5 rounded font-bold text-white">*170#</code> ➔ Select <strong>Option 6 (My Wallet)</strong> ➔ Select <strong>Option 3 (My Approvals)</strong> ➔ Enter PIN to complete authorization.
                      </li>
                    )}
                    {mobileNetwork === 'VODAFONE' && (
                      <li className="bg-amber-950/40 border border-amber-500/30 p-2.5 rounded-xl text-[11px] text-amber-200 mt-2">
                        💡 <strong>Telecel User?</strong> Dial <code className="bg-amber-900/60 px-1 py-0.5 rounded font-bold text-white">*110#</code> ➔ Generate transaction voucher code and approve.
                      </li>
                    )}
                  </ol>
                </div>

                {/* Verification Status Banner */}
                {isPaymentConfirmed ? (
                  <div className="p-3 bg-emerald-500/20 border border-emerald-500/50 rounded-xl text-emerald-300 text-xs font-bold flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Payment Confirmed & Verified! You can now enter the platform.</span>
                  </div>
                ) : (
                  <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-300 text-xs font-semibold flex items-center justify-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                    <span>Awaiting phone PIN authorization... Enter your MoMo PIN on phone.</span>
                  </div>
                )}

                {/* Verification Action Buttons */}
                <div className="space-y-3 pt-1">
                  {/* Step 1: Check / Verify Payment Button */}
                  <button
                    type="button"
                    disabled={isVerifying}
                    onClick={handleCheckPaymentStatus}
                    className="w-full bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold py-3 rounded-xl border border-slate-700 shadow-md transition-all text-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isVerifying ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                        <span>Checking Mobile Money Status...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>1. Verify Mobile Money Authorization</span>
                      </>
                    )}
                  </button>

                  {/* Step 2: Gated Enter Platform Button (OFF until payment is confirmed) */}
                  <button
                    type="button"
                    disabled={!isPaymentConfirmed}
                    onClick={handleEnterPlatform}
                    className={`w-full font-black py-3.5 rounded-xl transition-all text-xs flex items-center justify-center gap-2 cursor-pointer ${
                      isPaymentConfirmed
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl shadow-emerald-600/40 ring-2 ring-emerald-400/50 animate-pulse'
                        : 'bg-slate-900 border border-slate-800 text-slate-500 opacity-60 cursor-not-allowed'
                    }`}
                  >
                    {isPaymentConfirmed ? (
                      <>
                        <Sparkles className="w-4 h-4 text-amber-300" />
                        <span>2. Payment Verified — Enter Platform & Open App →</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 text-slate-500" />
                        <span>2. Enter Platform (OFF — Complete & Verify Payment First)</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-between gap-2 text-xs pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setIsPaymentConfirmed(false);
                        handleProcessPayment(false);
                      }}
                      className="text-slate-400 hover:text-white underline text-[11px] cursor-pointer"
                    >
                      Resend USSD Prompt
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsPaymentConfirmed(false);
                        setStep('pay');
                      }}
                      className="text-slate-400 hover:text-white underline text-[11px] cursor-pointer"
                    >
                      Change Phone Number
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Footer Note */}
            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 pt-2 border-t border-slate-800/80">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Interpay Africa Secure Merchant Gateway</span>
            </div>

          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-slate-600 text-xs border-t border-slate-800/80 relative z-10">
        © {new Date().getFullYear()} Dennel Technologies AI. All rights reserved. Interpay Payment Integration.
      </footer>
    </div>
  );
};
