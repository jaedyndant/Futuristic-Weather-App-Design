import React from 'react';
import { GlassCard } from './GlassCard';
import { Sun, Wind, Gauge, Thermometer, Sunrise, Sunset, Eye, Leaf } from 'lucide-react';

interface WeatherWidgetsProps {
  weatherData: any;
  isLightMode?: boolean;
  isMobile?: boolean;
}

const getUVLevel = (uvIndex: number) => {
  if (uvIndex <= 2) return { level: 'Low', color: 'text-green-500' };
  if (uvIndex <= 5) return { level: 'Moderate', color: 'text-yellow-500' };
  if (uvIndex <= 7) return { level: 'High', color: 'text-orange-500' };
  if (uvIndex <= 10) return { level: 'Very High', color: 'text-red-500' };
  return { level: 'Extreme', color: 'text-purple-500' };
};

const getPollenData = (airQuality: any, condition: string, uvIndex: number) => {
  if (airQuality?.us_epa_index) {
    const index = airQuality.us_epa_index;
    if (index === 1) return { level: 'Good', value: 10, color: 'text-green-500', bgColor: 'bg-green-500' };
    if (index === 2) return { level: 'Moderate', value: 30, color: 'text-yellow-500', bgColor: 'bg-yellow-500' };
    if (index === 3) return { level: 'Unhealthy for Sensitive', value: 60, color: 'text-orange-500', bgColor: 'bg-orange-500' };
    if (index === 4) return { level: 'Unhealthy', value: 80, color: 'text-red-500', bgColor: 'bg-red-500' };
    if (index === 5) return { level: 'Very Unhealthy', value: 90, color: 'text-purple-500', bgColor: 'bg-purple-500' };
    return { level: 'Hazardous', value: 100, color: 'text-red-800', bgColor: 'bg-red-800' };
  }
  // Fallback to weather-based estimation
  if (condition.toLowerCase().includes('rain')) {
    return { level: 'Good', value: 10, color: 'text-green-500', bgColor: 'bg-green-500' };
  }
  if (condition.toLowerCase().includes('cloud') || uvIndex < 3) {
    return { level: 'Moderate', value: 35, color: 'text-yellow-500', bgColor: 'bg-yellow-500' };
  }
  return { level: 'Unhealthy', value: 70, color: 'text-red-500', bgColor: 'bg-red-500' };
};

const getPollenLevel = (condition: string) => {
  if (condition.toLowerCase().includes('rain')) return { level: 'Low', color: 'text-green-500' };
  if (condition.toLowerCase().includes('cloud')) return { level: 'Moderate', color: 'text-yellow-500' };
  return { level: 'High', color: 'text-red-500' };
};

