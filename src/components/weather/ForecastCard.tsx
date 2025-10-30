import React from 'react';
import { GlassCard } from './GlassCard';
import { WeatherIcon } from './WeatherIcon';
import { formatTemperature } from '../../utils/temperature';

interface ForecastCardProps {
  day: string;
  high: number;
  low: number;
  condition: string;
  isLightMode?: boolean;
  isCelsius?: boolean;
  onClick?: () => void;
}

export const ForecastCard: React.FC<ForecastCardProps> = ({ 
  day, 
  high, 
  low, 
  condition, 
  isLightMode = false, 
  isCelsius = true,
  onClick 
}) => {
  return (
    <GlassCard 
      hover 
      isLightMode={isLightMode} 
      className="p-6 flex flex-col items-center gap-4 w-[140px] h-[200px] cursor-pointer transition-transform hover:scale-102 active:scale-98"
      onClick={onClick}
    >
      <p className={`${isLightMode ? 'text-gray-700' : 'text-white/80'} uppercase tracking-wider text-sm whitespace-nowrap`}>{day}</p>
      <WeatherIcon condition={condition} size={48} isLightMode={isLightMode} />
      <div className="flex flex-col items-center gap-1">
        <p className={`${isLightMode ? 'text-gray-900' : 'text-white'} text-2xl`}>
          {formatTemperature(high, isCelsius)}
        </p>
        <p className={`${isLightMode ? 'text-gray-600' : 'text-white/60'} text-lg`}>
          {formatTemperature(low, isCelsius)}
        </p>
      </div>
      <p className={`${isLightMode ? 'text-gray-600' : 'text-white/70'} text-sm capitalize text-center leading-tight`} style={{display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>{condition}</p>
    </GlassCard>
  );
};
