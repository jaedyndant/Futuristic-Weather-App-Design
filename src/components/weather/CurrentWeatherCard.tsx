import React from 'react';
import { GlassCard } from './GlassCard';
import { WeatherIcon } from './WeatherIcon';
import { MapPin, Droplets, Wind, Eye } from 'lucide-react';
import { formatTemperature } from '../../utils/temperature';
import { calculateFeelsLike } from '../../utils/windChill';

interface CurrentWeatherCardProps {
  temperature: number;
  location: string;
  condition: string;
  humidity: number;
  windSpeed: number;
  visibility: number;
  isMobile?: boolean;
  isLightMode?: boolean;
  isCelsius?: boolean;
}

export const CurrentWeatherCard: React.FC<CurrentWeatherCardProps> = ({
  temperature,
  location,
  condition,
  humidity,
  windSpeed,
  visibility,
  isMobile = false,
  isLightMode = false,
  isCelsius = true
}) => {
  return (
    <GlassCard glow isLightMode={isLightMode} className={`${isMobile ? 'p-6' : 'p-10'} relative overflow-hidden`}>
      {/* Liquid gradient overlay */}
      <div className={`absolute inset-0 ${isLightMode ? 'liquid-gradient-light' : 'liquid-gradient'} opacity-30 pointer-events-none`}></div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-6">
          <MapPin size={20} className={isLightMode ? 'text-gray-700' : 'text-white'} strokeWidth={1.5} />
          <p className={`${isLightMode ? 'text-gray-900' : 'text-white/90'} tracking-wide`}>{location}</p>
        </div>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className={`
              ${isLightMode ? 'text-gray-900 text-glow-light' : 'text-white text-glow'} 
              text-8xl tracking-tight mb-2 transition-all duration-500 transform hover:scale-105
            `}
            key={`${temperature}-${isCelsius}`}
            style={{
              animation: 'tempChange 0.8s ease-out'
            }}>
              {formatTemperature(temperature, isCelsius)}
            </h1>
            <p className={`${isLightMode ? 'text-gray-600' : 'text-white/60'} text-sm mb-2`}>
              Feels like {formatTemperature(calculateFeelsLike(temperature, windSpeed, humidity), isCelsius)}
            </p>
            <p className={`${isLightMode ? 'text-gray-700' : 'text-white/80'} text-xl capitalize`}>{condition}</p>
          </div>
          <WeatherIcon condition={condition} size={isMobile ? 80 : 120} animated isLightMode={isLightMode} />
        </div>

        {/* Weather details */}
        <div className={`grid grid-cols-3 gap-4 pt-6 border-t ${isLightMode ? 'border-gray-300' : 'border-white/10'}`}>
          <div className="flex flex-col items-center gap-2">
            <Droplets size={20} className={isLightMode ? 'text-gray-700' : 'text-white'} strokeWidth={1.5} />
            <p className={`${isLightMode ? 'text-gray-600' : 'text-white/60'} text-sm`}>Humidity</p>
            <p className={isLightMode ? 'text-gray-900' : 'text-white'}>{humidity}%</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Wind size={20} className={isLightMode ? 'text-gray-700' : 'text-white'} strokeWidth={1.5} />
            <p className={`${isLightMode ? 'text-gray-600' : 'text-white/60'} text-sm`}>Wind</p>
            <p className={isLightMode ? 'text-gray-900' : 'text-white'}>{windSpeed} mph</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Eye size={20} className={isLightMode ? 'text-gray-700' : 'text-white'} strokeWidth={1.5} />
            <p className={`${isLightMode ? 'text-gray-600' : 'text-white/60'} text-sm`}>Visibility</p>
            <p className={isLightMode ? 'text-gray-900' : 'text-white'}>{visibility} mi</p>
          </div>
        </div>
      </div>
    </GlassCard>
  );
};
