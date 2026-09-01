import React, { useState, useEffect } from 'react';
import { Smartphone, RotateCw, Wifi, Battery, Signal, ChevronRight, X, ExternalLink, Download, Layers, Sparkles, Sliders } from 'lucide-react';

interface AndroidFrameProps {
  children: React.ReactNode;
  isAndroidMode: boolean;
  onToggleAndroidMode: () => void;
  onOpenAndroidExportModal: () => void;
}

export type AndroidDeviceModel = 'pixel8' | 'galaxyS24' | 'tablet';

export const AndroidFrame: React.FC<AndroidFrameProps> = ({
  children,
  isAndroidMode,
  onToggleAndroidMode,
  onOpenAndroidExportModal,
}) => {
  const [deviceModel, setDeviceModel] = useState<AndroidDeviceModel>('pixel8');
  const [isLandscape, setIsLandscape] = useState<boolean>(false);
  const [use3ButtonsNav, setUse3ButtonsNav] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const mins = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${mins}`);
    };
    updateClock();
    const interval = setInterval(updateClock, 30000);
    return () => clearInterval(interval);
  }, []);

  if (!isAndroidMode) {
    return <>{children}</>;
  }

  // Dimension specs based on device model
  const getDeviceDimensions = () => {
    if (deviceModel === 'tablet') {
      return isLandscape
        ? { width: 'min(100%, 1024px)', height: '700px' }
        : { width: 'min(100%, 768px)', height: '880px' };
    } else if (deviceModel === 'galaxyS24') {
      return isLandscape
        ? { width: 'min(100%, 860px)', height: '460px' }
        : { width: 'min(100%, 420px)', height: '860px' };
    } else {
      // Pixel 8
      return isLandscape
        ? { width: 'min(100%, 820px)', height: '440px' }
        : { width: 'min(100%, 400px)', height: '840px' };
    }
  };

  const dimensions = getDeviceDimensions();

  return (
    <div className="bg-slate-950 min-h-screen py-6 px-3 flex flex-col items-center justify-start text-slate-100 selection:bg-emerald-500 selection:text-slate-950 font-sans transition-all">
      
      {/* Top Floating Control Bar for Android Simulator */}
      <div className="w-full max-w-5xl bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl p-3 mb-6 shadow-2xl flex flex-wrap items-center justify-between gap-3 text-xs z-30">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-xl border border-emerald-500/20 font-bold">
            <Smartphone className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>Android Mode Active</span>
          </div>

          {/* Model Switcher */}
          <div className="flex items-center bg-slate-800/80 p-1 rounded-xl border border-slate-700">
            <button
              id="btn-device-pixel8"
              onClick={() => setDeviceModel('pixel8')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                deviceModel === 'pixel8'
                  ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Pixel 8 Pro
            </button>
            <button
              id="btn-device-galaxy"
              onClick={() => setDeviceModel('galaxyS24')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                deviceModel === 'galaxyS24'
                  ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Galaxy S24 Ultra
            </button>
            <button
              id="btn-device-tablet"
              onClick={() => setDeviceModel('tablet')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                deviceModel === 'tablet'
                  ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Android Tablet
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Orientation Toggle */}
          <button
            id="btn-rotate-orientation"
            onClick={() => setIsLandscape(!isLandscape)}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-xl border border-slate-700 font-medium transition-all cursor-pointer"
            title="Rotate Device"
          >
            <RotateCw className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isLandscape ? 'Landscape' : 'Portrait'}</span>
          </button>

          {/* Nav Style Toggle */}
          <button
            id="btn-toggle-nav-buttons"
            onClick={() => setUse3ButtonsNav(!use3ButtonsNav)}
            className="hidden sm:flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-xl border border-slate-700 transition-all cursor-pointer"
            title="Switch Navigation Bar Style"
          >
            <Sliders className="w-3.5 h-3.5 text-indigo-400" />
            <span>{use3ButtonsNav ? '3-Button Nav' : 'Gesture Nav'}</span>
          </button>

          {/* Export APK Modal Trigger */}
          <button
            id="btn-open-android-export"
            onClick={onOpenAndroidExportModal}
            className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold px-3.5 py-1.5 rounded-xl shadow-md transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>APK / App Release</span>
          </button>

          {/* Exit Android Shell */}
          <button
            id="btn-exit-android-mode"
            onClick={onToggleAndroidMode}
            className="p-1.5 bg-slate-800 hover:bg-rose-950/50 hover:border-rose-700/50 text-slate-400 hover:text-rose-300 rounded-xl border border-slate-700 transition-all cursor-pointer"
            title="Exit Android Shell Mode"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Android Device Mockup Frame Container */}
      <div
        className="relative bg-slate-900 border-[10px] md:border-[14px] border-slate-800 rounded-[42px] md:rounded-[48px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_40px_rgba(16,185,129,0.15)] flex flex-col overflow-hidden transition-all duration-300 ease-in-out"
        style={{
          width: dimensions.width,
          height: dimensions.height,
        }}
      >
        {/* Device Camera Notch / Punch hole */}
        {!isLandscape && deviceModel !== 'tablet' && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-slate-950 rounded-full border border-slate-800 z-50 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-slate-800" />
          </div>
        )}

        {/* Android Status Bar */}
        <div className="h-8 bg-slate-900 text-slate-300 px-5 flex items-center justify-between text-[11px] font-semibold shrink-0 z-40 select-none border-b border-slate-800/80">
          <div className="flex items-center gap-1.5">
            <span>{currentTime || '09:41'}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] bg-slate-800 px-1.5 py-0.2 rounded font-mono text-emerald-400">5G</span>
            <Wifi className="w-3.5 h-3.5 text-slate-200" />
            <Signal className="w-3.5 h-3.5 text-slate-200" />
            <Battery className="w-4 h-4 text-emerald-400" />
          </div>
        </div>

        {/* Scrollable Android App Content Area */}
        <div className="flex-1 overflow-y-auto bg-slate-50 text-slate-900 relative">
          {children}
        </div>

        {/* Android Navigation Bar (Bottom) */}
        <div className="bg-slate-900 h-8 flex items-center justify-center shrink-0 z-40 border-t border-slate-800/80 select-none">
          {use3ButtonsNav ? (
            <div className="flex items-center justify-around w-full max-w-xs text-slate-400">
              {/* Back Triangle */}
              <button
                className="p-1 hover:text-white cursor-pointer"
                onClick={() => window.history.back()}
                title="Back"
              >
                <div className="w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-r-[10px] border-r-current" />
              </button>
              {/* Home Circle */}
              <button
                className="p-1 hover:text-white cursor-pointer"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                title="Home"
              >
                <div className="w-3.5 h-3.5 rounded-full border-2 border-current" />
              </button>
              {/* Recents Square */}
              <button
                className="p-1 hover:text-white cursor-pointer"
                onClick={onOpenAndroidExportModal}
                title="Recents"
              >
                <div className="w-3 h-3 border-2 border-current rounded-xs" />
              </button>
            </div>
          ) : (
            /* Gesture Navigation Pill Bar */
            <div className="w-28 h-1 bg-slate-400/60 rounded-full hover:bg-slate-200 transition-colors cursor-pointer" />
          )}
        </div>
      </div>

      <p className="text-[11px] text-slate-500 mt-4 text-center">
        Simulating Android Material You viewport • Built with React & PWA Standards
      </p>
    </div>
  );
};
