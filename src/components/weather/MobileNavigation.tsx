import React, { useState, useEffect } from 'react';
import { Home, Cloud, Radar, Settings } from 'lucide-react';

interface MobileNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isLightMode?: boolean;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({ activeTab, onTabChange, isLightMode = false }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const isAtBottom = window.innerHeight + currentScrollY >= document.documentElement.scrollHeight - 10;
      setIsVisible(currentScrollY < lastScrollY || currentScrollY < 10 || isAtBottom);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);
  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'forecast', icon: Cloud, label: 'Forecast' },
    { id: 'map', icon: Radar, label: 'Radar' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className={`fixed bottom-0 left-0 right-0 lg:hidden z-50 p-4 pointer-events-none transition-transform duration-300 ${isVisible ? 'translate-y-0' : 'translate-y-full'}`}>
      <div className={`${isLightMode ? 'glass-card-light' : 'glass-card'} rounded-3xl p-3 flex justify-around items-center pointer-events-auto`}>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`
                ${isLightMode ? 'glass-nav-item-light' : 'glass-nav-item'}
                ${activeTab === item.id ? `active ${isLightMode ? 'inner-glow-light' : 'inner-glow'}` : ''} 
                p-4 rounded-2xl flex flex-col items-center gap-1 min-w-[70px] transition-all
              `}
            >
              <Icon size={22} className={isLightMode ? 'text-gray-800' : 'text-white'} strokeWidth={1.5} />
              <span className={`${isLightMode ? 'text-gray-700' : 'text-white/80'} text-xs`}>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
