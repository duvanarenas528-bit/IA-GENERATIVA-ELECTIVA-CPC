/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface AutoCheckLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'white' | 'dark';
  showSubtitle?: boolean;
  subtitleText?: string;
  onClick?: () => void;
  className?: string;
}

const sizeClasses = {
  sm: 'h-8',
  md: 'h-10',
  lg: 'h-12',
  xl: 'h-16',
};

export const AutoCheckLogo: React.FC<AutoCheckLogoProps> = ({
  size = 'md',
  variant = 'default',
  showSubtitle = true,
  subtitleText = 'AUTOCHECK',
  onClick,
  className = '',
}) => {
  return (
    <div
      className={`flex items-center gap-2 ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      <img
        src="/Captura de pantalla 2026-10-05 012428.png"
        alt="AutoCheck Logo"
        className={`${sizeClasses[size]} w-auto object-contain`}
      />
      {showSubtitle && (
        <div className="flex flex-col leading-none">
          <span
            className={`text-[10px] font-black tracking-[0.25em] ${
              variant === 'white' ? 'text-white' : variant === 'dark' ? 'text-slate-900' : 'text-slate-700'
            }`}
          >
            {subtitleText}
          </span>
        </div>
      )}
    </div>
  );
};
