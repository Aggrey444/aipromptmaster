import React from 'react';

interface DennelLogoProps {
  className?: string;
  size?: number | string;
  showText?: boolean;
  textClassName?: string;
  subtextClassName?: string;
  variant?: 'full' | 'icon' | 'brand';
}

export const DennelLogo: React.FC<DennelLogoProps> = ({
  className = '',
  size = 36,
  showText = true,
  textClassName = 'text-slate-900 dark:text-white font-extrabold text-lg tracking-tight',
  subtextClassName = 'text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider',
  variant = 'brand'
}) => {
  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* Dennel Technologies Emblem SVG */}
      <div 
        className="relative shrink-0 flex items-center justify-center transition-transform hover:scale-105"
        style={{ width: size, height: size }}
      >
        <svg
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-sm"
        >
          <defs>
            {/* Emerald Green Outer Gradient */}
            <linearGradient id="dennelGreenLight" x1="20" y1="40" x2="160" y2="180" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#34D399" />
              <stop offset="60%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>

            {/* Dark Forest Teal Gradient */}
            <linearGradient id="dennelGreenDark" x1="40" y1="20" x2="170" y2="160" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#059669" />
              <stop offset="50%" stopColor="#047857" />
              <stop offset="100%" stopColor="#064E3B" />
            </linearGradient>

            {/* Amber Gold Curve Gradient */}
            <linearGradient id="dennelGold" x1="100" y1="20" x2="190" y2="120" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FBBF24" />
              <stop offset="40%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>

            {/* White Silver Inner Shield */}
            <linearGradient id="dennelInnerWhite" x1="60" y1="60" x2="140" y2="140" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#E2E8F0" />
            </linearGradient>
          </defs>

          {/* Outer Gold Arc (Top Right) */}
          <path
            d="M 105 25 C 145 25, 185 55, 185 100 C 185 125, 170 145, 150 155 C 168 135, 172 105, 155 80 C 140 58, 115 40, 95 35 C 98 28, 101 25, 105 25 Z"
            fill="url(#dennelGold)"
          />

          {/* Outer Light Green Swoosh (Bottom Left) */}
          <path
            d="M 50 40 C 30 70, 25 110, 35 145 C 45 175, 75 190, 105 180 C 80 180, 55 165, 45 140 C 35 115, 40 85, 50 40 Z"
            fill="url(#dennelGreenLight)"
          />

          {/* Main Dark Green Organic Triangular Shield Body */}
          <path
            d="M 70 32 C 110 28, 160 55, 165 95 C 170 135, 130 175, 90 170 C 50 165, 35 125, 42 85 C 48 55, 58 35, 70 32 Z"
            fill="url(#dennelGreenDark)"
          />

          {/* Inner Light Green Layer */}
          <path
            d="M 78 45 C 112 42, 148 68, 150 100 C 152 130, 120 155, 88 152 C 58 148, 48 118, 54 88 C 58 65, 68 48, 78 45 Z"
            fill="url(#dennelGreenLight)"
            opacity="0.95"
          />

          {/* Core White Silver Play Container */}
          <path
            d="M 75 62 C 85 55, 105 65, 135 90 C 150 102, 148 115, 132 125 C 112 138, 88 148, 72 138 C 60 130, 58 112, 62 92 C 65 78, 68 66, 75 62 Z"
            fill="url(#dennelInnerWhite)"
          />

          {/* Core Center Green Play Triangle */}
          <path
            d="M 88 82 C 92 79, 98 82, 110 94 C 116 100, 116 106, 110 110 C 98 120, 92 123, 88 120 C 84 116, 84 105, 84 94 C 84 86, 85 83, 88 82 Z"
            fill="#059669"
          />
        </svg>
      </div>

      {/* Brand Text */}
      {showText && (
        <div className="flex flex-col">
          <span className={textClassName}>
            AI Prompt Master
          </span>
          {variant === 'brand' && (
            <span className={subtextClassName}>
              Powered by Dennel Technologies AI
            </span>
          )}
        </div>
      )}
    </div>
  );
};
