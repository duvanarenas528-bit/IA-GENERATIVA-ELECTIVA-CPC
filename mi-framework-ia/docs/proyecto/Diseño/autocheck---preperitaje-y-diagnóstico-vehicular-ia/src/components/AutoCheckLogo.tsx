import React from 'react';

interface AutoCheckLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'light' | 'dark' | 'white';
  showSubtitle?: boolean;
  subtitleText?: string;
  className?: string;
  onClick?: () => void;
}

export const AutoCheckLogo: React.FC<AutoCheckLogoProps> = ({
  size = 'md',
  variant = 'light',
  showSubtitle = true,
  subtitleText = 'PREPERITAJE & DIAGNÓSTICO IA',
  className = '',
  onClick,
}) => {
  // Size calculations
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const titleSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
  };

  const subtitleSizes = {
    sm: 'text-[8px]',
    md: 'text-[9px]',
    lg: 'text-[11px]',
    xl: 'text-[12px]',
  };

  // Color variants
  const isDarkBg = variant === 'dark' || variant === 'white';
  const textColor = isDarkBg ? 'text-white' : 'text-slate-900';
  const subtextColor = isDarkBg ? 'text-blue-300' : 'text-blue-600 font-semibold';
  const badgeBg = isDarkBg
    ? 'bg-blue-500/20 text-blue-300 border-blue-400/30'
    : 'bg-blue-50 text-blue-700 border-blue-200';

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-2.5 select-none ${
        onClick ? 'cursor-pointer hover:opacity-90 transition' : ''
      } ${className}`}
    >
      {/* Brand Icon SVG Emblem */}
      <div
        className={`${iconSizes[size]} relative flex items-center justify-center shrink-0 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 text-white shadow-lg shadow-blue-500/25 p-1.5`}
      >
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Stylized shield / car silhouette with checkmark */}
          <path
            d="M24 4L7 11V22C7 33.1 14.3 43.4 24 46C33.7 43.4 41 33.1 41 22V11L24 4Z"
            fill="currentColor"
            fillOpacity="0.15"
          />
          <path
            d="M24 6L9 12.3V21.5C9 31.4 15.4 40.5 24 43.5C32.6 40.5 39 31.4 39 21.5V12.3L24 6Z"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Inner stylized vehicle front + Checkmark */}
          <path
            d="M17 19H31M15 24H33M19 28H29"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.4"
          />
          {/* Bold glowing checkmark */}
          <path
            d="M15 24.5L21.5 31L34 18"
            stroke="#38BDF8"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Top spark */}
          <circle cx="34" cy="13" r="2.5" fill="#60A5FA" />
        </svg>
      </div>

      {/* Typography */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span
            className={`font-black tracking-tight leading-none ${titleSizes[size]} ${textColor} font-sans`}
          >
            AUTO<span className="text-blue-500">CHECK</span>
          </span>
          {size !== 'sm' && (
            <span
              className={`hidden sm:inline-block px-1.5 py-0.5 rounded text-[9px] font-bold tracking-widest uppercase border ${badgeBg}`}
            >
              IA
            </span>
          )}
        </div>
        {showSubtitle && (
          <span
            className={`font-mono tracking-widest uppercase leading-none mt-1 ${subtitleSizes[size]} ${subtextColor}`}
          >
            {subtitleText}
          </span>
        )}
      </div>
    </div>
  );
};
