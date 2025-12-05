import React from 'react';

interface LogoProps {
  className?: string;
  url?: string;
}

export const Logo: React.FC<LogoProps> = ({ className = "w-10 h-10", url }) => {
  if (url) {
    return <img src={url} alt="Logo" className={`object-contain ${className}`} />;
  }

  // Default Vector Logo for AgentFa
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="logoGradient" x1="0" y1="0" x2="100" y2="100">
          <stop offset="0%" stopColor="#4F46E5" /> {/* Indigo-600 */}
          <stop offset="100%" stopColor="#818CF8" /> {/* Indigo-400 */}
        </linearGradient>
      </defs>
      
      {/* Outer Shield/Hexagon */}
      <path 
        d="M50 5 L95 27.5 V72.5 L50 95 L5 72.5 V27.5 Z" 
        className="fill-indigo-600 dark:fill-indigo-500 shadow-lg" 
        style={{ filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))' }}
      />
      
      {/* Inner Face Background */}
      <path 
        d="M50 15 L85 32.5 V67.5 L50 85 L15 67.5 V32.5 Z" 
        className="fill-white dark:fill-gray-900 opacity-90"
      />

      {/* Eyes */}
      <rect x="30" y="38" width="12" height="6" rx="2" className="fill-indigo-600 dark:fill-indigo-400" />
      <rect x="58" y="38" width="12" height="6" rx="2" className="fill-indigo-600 dark:fill-indigo-400" />

      {/* Digital Circuit Lines (Cheeks) */}
      <path d="M25 50 L35 50 M25 55 L32 55" stroke="currentColor" strokeWidth="2" className="text-indigo-200 dark:text-gray-700" />
      <path d="M75 50 L65 50 M75 55 L68 55" stroke="currentColor" strokeWidth="2" className="text-indigo-200 dark:text-gray-700" />

      {/* Mouth (Smile) */}
      <path 
        d="M38 65 Q50 75 62 65" 
        stroke="currentColor" 
        strokeWidth="3" 
        strokeLinecap="round" 
        className="text-indigo-600 dark:text-indigo-400"
      />
    </svg>
  );
};