import React from 'react';
import logoImg from '../assets/logo_smpn7.png';

interface SchoolLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'custom' | number;
  customSize?: string;
  className?: string;
  showBorder?: boolean;
  altText?: string;
}

export const SchoolLogo: React.FC<SchoolLogoProps> = ({
  size = 'md',
  customSize,
  className = '',
  showBorder = false,
  altText = 'Logo Resmi SMP Negeri 7 Sentani - Khena Mbai Umbai'
}) => {
  const sizeMap: Record<string, string> = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
    '2xl': 'w-28 h-28'
  };

  let finalDimension = '';
  let inlineStyle: React.CSSProperties = {};

  if (typeof size === 'number') {
    inlineStyle = { width: `${size}px`, height: `${size}px` };
  } else if (customSize) {
    finalDimension = customSize;
  } else if (typeof size === 'string' && sizeMap[size]) {
    finalDimension = sizeMap[size];
  } else {
    finalDimension = sizeMap.md;
  }

  return (
    <div
      className={`inline-flex items-center justify-center shrink-0 relative ${
        showBorder ? 'p-1 rounded-xl bg-white/80 shadow-2xs border border-[#E0DACE]/60' : ''
      } ${className}`}
      style={inlineStyle}
    >
      <img
        src={logoImg}
        alt={altText}
        referrerPolicy="no-referrer"
        className={`${finalDimension || 'w-full h-full'} object-contain drop-shadow-xs transition duration-200`}
        style={inlineStyle}
        onError={(e) => {
          const target = e.currentTarget;
          target.src = '/logo_smpn7.png';
        }}
      />
    </div>
  );
};
