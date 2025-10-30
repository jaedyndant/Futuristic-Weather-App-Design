import React from 'react';
import { GlassCard } from './GlassCard';
import { WeatherIcon } from './WeatherIcon';
import { Calendar, TrendingUp, TrendingDown, Droplets, Wind } from 'lucide-react';
import { formatTemperature } from '../../utils/temperature';

interface ForecastPageProps {
  isLightMode?: boolean;
  weatherData?: any;
  isCelsius?: boolean;
}

const generateExtendedForecast = () => {
  const baseData = [
    { high: 75, low: 62, condition: 'Sunny', precipitation: 0, humidity: 45, windSpeed: 8 },
    { high: 73, low: 60, condition: 'Partly Cloudy', precipitation: 10, humidity: 52, windSpeed: 12 },
    { high: 68, low: 58, condition: 'Cloudy', precipitation: 30, humidity: 68, windSpeed: 15 },
    { high: 70, low: 59, condition: 'Rain', precipitation: 80, humidity: 75, windSpeed: 18 },
    { high: 74, low: 61, condition: 'Sunny', precipitation: 5, humidity: 48, windSpeed: 10 },
    { high: 76, low: 63, condition: 'Sunny', precipitation: 0, humidity: 42, windSpeed: 7 },
    { high: 71, low: 60, condition: 'Partly Cloudy', precipitation: 15, humidity: 55, windSpeed: 11 },
  ];

  return baseData.map((data, index) => {
    const date = new Date();
    date.setDate(date.getDate() + index);
    
    return {
      day: index === 0 ? 'Today' : date.toLocaleDateString('en', { weekday: 'long' }),
      date: date.toLocaleDateString('en', { month: 'short', day: 'numeric' }),
      ...data
    };
  });
};

export const ForecastPage: React.FC<ForecastPageProps> = ({ 
  isLightMode = false, 
  weatherData,
  isCelsius = true 
}) => {
  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-8 animate-[theme-fade_0.3s_ease-in]">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Calendar size={32} className={isLightMode ? 'text-gray-800' : 'text-white'} strokeWidth={1.5} />
          <h2 className={`${isLightMode ? 'text-gray-900' : 'text-white'} text-3xl tracking-tight`}>
            Extended Forecast
          </h2>
        </div>
        <p className={`${isLightMode ? 'text-gray-600' : 'text-white/60'} ml-11`}>
          7-day detailed weather outlook
        </p>
      </div>

      <div className="space-y-4">
        {(weatherData?.extendedForecast || generateExtendedForecast()).slice(0, 7).map((day: any, index: number) => (
          <GlassCard key={index} hover isLightMode={isLightMode} className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              {/* Day and Date */}
              <div className="flex items-center gap-6 min-w-[200px]">
                <div>
                  <p className={`${isLightMode ? 'text-gray-900' : 'text-white'} text-xl`}>
                    {day.day}
                  </p>
                  <p className={`${isLightMode ? 'text-gray-600' : 'text-white/60'} text-sm`}>
                    {day.date}
                  </p>
                </div>
              </div>

              {/* Weather Icon and Condition */}
              <div className="flex items-center gap-4 min-w-[180px]">
                <WeatherIcon condition={day.condition} size={48} isLightMode={isLightMode} />
                <p className={`${isLightMode ? 'text-gray-800' : 'text-white/90'} capitalize`}>
                  {day.condition}
                </p>
              </div>

              {/* Temperature */}
              <div className="flex items-center gap-4 min-w-[120px]">
                <div className="flex items-center gap-2">
                  <TrendingUp size={20} className={isLightMode ? 'text-gray-700' : 'text-white/70'} strokeWidth={1.5} />
                  <span className={`${isLightMode ? 'text-gray-900' : 'text-white'} text-xl`}>
                    {formatTemperature(day.high, isCelsius)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingDown size={20} className={isLightMode ? 'text-gray-600' : 'text-white/50'} strokeWidth={1.5} />
                  <span className={`${isLightMode ? 'text-gray-700' : 'text-white/70'} text-xl`}>
                    {formatTemperature(day.low, isCelsius)}
                  </span>
                </div>
              </div>

              {/* Additional Details */}
              <div className="flex gap-6 lg:gap-8">
                <div className="flex flex-col items-center gap-1">
                  <Droplets size={18} className={isLightMode ? 'text-gray-700' : 'text-white/70'} strokeWidth={1.5} />
                  <p className={`${isLightMode ? 'text-gray-600' : 'text-white/60'} text-xs`}>
                    {day.precipitation}%
                  </p>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Droplets size={18} className={isLightMode ? 'text-gray-700' : 'text-white/70'} strokeWidth={1.5} />
                  <p className={`${isLightMode ? 'text-gray-600' : 'text-white/60'} text-xs`}>
                    {day.humidity}%
                  </p>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Wind size={18} className={isLightMode ? 'text-gray-700' : 'text-white/70'} strokeWidth={1.5} />
                  <p className={`${isLightMode ? 'text-gray-600' : 'text-white/60'} text-xs`}>
                    {day.windSpeed} mph
                  </p>
                </div>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};
