import React from 'react';
import styles from './DecorativeIllustration.module.css';
import { useTheme } from '@/contexts/ThemeContext';

export default function DecorativeIllustration({ 
  type = 'coding', 
  position = 'left',
  size = 200 
}) {
  const { theme } = useTheme();
  
  const illustrations = {
    coding: <CodingIllustration theme={theme} />,
    files: <FilesIllustration theme={theme} />,
    tools: <ToolsIllustration theme={theme} />,
  };

  const illustration = illustrations[type] || illustrations.coding;

  return (
    <div 
      className={`${styles.illustration} ${styles[position]}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      {illustration}
    </div>
  );
}

// Coding Illustration SVG
function CodingIllustration({ theme }) {
  const primaryColor = theme === 'dark' ? '#60a5fa' : '#3b82f6';
  const secondaryColor = theme === 'dark' ? '#93c5fd' : '#60a5fa';
  const accentColor = theme === 'dark' ? '#c084fc' : '#8b5cf6';

  return (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Document/Code Icon */}
      <rect x="40" y="30" width="120" height="140" rx="8" fill={primaryColor} opacity="0.1" />
      <rect x="40" y="30" width="120" height="140" rx="8" stroke={primaryColor} strokeWidth="2" />
      
      {/* Code Lines */}
      <line x1="60" y1="60" x2="140" y2="60" stroke={secondaryColor} strokeWidth="3" strokeLinecap="round" />
      <line x1="60" y1="80" x2="120" y2="80" stroke={accentColor} strokeWidth="3" strokeLinecap="round" />
      <line x1="60" y1="100" x2="130" y2="100" stroke={primaryColor} strokeWidth="3" strokeLinecap="round" />
      <line x1="60" y1="120" x2="110" y2="120" stroke={secondaryColor} strokeWidth="3" strokeLinecap="round" />
      <line x1="60" y1="140" x2="125" y2="140" stroke={accentColor} strokeWidth="3" strokeLinecap="round" />
      
      {/* Code Brackets */}
      <text x="55" y="70" fill={primaryColor} fontSize="24" fontWeight="bold">{'</'}</text>
      <text x="125" y="70" fill={primaryColor} fontSize="24" fontWeight="bold">{'>'}</text>
      
      {/* Floating Elements */}
      <circle cx="170" cy="50" r="8" fill={accentColor} opacity="0.6" className={styles.float1} />
      <circle cx="30" cy="100" r="6" fill={secondaryColor} opacity="0.5" className={styles.float2} />
      <circle cx="165" cy="150" r="5" fill={primaryColor} opacity="0.4" className={styles.float3} />
    </svg>
  );
}

// Files Illustration SVG
function FilesIllustration({ theme }) {
  const primaryColor = theme === 'dark' ? '#fbbf24' : '#f59e0b';
  const secondaryColor = theme === 'dark' ? '#fcd34d' : '#fbbf24';
  const accentColor = theme === 'dark' ? '#fb923c' : '#f97316';

  return (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Folder */}
      <path 
        d="M40 70 L40 160 Q40 165 45 165 L155 165 Q160 165 160 160 L160 80 Q160 75 155 75 L100 75 L90 65 L45 65 Q40 65 40 70 Z" 
        fill={primaryColor} 
        opacity="0.2"
      />
      <path 
        d="M40 70 L40 160 Q40 165 45 165 L155 165 Q160 165 160 160 L160 80 Q160 75 155 75 L100 75 L90 65 L45 65 Q40 65 40 70 Z" 
        stroke={primaryColor} 
        strokeWidth="2"
      />
      
      {/* Documents inside */}
      <rect x="60" y="90" width="60" height="50" rx="4" fill={secondaryColor} opacity="0.3" />
      <line x1="70" y1="105" x2="110" y2="105" stroke={accentColor} strokeWidth="2" strokeLinecap="round" />
      <line x1="70" y1="115" x2="105" y2="115" stroke={accentColor} strokeWidth="2" strokeLinecap="round" />
      <line x1="70" y1="125" x2="108" y2="125" stroke={accentColor} strokeWidth="2" strokeLinecap="round" />
      
      {/* Floating Icons */}
      <circle cx="170" cy="60" r="7" fill={primaryColor} opacity="0.5" className={styles.float1} />
      <rect x="25" y="140" width="10" height="10" rx="2" fill={secondaryColor} opacity="0.6" className={styles.float2} />
      <circle cx="165" cy="140" r="6" fill={accentColor} opacity="0.5" className={styles.float3} />
    </svg>
  );
}

// Tools Illustration SVG
function ToolsIllustration({ theme }) {
  const primaryColor = theme === 'dark' ? '#a78bfa' : '#8b5cf6';
  const secondaryColor = theme === 'dark' ? '#c4b5fd' : '#a78bfa';
  const accentColor = theme === 'dark' ? '#f472b6' : '#ec4899';

  return (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Wrench */}
      <path 
        d="M80 60 L80 80 L70 90 L60 80 L80 60 Z M80 80 L110 110" 
        stroke={primaryColor} 
        strokeWidth="4" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        fill={primaryColor}
        opacity="0.2"
      />
      
      {/* Screwdriver */}
      <line x1="120" y1="60" x2="140" y2="140" stroke={secondaryColor} strokeWidth="4" strokeLinecap="round" />
      <circle cx="120" cy="60" r="6" fill={secondaryColor} />
      <circle cx="140" cy="140" r="4" fill={secondaryColor} />
      
      {/* Settings Gear */}
      <circle cx="100" cy="100" r="20" stroke={accentColor} strokeWidth="3" fill="none" />
      <circle cx="100" cy="100" r="10" fill={accentColor} opacity="0.3" />
      
      {/* Gear Teeth */}
      {[0, 60, 120, 180, 240, 300].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const x1 = 100 + Math.cos(rad) * 20;
        const y1 = 100 + Math.sin(rad) * 20;
        const x2 = 100 + Math.cos(rad) * 26;
        const y2 = 100 + Math.sin(rad) * 26;
        return (
          <line 
            key={i}
            x1={x1} 
            y1={y1} 
            x2={x2} 
            y2={y2} 
            stroke={accentColor} 
            strokeWidth="3" 
            strokeLinecap="round"
          />
        );
      })}
      
      {/* Floating Elements */}
      <circle cx="40" cy="140" r="5" fill={primaryColor} opacity="0.5" className={styles.float1} />
      <circle cx="160" cy="70" r="6" fill={secondaryColor} opacity="0.5" className={styles.float2} />
    </svg>
  );
}


