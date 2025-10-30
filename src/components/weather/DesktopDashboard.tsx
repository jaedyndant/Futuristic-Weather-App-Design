import React, { useState } from 'react';
import { Navigation } from './Navigation';
import { CurrentWeatherCard } from './CurrentWeatherCard';
import { ForecastCard } from './ForecastCard';
import { DayDetailModal } from './DayDetailModal';
import { GlassCard } from './GlassCard';
import { ForecastPage } from './ForecastPage';
import { RadarPage } from './RadarPage';
import { AlertsPage } from './AlertsPage';
import { SettingsPage } from './SettingsPage';
import { Sunrise, Sunset, CloudRain, Gauge } from 'lucide-react';

interface WeatherData {
  current: {
    temperature: number;
    location: string;
    condition: string;
    humidity: number;
    windSpeed: number;
    visibility: number;
  };
  forecast: Array<{
    day: string;
    high: number;
    low: number;
    condition: string;
  }>;
  extras: {
    sunrise: string;
    sunset: string;
    uvIndex: number;
    pressure: number;
  };
}

interface DesktopDashboardProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  weatherData: WeatherData;
  isLightMode?: boolean;
  isCelsius?: boolean;
  onLocationChange?: (location: string) => void;
}

export const DesktopDashboard: React.FC<DesktopDashboardProps> = ({ 
  activeTab, 
  onTabChange, 
  weatherData,
  isLightMode = false,
  isCelsius = true,
  onLocationChange
}) => {
  const [selectedDay, setSelectedDay] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDayClick = (day: any) => {
    setSelectedDay(day);
    setIsModalOpen(true);
  };
  const renderContent = () => {
    switch (activeTab) {
      case 'forecast':
        return <ForecastPage isLightMode={isLightMode} weatherData={weatherData} isCelsius={isCelsius} />;
      case 'radar':
        return <RadarPage isLightMode={isLightMode} weatherData={weatherData} />;
      case 'alerts':
        return <AlertsPage isLightMode={isLightMode} />;
      case 'settings':
        return <SettingsPage isLightMode={isLightMode} weatherData={weatherData} onLocationChange={onLocationChange} />;
      case 'home':
      default:
        return (
          <div className="max-w-6xl mx-auto px-8 lg:px-4 animate-[theme-fade_0.3s_ease-in]">
            {/* Main current weather card */}
            <div className="mb-8">
              <CurrentWeatherCard {...weatherData.current} isLightMode={isLightMode} isCelsius={isCelsius} />
            </div>

            {/* Additional info cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <GlassCard hover isLightMode={isLightMode} className="p-6 flex flex-col items-center gap-3">
                <Sunrise size={32} className={isLightMode ? 'text-gray-800' : 'text-white'} strokeWidth={1.5} />
                <p className={`${isLightMode ? 'text-gray-600' : 'text-white/60'} text-sm`}>Sunrise</p>
                <p className={`${isLightMode ? 'text-gray-900' : 'text-white'} text-xl`}>{weatherData.extras.sunrise}</p>
              </GlassCard>

              <GlassCard hover isLightMode={isLightMode} className="p-6 flex flex-col items-center gap-3">
                <Sunset size={32} className={isLightMode ? 'text-gray-800' : 'text-white'} strokeWidth={1.5} />
                <p className={`${isLightMode ? 'text-gray-600' : 'text-white/60'} text-sm`}>Sunset</p>
                <p className={`${isLightMode ? 'text-gray-900' : 'text-white'} text-xl`}>{weatherData.extras.sunset}</p>
              </GlassCard>

              <GlassCard hover isLightMode={isLightMode} className="p-6 flex flex-col items-center gap-3">
                <CloudRain size={32} className={isLightMode ? 'text-gray-800' : 'text-white'} strokeWidth={1.5} />
                <p className={`${isLightMode ? 'text-gray-600' : 'text-white/60'} text-sm`}>UV Index</p>
                <p className={`${isLightMode ? 'text-gray-900' : 'text-white'} text-xl`}>{weatherData.extras.uvIndex}</p>
              </GlassCard>

              <GlassCard hover isLightMode={isLightMode} className="p-6 flex flex-col items-center gap-3">
                <Gauge size={32} className={isLightMode ? 'text-gray-800' : 'text-white'} strokeWidth={1.5} />
                <p className={`${isLightMode ? 'text-gray-600' : 'text-white/60'} text-sm`}>Pressure</p>
                <p className={`${isLightMode ? 'text-gray-900' : 'text-white'} text-xl`}>{weatherData.extras.pressure} mb</p>
              </GlassCard>
            </div>

            {/* 7-day forecast */}
            <div className="mb-8">
              <h3 className={`${isLightMode ? 'text-gray-900' : 'text-white/90'} mb-6 tracking-wide`}>7-Day Forecast</h3>
              <div className="flex gap-4 overflow-x-auto scrollbar-hidden pb-16 px-4 -mx-4">
                {weatherData.forecast.map((day, index) => (
                  <div key={index} className="relative">
                    <ForecastCard 
                      {...day} 
                      isLightMode={isLightMode} 
                      isCelsius={isCelsius}
                      onClick={() => handleDayClick(day)}
                    />
                    {/* Night time indicator */}
                    <div className="absolute top-2 right-2 flex gap-1">
                      <div className="w-1 h-1 bg-white/60 rounded-full animate-pulse"></div>
                      <div className="w-1 h-1 bg-white/40 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <>
      <Navigation activeTab={activeTab} onTabChange={onTabChange} isLightMode={isLightMode} />
      {renderContent()}
      
      {selectedDay && (
        <DayDetailModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          day={selectedDay.day}
          high={selectedDay.high}
          low={selectedDay.low}
          condition={selectedDay.condition}
          isLightMode={isLightMode}
          isCelsius={isCelsius}
        />
      )}
    </>
  );
};
