import React from 'react';
import { Moon, Sun } from 'lucide-react';

interface ThemeToggleProps {
  isLightMode: boolean;
  onToggle: () => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ isLightMode, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className={`
        ${isLightMode ? 'glass-card-light glass-card-hover-light' : 'glass-card glass-card-hover'} 
        p-4 rounded-2xl transition-all duration-500 ease-in-out
        hover:scale-105 active:scale-95
      `}
      aria-label={isLightMode ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
    >
      <div className="relative w-6 h-6">
        <Moon 
          size={24} 
          className={`
            absolute inset-0 transition-all duration-500
            ${isLightMode 
              ? 'opacity-100 rotate-0 text-gray-800' 
              : 'opacity-0 -rotate-90 text-white'
            }
          `}
          strokeWidth={1.5}
        />
        <Sun 
          size={24} 
          className={`
            absolute inset-0 transition-all duration-500
            ${isLightMode 
              ? 'opacity-0 rotate-90 text-gray-800' 
              : 'opacity-100 rotate-0 text-white'
            }
          `}
          strokeWidth={1.5}
        />
      </div>
    </button>
  );
};
