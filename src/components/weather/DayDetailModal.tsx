import React from 'react';
import { GlassCard } from './GlassCard';
import { WeatherIcon } from './WeatherIcon';
import { X, Droplets, Wind, Eye, Thermometer } from 'lucide-react';
import { formatTemperature } from '../../utils/temperature';

interface DayDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  day: string;
  high: number;
  low: number;
  condition: string;
  isLightMode?: boolean;
  isCelsius?: boolean;
}

export const DayDetailModal: React.FC<DayDetailModalProps> = ({
  isOpen,
  onClose,
  day,
  high,
  low,
  condition,
  isLightMode = false,
  isCelsius = true
}) => {
  if (!isOpen) return null;

  // Mock hourly data for rain probability
  const hourlyData = [
    { time: '6 AM', temp: low + 2, rain: 10 },
    { time: '9 AM', temp: low + 5, rain: 20 },
    { time: '12 PM', temp: high - 2, rain: 60 },
    { time: '3 PM', temp: high, rain: 80 },
    { time: '6 PM', temp: high - 3, rain: 40 },
    { time: '9 PM', temp: low + 3, rain: 15 }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <GlassCard 
        isLightMode={isLightMode} 
        className="relative w-full max-w-md p-6 animate-[theme-fade_0.3s_ease-in]"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-2 rounded-lg transition-all hover:scale-110 ${
            isLightMode ? 'hover:bg-gray-200' : 'hover:bg-white/10'
          }`}
        >
          <X size={20} className={isLightMode ? 'text-gray-800' : 'text-white'} />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <h3 className={`${isLightMode ? 'text-gray-900' : 'text-white'} text-2xl mb-2`}>
            {day}
          </h3>
          <WeatherIcon condition={condition} size={64} isLightMode={isLightMode} />
          <p className={`${isLightMode ? 'text-gray-600' : 'text-white/70'} capitalize mt-2`}>
            {condition}
          </p>
        </div>

        {/* Temperature range */}
        <div className="flex justify-center gap-8 mb-6">
          <div className="text-center">
            <p className={`${isLightMode ? 'text-gray-600' : 'text-white/60'} text-sm`}>High</p>
            <p className={`${isLightMode ? 'text-gray-900' : 'text-white'} text-3xl`}>
              {formatTemperature(high, isCelsius)}
            </p>
          </div>
          <div className="text-center">
            <p className={`${isLightMode ? 'text-gray-600' : 'text-white/60'} text-sm`}>Low</p>
            <p className={`${isLightMode ? 'text-gray-900' : 'text-white'} text-3xl`}>
              {formatTemperature(low, isCelsius)}
            </p>
          </div>
        </div>

        {/* Hourly rain probability */}
        <div>
          <h4 className={`${isLightMode ? 'text-gray-900' : 'text-white'} mb-3 flex items-center gap-2`}>
            <Droplets size={16} />
            Rain Probability
          </h4>
          <div className="space-y-2">
            {hourlyData.map((hour, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className={`${isLightMode ? 'text-gray-700' : 'text-white/80'} text-sm`}>
                  {hour.time}
                </span>
                <div className="flex items-center gap-3">
                  <span className={`${isLightMode ? 'text-gray-600' : 'text-white/60'} text-sm`}>
                    {formatTemperature(hour.temp, isCelsius)}
                  </span>
                  <div className="w-16 h-2 bg-gray-300 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 rounded-full transition-all duration-500"
                      style={{ width: `${hour.rain}%` }}
                    />
                  </div>
                  <span className={`${isLightMode ? 'text-gray-700' : 'text-white/80'} text-sm w-8`}>
                    {hour.rain}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </GlassCard>
    </div>
  );
};