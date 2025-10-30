import React, { useState } from 'react';
import { MobileNavigation } from './MobileNavigation';
import { CurrentWeatherCard } from './CurrentWeatherCard';
import { HourlyForecast } from './HourlyForecast';
import { ForecastCard } from './ForecastCard';
import { DayDetailModal } from './DayDetailModal';
import { ForecastPage } from './ForecastPage';
import { RadarPage } from './RadarPage';
import { AlertsPage } from './AlertsPage';
import { SettingsPage } from './SettingsPage';
import { ActivityConditions } from './ActivityConditions';
import { WeatherWidgets } from './WeatherWidgets';

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
  hourly: Array<{
    time: string;
    temp: number;
    condition: string;
  }>;
}

interface MobileDashboardProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  weatherData: WeatherData;
  isLightMode?: boolean;
  isCelsius?: boolean;
  onLocationChange?: (location: string) => void;
}

export const MobileDashboard: React.FC<MobileDashboardProps> = ({ 
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
      case 'map':
        return <RadarPage isLightMode={isLightMode} weatherData={weatherData} />;
      case 'radar':
        return <RadarPage isLightMode={isLightMode} weatherData={weatherData} />;
      case 'alerts':
        return <AlertsPage isLightMode={isLightMode} />;
      case 'settings':
        return <SettingsPage isLightMode={isLightMode} weatherData={weatherData} onLocationChange={onLocationChange} />;
      case 'home':
      default:
        return (
          <>
            {/* Current weather */}
            <div className="mb-6">
              <CurrentWeatherCard {...weatherData.current} isMobile isLightMode={isLightMode} isCelsius={isCelsius} />
            </div>



            {/* 7-day forecast */}
            <div className="mb-6">
              <h3 className={`${isLightMode ? 'text-gray-900' : 'text-white/90'} mb-4 tracking-wide px-2`}>7-Day Forecast</h3>
              <div className="overflow-x-auto scrollbar-hidden snap-x snap-mandatory px-4 -mx-4">
                <div className="flex gap-3 pb-4">
                  {weatherData.forecast.map((day, index) => (
                    <div key={index} className="snap-center flex-shrink-0">
                      <ForecastCard 
                        {...day} 
                        isLightMode={isLightMode} 
                        isCelsius={isCelsius}
                        onClick={() => handleDayClick(day)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Activity conditions */}
            <ActivityConditions weatherData={weatherData} isLightMode={isLightMode} />

            {/* Weather widgets */}
            <WeatherWidgets weatherData={weatherData} isLightMode={isLightMode} isMobile />
          </>
        );
    }
  };

  return (
    <>
      <div className="px-4 pb-28 animate-[theme-fade_0.3s_ease-in]">
        {renderContent()}
      </div>

      <MobileNavigation activeTab={activeTab} onTabChange={onTabChange} isLightMode={isLightMode} />
      
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
