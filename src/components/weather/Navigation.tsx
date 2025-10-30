import React from 'react';
import { Home, Cloud, Radar, Bell, Settings } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isLightMode?: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange, isLightMode = false }) => {
  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'forecast', icon: Cloud, label: 'Forecast' },
    { id: 'radar', icon: Radar, label: 'Radar' },
    { id: 'alerts', icon: Bell, label: 'Alerts' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="fixed left-8 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col gap-4">
      <div className={`${isLightMode ? 'glass-card-light' : 'glass-card'} rounded-3xl p-4 flex flex-col gap-3`}>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`
                ${isLightMode ? 'glass-nav-item-light' : 'glass-nav-item'} 
                ${activeTab === item.id ? 'active' : ''} 
                p-4 rounded-2xl group relative
              `}
              title={item.label}
            >
              <Icon size={24} className={isLightMode ? 'text-gray-800' : 'text-white'} strokeWidth={1.5} />
              <span className={`
                absolute left-full ml-4 px-3 py-1 rounded-lg text-sm whitespace-nowrap 
                opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none
                ${isLightMode ? 'bg-white/90 text-gray-800 border border-gray-200' : 'bg-black/70 text-white'}
              `}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
