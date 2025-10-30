import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  isLightMode?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className = '', 
  hover = false,
  glow = false,
  isLightMode = false
}) => {
  return (
    <div 
      className={`
        ${isLightMode ? 'glass-card-light' : 'glass-card'}
        ${hover ? (isLightMode ? 'glass-card-hover-light' : 'glass-card-hover') : ''} 
        ${glow ? (isLightMode ? 'neon-glow-light' : 'neon-glow') : ''} 
        rounded-3xl 
        ${className}
      `}
    >
      {children}
    </div>
  );
};
