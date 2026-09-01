import React, { useState } from 'react';
import { UserProfile, PaymentRecord } from '../types';
import { recordSuccessfulPayment } from '../utils/storage';
import { DennelLogo } from './DennelLogo';
import { Smartphone, CreditCard, ShieldCheck, CheckCircle2, Lock, ArrowRight, X, AlertCircle, RefreshCw, Zap, Sparkles } from 'lucide-react';

interface InterpayModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile | null;
  onPaymentSuccess: (updatedUser: UserProfile) => void;
  prefilledEmail?: string;
}

export const InterpayModal: React.FC<InterpayModalProps> = ({
  isOpen,
  onClose,
  user,
  onPaymentSuccess,
  prefilledEmail = ''
}) => {
  const [paymentChannel, setPaymentChannel] = useState<'momo' | 'card'>('momo');
  const [selectedTier, setSelectedTier] = useState<'1'>('1');
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [email, setEmail] = useState(user?.email || prefilledEmail || '');
  const [mobile, setMobile] = useState('0241234567');
  const [mobileNetwork, setMobileNetwork] = useState<'MTN' | 'VODAFONE' | 'AIRTEL'>('MTN');
  const [voucherCode, setVoucherCode] = useState('');
  const [isPaymentConfirmed, setIsPaymentConfirmed] = useState<boolean>(false);
  
  // Card fields
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'awaiting_usdd' | 'success' | 'error'>('idle');
  const [activeOrderId, setActiveOrderId] = useState<string>('');
  const [activeRefNo, setActiveRefNo] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<PaymentRecord | null>(null);

  if (!isOpen) return null;

  const currentAmountStr = '1.00';
  const currentAmountNum = 1.00;

  const handleProcessPayment = async (isSandbox: boolean = false) => {
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (paymentChannel === 'momo' && !mobile.trim()) {
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
        // Fast sandbox simulation for developer testing
        await new Promise((resolve) => setTimeout(resolve, 800));

        const newRecord: PaymentRecord = {
          email: email.trim().toLowerCase(),
          fullName: fullName.trim() || 'AI Prompt Master Member',
          amount: currentAmountNum,
          currency: 'GHS',
          orderId,
          transRefNo,
          mobileNumber: mobile,
          mobileNetwork: 'Sandbox Test',
          paymentDate: new Date().toISOString(),
          status: 'PAID',
        };

        recordSuccessfulPayment(newRecord);
        setReceipt(newRecord);

        const updatedUser: UserProfile = {
          id: user?.id || `user_${Date.now()}`,
          googleId: user?.googleId || `local_${Date.now()}`,
          fullName: fullName.trim() || email.split('@')[0],
          email: email.trim().toLowerCase(),
          avatarUrl: user?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}`,
          signedInDate: user?.signedInDate || new Date().toISOString(),
          lastActiveDate: new Date().toISOString(),
          isPaid: true,
          paymentDate: newRecord.paymentDate,
          paymentRef: transRefNo,
          paymentMethod: 'Sandbox Test',
          amountPaid: currentAmountNum,
        };

        setPaymentStatus('success');
        onPaymentSuccess(updatedUser);
        return;
      } else {
        // Call backend server Interpay API route
        const response = await fetch('/api/interpay/process-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: fullName || 'Valued User',
            email: email.trim(),
            mobile: mobile.trim(),
            mobile_network: mobileNetwork,
            voucher_code: voucherCode,
            amount: currentAmountStr,
            currency: 'GHS',
            order_id: orderId,
            order_desc: selectedTier === '1' ? 'AI Prompt Master - 1 Ghc Testing Fee' : 'AI Prompt Master - One-Time Lifetime Access Fee',
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

        // Real Interpay transaction initiated - store refs and wait for phone prompt
        setActiveOrderId(orderId);
        setActiveRefNo(data.trans_ref_no);
        setPaymentStatus('awaiting_usdd');
      }
    } catch (err: any) {
      console.error('Interpay Payment Error:', err);
      setErrorMessage(err.message || 'Interpay network connection failed. Please try again.');
      setPaymentStatus('error');
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
      setIsPaymentConfirmed(true);
    } catch (err: any) {
      console.error('Payment verification failed:', err);
      setErrorMessage(err.message || 'Payment not yet confirmed on phone. Please approve the MoMo prompt with your PIN.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleConfirmAuthorized = async () => {
    if (!isPaymentConfirmed) return;

    setIsVerifying(true);
    setErrorMessage(null);

    const transRefNo = activeRefNo || `INT-${Math.floor(10000000 + Math.random() * 90000000)}`;

    await new Promise((resolve) => setTimeout(resolve, 1500));

    const newRecord: PaymentRecord = {
      email: email.trim().toLowerCase(),
      fullName: fullName.trim() || 'AI Prompt Master Member',
      amount: currentAmountNum,
      currency: 'GHS',
      orderId: activeOrderId,
      transRefNo,
      mobileNumber: mobile,
      mobileNetwork: paymentChannel === 'momo' ? mobileNetwork : 'CARD',
      paymentDate: new Date().toISOString(),
      status: 'PAID',
    };

    recordSuccessfulPayment(newRecord);
    setReceipt(newRecord);

    const updatedUser: UserProfile = {
      id: user?.id || `user_${Date.now()}`,
      googleId: user?.googleId || `local_${Date.now()}`,
      fullName: fullName.trim() || email.split('@')[0],
      email: email.trim().toLowerCase(),
      avatarUrl: user?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}`,
      signedInDate: user?.signedInDate || new Date().toISOString(),
      lastActiveDate: new Date().toISOString(),
      isPaid: true,
      paymentDate: newRecord.paymentDate,
      paymentRef: transRefNo,
      paymentMethod: newRecord.mobileNetwork,
      amountPaid: currentAmountNum,
    };

    setIsVerifying(false);
    setPaymentStatus('success');
    onPaymentSuccess(updatedUser);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-xl overflow-hidden my-8 transition-all">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 p-6 text-white relative border-b border-emerald-500/20">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-3">
            <DennelLogo size={42} showText={false} />
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 bg-amber-500/20 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                Interpay Merchant Gateway
              </span>
              <h2 className="text-2xl font-extrabold tracking-tight text-white">One-Time Access Activation</h2>
            </div>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Pay <strong className="text-emerald-400 text-sm">Ghc 1.00</strong> once to unlock lifetime access to AI Prompt Master. Log in anytime with this email!
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {paymentStatus === 'success' && receipt ? (
            /* Success Receipt View */
            <div className="text-center space-y-5 py-4">
              <div className="w-16 h-16 bg-emerald-500/10 border-2 border-emerald-500 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20 animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">Payment Successful!</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Ghc {currentAmountStr} received via Interpay Africa. Your email address is now activated for lifetime access.
                </p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 text-left text-xs space-y-2">
                <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                  <span className="text-slate-500">Activated Email:</span>
                  <strong className="text-slate-900 dark:text-white">{receipt.email}</strong>
                </div>
                <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                  <span className="text-slate-500">Amount Paid:</span>
                  <strong className="text-emerald-600 dark:text-emerald-400 font-bold">Ghc {currentAmountStr} (One-Time)</strong>
                </div>
                <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                  <span className="text-slate-500">Interpay Ref No:</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300">{receipt.transRefNo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Provider:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{receipt.mobileNetwork} Mobile Money</span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-600/30 transition-all text-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Enter Platform Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : paymentStatus === 'awaiting_usdd' ? (
            /* Awaiting USSD Phone Authorization View */
            <div className="text-center space-y-5 py-2">
              <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-ping" />
                <div className="absolute inset-2 bg-emerald-500/30 rounded-full animate-pulse" />
                <div className="relative w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30 text-white">
                  <Smartphone className="w-7 h-7 animate-bounce" />
                </div>
              </div>

              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                  Check Your Phone for MoMo PIN Prompt
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 max-w-sm mx-auto">
                  Payment prompt of <strong className="text-amber-600 dark:text-amber-300 font-black">Ghc {currentAmountStr}</strong> sent to <strong className="text-emerald-600 dark:text-emerald-400 font-bold">{mobile}</strong> ({mobileNetwork}).
                </p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-left space-y-3">
                <div className="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center justify-between">
                  <span>📱 Steps to authorize on phone:</span>
                  <span className="text-slate-400 font-mono text-[10px]">Ref: {activeRefNo}</span>
                </div>

                <ol className="text-xs space-y-2 text-slate-700 dark:text-slate-300 list-decimal list-inside">
                  <li>
                    <strong>USSD Push Prompt:</strong> Approve the popup prompt on your phone screen with your MoMo PIN.
                  </li>
                  <li>
                    <strong>Deduction:</strong> Funds (Ghc {currentAmountStr}) will be deducted from your Mobile Money wallet.
                  </li>
                  {mobileNetwork === 'MTN' && (
                    <li className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-500/30 p-2.5 rounded-xl text-[11px] text-amber-900 dark:text-amber-200 mt-2">
                      💡 <strong>MTN Prompt Disappeared?</strong> Dial <code className="bg-amber-200 dark:bg-amber-900/60 px-1 py-0.5 rounded font-bold text-slate-900 dark:text-white">*170#</code> ➔ Option 6 (My Wallet) ➔ Option 3 (My Approvals) ➔ Enter PIN.
                    </li>
                  )}
                </ol>
              </div>

              {/* Verification Status Banner */}
              {isPaymentConfirmed ? (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-500/50 rounded-xl text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Payment Confirmed & Verified! Access Granted.</span>
                </div>
              ) : (
                <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-500/30 rounded-xl text-amber-900 dark:text-amber-300 text-xs font-semibold flex items-center justify-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-amber-600 dark:text-amber-400" />
                  <span>Awaiting MoMo PIN authorization on your phone...</span>
                </div>
              )}

              <div className="space-y-2.5 pt-1">
                {/* Step 1: Verify Payment Button */}
                <button
                  type="button"
                  disabled={isVerifying}
                  onClick={handleCheckPaymentStatus}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-xl border border-slate-700 shadow-md transition-all text-xs flex items-center justify-center gap-2 cursor-pointer"
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

                {/* Step 2: Gated Enter Platform Button */}
                <button
                  type="button"
                  disabled={!isPaymentConfirmed}
                  onClick={handleConfirmAuthorized}
                  className={`w-full font-black py-3.5 rounded-xl transition-all text-xs flex items-center justify-center gap-2 cursor-pointer ${
                    isPaymentConfirmed
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl shadow-emerald-600/40 ring-2 ring-emerald-400/50 animate-pulse'
                      : 'bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-400 opacity-60 cursor-not-allowed'
                  }`}
                >
                  {isPaymentConfirmed ? (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>2. Payment Verified — Unlock Platform & Open App →</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 text-slate-400" />
                      <span>2. Unlock Platform (OFF — Complete & Verify Payment First)</span>
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
                    className="text-slate-500 hover:text-slate-900 dark:hover:text-white underline text-[11px] cursor-pointer"
                  >
                    Resend Prompt
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsPaymentConfirmed(false);
                      setPaymentStatus('idle');
                    }}
                    className="text-slate-500 hover:text-slate-900 dark:hover:text-white underline text-[11px] cursor-pointer"
                  >
                    Change Payment Details
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Payment Form */
            <>
              {/* Fee Banner */}
              <div className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                    One-Time Platform Access Fee
                  </div>
                  <div className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
                    Ghc 1.00
                  </div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-300">
                    All Pro AI Features & Prompts Included
                  </div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-700 dark:text-emerald-300 font-bold text-sm">
                  GHS
                </div>
              </div>

              {errorMessage && (
                <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 rounded-xl p-3 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Payment Channel Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Select Payment Method
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentChannel('momo')}
                    className={`p-3.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      paymentChannel === 'momo'
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <Smartphone className="w-4 h-4 text-emerald-600" />
                    <span>Mobile Money (Ghana)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentChannel('card')}
                    className={`p-3.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      paymentChannel === 'card'
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-emerald-600" />
                    <span>Visa / Mastercard / GH-Link</span>
                  </button>
                </div>
              </div>

              {/* Account Details */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Subscriber Email (Used for Login Access)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    You can log in anytime using this exact email address after paying.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Kwesi Mensah"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>

                {paymentChannel === 'momo' ? (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Select Mobile Network
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {(['MTN', 'VODAFONE', 'AIRTEL'] as const).map((net) => (
                          <button
                            key={net}
                            type="button"
                            onClick={() => setMobileNetwork(net)}
                            className={`py-2 px-3 rounded-lg border text-xs font-bold transition-all ${
                              mobileNetwork === net
                                ? 'border-emerald-600 bg-emerald-600 text-white shadow-xs'
                                : 'border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            {net === 'VODAFONE' ? 'Telecel / Voda' : net === 'AIRTEL' ? 'AirtelTigo' : 'MTN MoMo'}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Mobile Money Number
                      </label>
                      <input
                        type="tel"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        placeholder="0241234567 or +233241234567"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-emerald-500 outline-none"
                      />
                    </div>

                    {mobileNetwork === 'VODAFONE' && (
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Telecel Voucher Code (Dial *110# on Telecel)
                        </label>
                        <input
                          type="text"
                          value={voucherCode}
                          onChange={(e) => setVoucherCode(e.target.value)}
                          placeholder="6-digit Telecel voucher code"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-emerald-500 outline-none"
                        />
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Card Number
                      </label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="4111 2222 3333 4444"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-emerald-500 outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Expiry (MM/YY)
                        </label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="12/28"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-emerald-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          CVV
                        </label>
                        <input
                          type="text"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          placeholder="123"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-emerald-500 outline-none"
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="space-y-3 pt-2">
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => handleProcessPayment(false)}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-600/20 transition-all text-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-white" />
                      <span>Contacting Interpay Merchant Server...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 text-emerald-200" />
                      <span>Pay Ghc {currentAmountStr} via Interpay</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => handleProcessPayment(true)}
                  className="w-full bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-800 dark:text-amber-300 font-bold py-2.5 rounded-xl transition-all text-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  <span>Instant Sandbox Demo Payment (Ghc {currentAmountStr})</span>
                </button>
              </div>

              {/* Security Footer */}
              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-800">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Secured by Interpay Africa REST API • Powered by Dennel Technologies AI</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