export const WeatherWidgets: React.FC<WeatherWidgetsProps> = ({ 
  weatherData, 
  isLightMode = false,
  isMobile = false 
}) => {
  const uvData = getUVLevel(weatherData.extras.uvIndex);
  const pollenData = getPollenData(weatherData.extras.airQuality, weatherData.current.condition, weatherData.extras.uvIndex);


  return (
    <div className={`grid ${isMobile ? 'grid-cols-2 gap-3' : 'grid-cols-3 gap-4'} ${isMobile ? '' : ''}`}>
      {/* UV Index */}
      <GlassCard isLightMode={isLightMode} className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <Sun size={18} className={isLightMode ? 'text-gray-700' : 'text-white'} />
          <span className={`${isLightMode ? 'text-gray-600' : 'text-white/60'} text-sm`}>UV Index</span>
        </div>
        <div className={`${isLightMode ? 'text-gray-900' : 'text-white'} text-2xl font-bold mb-1`}>
          {weatherData.extras.uvIndex}
        </div>
        <div className={`${uvData.color} text-sm font-medium`}>
          {uvData.level}
        </div>
      </GlassCard>

      {/* Pollen */}
      <GlassCard isLightMode={isLightMode} className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <Leaf size={18} className={isLightMode ? 'text-gray-700' : 'text-white'} />
          <span className={`${isLightMode ? 'text-gray-600' : 'text-white/60'} text-sm`}>Pollen</span>
        </div>
        <div className={`${pollenData.color} text-lg font-bold mb-2`}>
          {pollenData.level}
        </div>
        <div className="w-full bg-gray-600 rounded-full h-2 mb-1">
          <div 
            className={`h-2 rounded-full transition-all duration-500 ${pollenData.bgColor}`}
            style={{ width: `${pollenData.value}%` }}
          ></div>
        </div>
        <div className={`${isLightMode ? 'text-gray-500' : 'text-white/50'} text-xs`}>
          Tree pollen
        </div>
      </GlassCard>

      {/* Sunrise */}
      <GlassCard isLightMode={isLightMode} className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <Sunrise size={18} className={isLightMode ? 'text-gray-700' : 'text-white'} />
          <span className={`${isLightMode ? 'text-gray-600' : 'text-white/60'} text-sm`}>Sunrise</span>
        </div>
        <div className={`${isLightMode ? 'text-gray-900' : 'text-white'} text-2xl font-bold mb-1`}>
          {weatherData.extras.sunrise}
        </div>
        <div className={`${isLightMode ? 'text-gray-500' : 'text-white/50'} text-xs`}>
          Dawn
        </div>
      </GlassCard>

      {/* Real Feel */}
      <GlassCard isLightMode={isLightMode} className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Thermometer size={18} className={isLightMode ? 'text-gray-700' : 'text-white'} />
          <span className={`${isLightMode ? 'text-gray-600' : 'text-white/60'} text-sm`}>Real Feel</span>
        </div>
        <div className={`${isLightMode ? 'text-gray-900' : 'text-white'} text-2xl font-bold mb-1`}>
          {weatherData.current.feelsLike ? Math.round(weatherData.current.feelsLike) : Math.round(weatherData.current.temperature + (weatherData.current.windSpeed > 15 ? -3 : 2))}°
        </div>
        <div className={`${isLightMode ? 'text-gray-500' : 'text-white/50'} text-xs`}>
          With wind chill
        </div>
      </GlassCard>

      {/* Comfort Level */}
      <GlassCard isLightMode={isLightMode} className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Sun size={18} className={isLightMode ? 'text-gray-700' : 'text-white'} />
          <span className={`${isLightMode ? 'text-gray-600' : 'text-white/60'} text-sm`}>Comfort</span>
        </div>
        <div className={`${weatherData.current.temperature > 25 ? 'text-red-500' : weatherData.current.temperature < 10 ? 'text-blue-500' : 'text-green-500'} text-lg font-bold mb-1`}>
          {weatherData.current.temperature > 25 ? 'Hot' : weatherData.current.temperature < 10 ? 'Cold' : 'Pleasant'}
        </div>
        <div className={`${isLightMode ? 'text-gray-500' : 'text-white/50'} text-xs`}>
          Temperature comfort
        </div>
      </GlassCard>

      {/* Pressure */}
      <GlassCard isLightMode={isLightMode} className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <Gauge size={18} className={isLightMode ? 'text-gray-700' : 'text-white'} />
          <span className={`${isLightMode ? 'text-gray-600' : 'text-white/60'} text-sm`}>Pressure</span>
        </div>
        <div className={`${isLightMode ? 'text-gray-900' : 'text-white'} text-2xl font-bold mb-1`}>
          {weatherData.extras.pressure}
        </div>
        <div className={`${isLightMode ? 'text-gray-500' : 'text-white/50'} text-xs`}>
          hPa
        </div>
      </GlassCard>

      {/* Sunset */}
      <GlassCard isLightMode={isLightMode} className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <Sunset size={18} className={isLightMode ? 'text-gray-700' : 'text-white'} />
          <span className={`${isLightMode ? 'text-gray-600' : 'text-white/60'} text-sm`}>Sunset</span>
        </div>
        <div className={`${isLightMode ? 'text-gray-900' : 'text-white'} text-2xl font-bold mb-1`}>
          {weatherData.extras.sunset}
        </div>
        <div className={`${isLightMode ? 'text-gray-500' : 'text-white/50'} text-xs`}>
          Dusk
        </div>
      </GlassCard>

      {/* Visibility */}
      <GlassCard isLightMode={isLightMode} className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <Eye size={18} className={isLightMode ? 'text-gray-700' : 'text-white'} />
          <span className={`${isLightMode ? 'text-gray-600' : 'text-white/60'} text-sm`}>Visibility</span>
        </div>
        <div className={`${isLightMode ? 'text-gray-900' : 'text-white'} text-2xl font-bold mb-1`}>
          {weatherData.current.visibility} km
        </div>
        <div className={`${isLightMode ? 'text-gray-500' : 'text-white/50'} text-xs`}>
          Clear sight
        </div>
      </GlassCard>
    </div>
  );
};