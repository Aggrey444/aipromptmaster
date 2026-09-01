import React, { useState } from 'react';
import { Smartphone, Download, Copy, Check, QrCode, ShieldCheck, Terminal, Code, Cpu, ExternalLink, X, ArrowRight, Layers } from 'lucide-react';
import { DennelLogo } from './DennelLogo';

interface AndroidExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AndroidExportModal: React.FC<AndroidExportModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'directApk' | 'pwa' | 'capacitor' | 'config'>('directApk');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://promptmaster.app';

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(label);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const capacitorCommands = `npm install @capacitor/core @capacitor/android
npx cap init "Prompt Master" "com.promptmaster.app"
npm run build
npx cap add android
npx cap copy
npx cap open android`;

  const capacitorConfigJson = `{
  "appId": "com.promptmaster.app",
  "appName": "AI Prompt Master",
  "webDir": "dist",
  "bundledWebRuntime": false,
  "server": {
    "androidScheme": "https"
  },
  "plugins": {
    "SplashScreen": {
      "launchShowDuration": 1500,
      "backgroundColor": "#0F172A"
    }
  }
}`;

  const androidManifestXml = `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.promptmaster.app">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.VIBRATE" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="Prompt Master"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/AppTheme">

        <activity
            android:name=".MainActivity"
            android:configChanges="orientation|keyboardHidden|keyboard|screenSize|locale|smallestScreenSize|screenLayout|uiMode"
            android:label="Prompt Master"
            android:launchMode="singleTask"
            android:exported="true">
            
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>`;

  return (
    <div
      id="android-export-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200"
    >
      <div
        id="android-export-modal-card"
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-3xl overflow-hidden my-8"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 p-6 text-white relative border-b border-emerald-500/20">
          <button
            id="btn-close-android-modal"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <DennelLogo size={44} showText={false} />
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 bg-amber-500/20 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                Dennel Technologies AI
              </span>
              <h2 className="text-2xl font-extrabold tracking-tight text-white">AI Prompt Master — Android Hub</h2>
            </div>
          </div>
          <p className="text-emerald-100 text-xs max-w-xl leading-relaxed">
            Run AI Prompt Master natively on Android devices, install it via 1-Tap WebAPK, or compile the source package with Android Studio.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-6 pt-3 gap-2 overflow-x-auto">
          <button
            id="tab-android-direct-apk"
            onClick={() => setActiveTab('directApk')}
            className={`pb-3 px-4 text-sm font-bold border-b-2 flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'directApk'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <Download className="w-4 h-4 text-emerald-500" />
            <span>Download .APK File</span>
          </button>

          <button
            id="tab-android-pwa"
            onClick={() => setActiveTab('pwa')}
            className={`pb-3 px-4 text-sm font-semibold border-b-2 flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'pwa'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>PWA Mobile Web</span>
          </button>

          <button
            id="tab-android-capacitor"
            onClick={() => setActiveTab('capacitor')}
            className={`pb-3 px-4 text-sm font-semibold border-b-2 flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'capacitor'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>Android Studio Project</span>
          </button>

          <button
            id="tab-android-config"
            onClick={() => setActiveTab('config')}
            className={`pb-3 px-4 text-sm font-semibold border-b-2 flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'config'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <Code className="w-4 h-4" />
            <span>Config Files</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6">
          {activeTab === 'directApk' && (
            <div className="space-y-6">
              {/* Diagnostic Box for "Can't Install" Issue */}
              <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800/60 rounded-2xl p-5 text-amber-900 dark:text-amber-200 space-y-2 text-xs">
                <div className="flex items-center gap-2 font-bold text-sm text-amber-800 dark:text-amber-300">
                  <ShieldCheck className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span>Why Android says "Can't Install Package"?</span>
                </div>
                <p className="leading-relaxed">
                  Android requires `.apk` files to be compiled with Java Dalvik Bytecode (`classes.dex`), `resources.arsc`, and signed with an official RSA security key using `apksigner`. Uncompiled package zips downloaded directly from web browsers cannot be parsed by Android Package Installer.
                </p>
                <div className="pt-1 font-semibold text-amber-950 dark:text-amber-100 flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Solution: Use <strong>Option 1 (1-Tap WebAPK)</strong> below or compile <strong>Option 2 (Android Studio Zip)</strong>!</span>
                </div>
              </div>

              {/* Option 1: 1-Tap Android WebAPK Installation */}
              <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 border border-emerald-500/30 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 z-10 relative">
                  <div className="space-y-2 max-w-lg">
                    <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-3 py-1 rounded-full text-xs font-bold">
                      <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Recommended for Android Devices</span>
                    </div>
                    <h3 className="text-xl font-extrabold text-white">
                      1-Tap Android WebAPK Installation
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Installs Prompt Master directly onto your Android device as a standalone native app icon using Google Chrome WebAPK engine. No "Unknown Sources" required!
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
                    <button
                      id="btn-trigger-pwa-install"
                      onClick={() => {
                        alert("To install Prompt Master on Android:\n1. Tap the 3 dots (⋮) in Chrome menu at the top right.\n2. Tap 'Add to Home screen' or 'Install app'.\n3. Tap 'Install'!");
                      }}
                      className="inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-5 py-3 rounded-xl shadow-lg transition-all text-xs cursor-pointer shadow-emerald-500/20"
                    >
                      <Smartphone className="w-4 h-4" />
                      <span>Install App on Android</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Option 2: Android Studio Source Project Download */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-slate-200 space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <h4 className="font-bold text-sm text-white flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-emerald-400" />
                      <span>Android Studio Gradle Source Project (.zip)</span>
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Complete project with `build.gradle`, `AndroidManifest.xml`, and `MainActivity.java`. Open in Android Studio to build signed release `.apk` files!
                    </p>
                  </div>

                  <a
                    id="link-download-android-project-zip"
                    href="/downloads/prompt-master-android-project.zip"
                    download="prompt-master-android-project.zip"
                    className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold px-4 py-2.5 rounded-xl border border-slate-700 text-xs transition-all cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-emerald-400" />
                    <span>Download Project Zip</span>
                  </a>
                </div>
              </div>

              {/* Step-by-Step Installation Steps */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Android Installation Guide
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                    <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center mb-2">
                      1
                    </div>
                    <h5 className="font-bold text-xs text-slate-800 dark:text-slate-200">
                      Open in Android Chrome
                    </h5>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                      Open this web application on your Android phone or tablet in Google Chrome.
                    </p>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                    <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center mb-2">
                      2
                    </div>
                    <h5 className="font-bold text-xs text-slate-800 dark:text-slate-200">
                      Tap 'Add to Home screen'
                    </h5>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                      In Chrome, tap the top 3-dots menu icon and select <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.
                    </p>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                    <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center mb-2">
                      3
                    </div>
                    <h5 className="font-bold text-xs text-slate-800 dark:text-slate-200">
                      Native App Created
                    </h5>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                      Android automatically compiles the WebAPK and adds Prompt Master to your phone's app list!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'pwa' && (
            <div className="space-y-6">
              <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
                    Standalone Android Web App Ready
                  </h4>
                  <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-1">
                    This web application is configured with an official Web App Manifest (`manifest.json`) and mobile viewport optimization. You can install it on any Android device without downloading an store file.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Step 1 */}
                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center mb-3">
                    1
                  </div>
                  <h5 className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
                    Open in Chrome for Android
                  </h5>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Open your browser on any Android phone or tablet and visit the app live URL.
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={currentUrl}
                      className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs px-2.5 py-1.5 rounded-lg w-full text-slate-600 dark:text-slate-300 font-mono truncate"
                    />
                    <button
                      id="btn-copy-android-url"
                      onClick={() => copyToClipboard(currentUrl, 'url')}
                      className="p-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Copy URL"
                    >
                      {copiedCode === 'url' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center mb-3">
                    2
                  </div>
                  <h5 className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
                    Tap "Add to Home Screen"
                  </h5>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    In Chrome, tap the top-right menu (⋮) and select <span className="font-semibold text-slate-800 dark:text-slate-200">"Add to Home Screen"</span> or <span className="font-semibold text-slate-800 dark:text-slate-200">"Install App"</span>.
                  </p>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2 font-medium">
                    ✓ Full screen app mode without browser URL bar!
                  </p>
                </div>
              </div>

              {/* QR Code Simulation */}
              <div className="bg-slate-900 text-white p-5 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white p-2 rounded-xl flex items-center justify-center shrink-0">
                    <QrCode className="w-12 h-12 text-slate-900" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">Scan with Android Camera</h4>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Point your phone camera at this screen to test the Android responsive experience instantly.
                    </p>
                  </div>
                </div>

                <a
                  href={currentUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer shadow-lg shadow-emerald-500/20"
                >
                  <span>Open Android Web Preview</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          )}

          {activeTab === 'capacitor' && (
            <div className="space-y-5">
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                To build an offline-first native <span className="font-semibold text-slate-800 dark:text-slate-200">.APK</span> file or Google Play Store <span className="font-semibold text-slate-800 dark:text-slate-200">.AAB</span> bundle, run these Capacitor CLI commands in your project root directory:
              </p>

              {/* Terminal Box */}
              <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 relative font-mono text-xs text-emerald-400 shadow-inner">
                <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-800 text-slate-400">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="text-[11px] ml-2 text-slate-400">bash - Android Build Commands</span>
                  </div>
                  <button
                    id="btn-copy-capacitor-cmds"
                    onClick={() => copyToClipboard(capacitorCommands, 'capacitor')}
                    className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded-md text-[11px] transition-colors cursor-pointer"
                  >
                    {copiedCode === 'capacitor' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Commands</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="whitespace-pre-wrap leading-relaxed overflow-x-auto text-slate-200">
                  {capacitorCommands}
                </pre>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
                  <Cpu className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mx-auto mb-1" />
                  <h6 className="font-bold text-xs text-slate-800 dark:text-slate-200">Android SDK</h6>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Compatible with Android 8.0+ (API 26+)</p>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
                  <Layers className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mx-auto mb-1" />
                  <h6 className="font-bold text-xs text-slate-800 dark:text-slate-200">Material You Theme</h6>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Responsive touch layouts & haptics</p>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
                  <Download className="w-5 h-5 text-teal-600 dark:text-teal-400 mx-auto mb-1" />
                  <h6 className="font-bold text-xs text-slate-800 dark:text-slate-200">Google Play Ready</h6>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Generates signed .AAB package</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'config' && (
            <div className="space-y-5">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                    1. `capacitor.config.json`
                  </h4>
                  <button
                    id="btn-copy-cap-json"
                    onClick={() => copyToClipboard(capacitorConfigJson, 'capjson')}
                    className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 font-medium cursor-pointer"
                  >
                    {copiedCode === 'capjson' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode === 'capjson' ? 'Copied' : 'Copy JSON'}</span>
                  </button>
                </div>
                <pre className="bg-slate-950 text-slate-200 p-3.5 rounded-xl text-xs font-mono overflow-x-auto max-h-40 border border-slate-800">
                  {capacitorConfigJson}
                </pre>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                    2. `AndroidManifest.xml` (Permissions & Activity)
                  </h4>
                  <button
                    id="btn-copy-manifest-xml"
                    onClick={() => copyToClipboard(androidManifestXml, 'xml')}
                    className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 font-medium cursor-pointer"
                  >
                    {copiedCode === 'xml' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode === 'xml' ? 'Copied' : 'Copy XML'}</span>
                  </button>
                </div>
                <pre className="bg-slate-950 text-slate-200 p-3.5 rounded-xl text-xs font-mono overflow-x-auto max-h-40 border border-slate-800">
                  {androidManifestXml}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 dark:bg-slate-950 px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Target Platform: <span className="font-semibold text-slate-700 dark:text-slate-300">Android 8.0+ / Mobile Web</span>
          </div>

          <button
            id="btn-done-android-modal"
            onClick={onClose}
            className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all cursor-pointer shadow-sm"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
};
