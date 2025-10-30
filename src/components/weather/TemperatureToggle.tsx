import React from 'react';

// Add flip animation keyframes
const flipAnimation = `
  @keyframes flip {
    0% { transform: rotateY(0deg); }
    50% { transform: rotateY(90deg); }
    100% { transform: rotateY(0deg); }
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = flipAnimation;
  document.head.appendChild(style);
}

interface TemperatureToggleProps {
  isCelsius: boolean;
  onToggle: () => void;
  isLightMode?: boolean;
}

export const TemperatureToggle: React.FC<TemperatureToggleProps> = ({
  isCelsius,
  onToggle,
  isLightMode = false
}) => {
  return (
    <button
      onClick={onToggle}
      className={`
        w-12 h-12 rounded-xl text-lg font-bold transition-all duration-500 transform
        ${isLightMode 
          ? 'bg-white/70 text-gray-800 hover:bg-white/90 hover:scale-110' 
          : 'bg-white/10 text-white hover:bg-white/20 hover:scale-110'
        }
        backdrop-blur-md border border-white/20 active:scale-95
        hover:rotate-12 active:rotate-0
      `}
      style={{
        animation: 'flip 0.6s ease-in-out'
      }}
    >
      <span 
        className="inline-block transition-all duration-500"
        style={{
          transform: `scale(${isCelsius ? '1' : '1.1'}) rotateZ(${isCelsius ? '0deg' : '360deg'})`
        }}
      >
        °{isCelsius ? 'C' : 'F'}
      </span>
    </button>
  );
};