import React, { useRef } from 'react';
import { GlassCard } from './GlassCard';
import { WeatherIcon } from './WeatherIcon';

interface HourlyData {
  time: string;
  temp: number;
  condition: string;
}

interface HourlyForecastProps {
  data: HourlyData[];
  isLightMode?: boolean;
}

export const HourlyForecast: React.FC<HourlyForecastProps> = ({ data, isLightMode = false }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <GlassCard isLightMode={isLightMode} className="p-6">
      <div className="mb-4">
        <p className={`${isLightMode ? 'text-gray-900' : 'text-white/90'} tracking-wide`}>Hourly Forecast</p>
      </div>
      
      {/* Glowing progress line */}
      <div className={`
        h-1 rounded-full mb-6 relative
        ${isLightMode 
          ? 'bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300' 
          : 'bg-gradient-to-r from-white/30 via-white/50 to-white/30'
        }
      `}>
        <div className={`
          absolute inset-0 rounded-full blur-sm opacity-70
          ${isLightMode 
            ? 'bg-gradient-to-r from-gray-400 via-gray-500 to-gray-400' 
            : 'bg-gradient-to-r from-white/50 via-white/70 to-white/50'
          }
        `}></div>
      </div>

      <div 
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scrollbar-hidden pb-2"
      >
        {data.map((item, index) => (
          <div 
            key={index} 
            className={`flex flex-col items-center gap-3 min-w-[80px] p-4 rounded-2xl ${isLightMode ? 'glass-nav-item-light' : 'glass-nav-item'}`}
          >
            <p className={`${isLightMode ? 'text-gray-600' : 'text-white/70'} text-sm`}>{item.time}</p>
            <WeatherIcon condition={item.condition} size={32} isLightMode={isLightMode} />
            <p className={isLightMode ? 'text-gray-900' : 'text-white'}>{item.temp}°C</p>
          </div>
        ))}
      </div>
    </GlassCard>
  );
};
