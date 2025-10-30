import React, { useState, useEffect } from 'react';
import { DesktopDashboard } from './components/weather/DesktopDashboard';
import { MobileDashboard } from './components/weather/MobileDashboard';
import { ActivityConditions } from './components/weather/ActivityConditions';
import { WeatherWidgets } from './components/weather/WeatherWidgets';
import { ThemeToggle } from './components/weather/ThemeToggle';
import { TemperatureToggle } from './components/weather/TemperatureToggle';
import ErrorBoundary from './components/ErrorBoundary';
import { useWeather } from './hooks/useWeather';
import { formatTemperature } from './utils/temperature';
import { getTimeBasedBackground, getTimeBasedOrbs } from './utils/timeBasedBackground';

// Mock weather data with location detection simulation
const mockWeatherData = {
  current: {
    temperature: 72,
    location: 'Amsterdam, NL',
    condition: 'Partly Cloudy',
    humidity: 65,
    windSpeed: 12,
    visibility: 10,
  },
  forecast: [
    { day: 'Mon', high: 75, low: 62, condition: 'Sunny' },
    { day: 'Tue', high: 73, low: 60, condition: 'Partly Cloudy' },
    { day: 'Wed', high: 68, low: 58, condition: 'Cloudy' },
    { day: 'Thu', high: 70, low: 59, condition: 'Rain' },
    { day: 'Fri', high: 74, low: 61, condition: 'Sunny' },
    { day: 'Sat', high: 76, low: 63, condition: 'Sunny' },
    { day: 'Sun', high: 72, low: 59, condition: 'Partly Cloudy' },
  ],
  hourly: [
    { time: 'Now', temp: 72, condition: 'Partly Cloudy' },
    { time: '1PM', temp: 74, condition: 'Sunny' },
    { time: '2PM', temp: 75, condition: 'Sunny' },
    { time: '3PM', temp: 76, condition: 'Sunny' },
    { time: '4PM', temp: 75, condition: 'Partly Cloudy' },
    { time: '5PM', temp: 73, condition: 'Partly Cloudy' },
    { time: '6PM', temp: 70, condition: 'Cloudy' },
    { time: '7PM', temp: 68, condition: 'Cloudy' },
  ],
  extras: {
    sunrise: '6:42 AM',
    sunset: '7:38 PM',
    uvIndex: 7,
    pressure: 1013,
  },
};

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isLightMode, setIsLightMode] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isCelsius, setIsCelsius] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const { weatherData, loading, error, fetchWeather } = useWeather();

  const handleLocationChange = async (location: string) => {
    if (fetchWeather) {
      await fetchWeather(location);
    }
  };

  useEffect(() => {
    const checkMobile = () => {
      try {
        setIsMobile(window.innerWidth < 1024);
      } catch (error) {
        console.warn('Error checking mobile state:', error);
        setIsMobile(false);
      }
    };
    
    const handleScroll = () => setScrollY(window.scrollY);
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      try {
        window.removeEventListener('resize', checkMobile);
        window.removeEventListener('scroll', handleScroll);
      } catch (error) {
        console.warn('Error removing listeners:', error);
      }
    };
  }, []);

  const toggleTheme = () => {
    setIsLightMode(!isLightMode);
  };

  const toggleTemperature = () => {
    setIsCelsius(!isCelsius);
  };

  // Transform API data to match existing component structure
  const transformedWeatherData = weatherData ? {
    current: {
      temperature: weatherData.current.temp_c,
      location: `${weatherData.location.name}, ${weatherData.location.country}`,
      condition: weatherData.current.condition.text,
      humidity: weatherData.current.humidity,
      windSpeed: Math.round(weatherData.current.wind_kph),
      visibility: weatherData.current.vis_km,
      feelsLike: weatherData.current.feelslike_c,
      airQuality: weatherData.current.air_quality,
    },
    forecast: weatherData.forecast.forecastday.slice(0, 7).map((day, index) => {
      const today = new Date();
      const forecastDate = new Date(today);
      forecastDate.setDate(today.getDate() + index);
      
      return {
        day: index === 0 ? 'Today' : forecastDate.toLocaleDateString('en', { weekday: 'short' }),
        high: day.day.maxtemp_c,
        low: day.day.mintemp_c,
        condition: day.day.condition.text
      };
    }),
    extendedForecast: weatherData.forecast.forecastday.map((day, index) => {
      const today = new Date();
      const forecastDate = new Date(today);
      forecastDate.setDate(today.getDate() + index);
      
      return {
        day: index === 0 ? 'Today' : forecastDate.toLocaleDateString('en', { weekday: 'long' }),
        date: forecastDate.toLocaleDateString('en', { month: 'short', day: 'numeric' }),
        high: day.day.maxtemp_c,
        low: day.day.mintemp_c,
        condition: day.day.condition.text,
        precipitation: day.day.daily_chance_of_rain || 0,
        humidity: day.day.avghumidity || 50,
        windSpeed: Math.round(day.day.maxwind_kph || 10)
      };
    }),
    hourly: weatherData.forecast.forecastday[0]?.hour.slice(0, 8).map((hour, index) => ({
      time: index === 0 ? 'Now' : new Date(hour.time).toLocaleTimeString('en', { hour: 'numeric' }),
      temp: hour.temp_c,
      condition: hour.condition.text
    })) || [],
    extras: {
      sunrise: weatherData.forecast.forecastday[0]?.astro?.sunrise || '6:42 AM',
      sunset: weatherData.forecast.forecastday[0]?.astro?.sunset || '7:38 PM',
      uvIndex: weatherData.current.uv || 0,
      pressure: weatherData.current.pressure_mb || 1013,
      airQuality: weatherData.current.air_quality,
    },
  } : {
    ...mockWeatherData,
    forecast: mockWeatherData.forecast.slice(0, 7)
  };

  // Dynamic background system
  const currentCondition = transformedWeatherData.current.condition;
  const isRaining = currentCondition.toLowerCase().includes('rain');
  const isSunny = currentCondition.toLowerCase().includes('sunny') || currentCondition.toLowerCase().includes('clear');
  const isShower = currentCondition.toLowerCase().includes('shower');
  
  // Time-based transitions
  const scrollProgress = Math.min(scrollY / 500, 1);
  const dayIntensity = isLightMode ? Math.max(0.3, 1 - scrollProgress * 0.7) : 0;
  const nightIntensity = !isLightMode ? Math.max(0.2, 1 - scrollProgress * 0.8) : 0;
  
  const backgroundClass = isLightMode 
    ? `bg-gradient-to-b from-blue-400 via-blue-300 to-blue-100`
    : `bg-gradient-to-b from-gray-900 via-gray-800 to-gray-700`;
  const orbColors = getTimeBasedOrbs(currentCondition);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white text-xl">Loading weather data...</div>
      </div>
    );
  }

  if (error) {
    console.warn('Weather API error, using mock data');
  }

  return (
    <ErrorBoundary>
      <div 
        className={`min-h-screen overflow-x-hidden transition-all duration-1000 ${backgroundClass}`}
        style={{
          background: isLightMode 
            ? `linear-gradient(to bottom, 
                hsl(210, ${60 + scrollProgress * 40}%, ${85 - scrollProgress * 20}%) 0%,
                hsl(200, ${50 + scrollProgress * 30}%, ${75 - scrollProgress * 15}%) 50%,
                hsl(190, ${40 + scrollProgress * 20}%, ${65 - scrollProgress * 10}%) 100%)`
            : `linear-gradient(to bottom,
                hsl(220, ${20 + scrollProgress * 10}%, ${10 + scrollProgress * 5}%) 0%,
                hsl(210, ${15 + scrollProgress * 8}%, ${8 + scrollProgress * 4}%) 50%,
                hsl(200, ${10 + scrollProgress * 5}%, ${5 + scrollProgress * 3}%) 100%)`
        }}
      >
      {/* Stars with scroll fade */}
      {!isLightMode && (
        <div 
          className="fixed inset-0 pointer-events-none transition-opacity duration-1000"
          style={{ opacity: Math.max(0, 1 - scrollProgress * 2) }}
        >
          {[...Array(100)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-white rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 60}%`,
                width: `${1 + Math.random() * 2}px`,
                height: `${1 + Math.random() * 2}px`,
                animationDelay: `${Math.random() * 3}s`,
                opacity: (Math.random() * 0.8 + 0.2) * (1 - scrollProgress)
              }}
            />
          ))}
        </div>
      )}
      
      {/* Clouds */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Cloud 1 */}
        <div className="absolute top-20 -left-20 animate-[drift_60s_linear_infinite]">
          <div className={`w-12 h-12 rounded-full blur-sm opacity-30 ${isLightMode ? 'bg-white' : 'bg-gray-300'}`}></div>
          <div className={`absolute top-2 left-8 w-16 h-16 rounded-full blur-sm opacity-30 ${isLightMode ? 'bg-white' : 'bg-gray-300'}`}></div>
          <div className={`absolute top-4 left-20 w-14 h-14 rounded-full blur-sm opacity-30 ${isLightMode ? 'bg-white' : 'bg-gray-300'}`}></div>
          <div className={`absolute top-6 left-30 w-10 h-10 rounded-full blur-sm opacity-30 ${isLightMode ? 'bg-white' : 'bg-gray-300'}`}></div>
        </div>
        
        {/* Cloud 2 */}
        <div className="absolute top-32 -left-32 animate-[drift_80s_linear_infinite]">
          <div className={`w-10 h-10 rounded-full blur-sm opacity-25 ${isLightMode ? 'bg-white' : 'bg-gray-400'}`}></div>
          <div className={`absolute top-1 left-6 w-14 h-14 rounded-full blur-sm opacity-25 ${isLightMode ? 'bg-white' : 'bg-gray-400'}`}></div>
          <div className={`absolute top-3 left-16 w-12 h-12 rounded-full blur-sm opacity-25 ${isLightMode ? 'bg-white' : 'bg-gray-400'}`}></div>
        </div>
        
        {/* Cloud 3 */}
        <div className="absolute top-48 -left-24 animate-[drift_70s_linear_infinite]">
          <div className={`w-16 h-16 rounded-full blur-sm opacity-20 ${isLightMode ? 'bg-white' : 'bg-gray-300'}`}></div>
          <div className={`absolute top-3 left-10 w-20 h-20 rounded-full blur-sm opacity-20 ${isLightMode ? 'bg-white' : 'bg-gray-300'}`}></div>
          <div className={`absolute top-6 left-24 w-18 h-18 rounded-full blur-sm opacity-20 ${isLightMode ? 'bg-white' : 'bg-gray-300'}`}></div>
          <div className={`absolute top-8 left-36 w-14 h-14 rounded-full blur-sm opacity-20 ${isLightMode ? 'bg-white' : 'bg-gray-300'}`}></div>
        </div>
        
        {/* Cloud 4 */}
        <div className="absolute top-64 -left-40 animate-[drift_90s_linear_infinite]">
          <div className={`w-12 h-12 rounded-full blur-sm opacity-35 ${isLightMode ? 'bg-white' : 'bg-gray-400'}`}></div>
          <div className={`absolute top-2 left-8 w-16 h-16 rounded-full blur-sm opacity-35 ${isLightMode ? 'bg-white' : 'bg-gray-400'}`}></div>
          <div className={`absolute top-4 left-20 w-14 h-14 rounded-full blur-sm opacity-35 ${isLightMode ? 'bg-white' : 'bg-gray-400'}`}></div>
        </div>
      </div>



      {/* Rain effect */}
      {isRaining && (
        <div className="fixed inset-0 pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-0.5 h-8 bg-blue-400 opacity-60 animate-[rain-fall_1s_linear_infinite]"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 1}s`
              }}
            />
          ))}
        </div>
      )}

      {/* Atmospheric orbs with scroll interaction */}
      <div 
        className="fixed top-20 left-20 w-96 h-96 rounded-full blur-3xl animate-[float_6s_ease-in-out_infinite] pointer-events-none transition-all duration-1000"
        style={{
          background: isLightMode 
            ? `radial-gradient(circle, rgba(59, 130, 246, ${0.2 + scrollProgress * 0.1}) 0%, transparent 70%)`
            : orbColors.orb1,
          transform: `translate(${scrollProgress * 20}px, ${scrollProgress * 10}px)`
        }}
      />
      <div 
        className="fixed bottom-20 right-20 w-96 h-96 rounded-full blur-3xl animate-[float_8s_ease-in-out_infinite] pointer-events-none transition-all duration-1000"
        style={{
          background: isLightMode 
            ? `radial-gradient(circle, rgba(34, 197, 94, ${0.15 + scrollProgress * 0.1}) 0%, transparent 70%)`
            : orbColors.orb2,
          transform: `translate(${-scrollProgress * 15}px, ${scrollProgress * 8}px)`
        }}
      />
      <div 
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl animate-[float_10s_ease-in-out_infinite] pointer-events-none transition-all duration-1000"
        style={{
          background: isLightMode 
            ? `radial-gradient(circle, rgba(168, 85, 247, ${0.1 + scrollProgress * 0.05}) 0%, transparent 70%)`
            : orbColors.orb3,
          transform: `translate(${scrollProgress * 10}px, ${-scrollProgress * 12}px) scale(${1 + scrollProgress * 0.1})`
        }}
      />
      
      <div className="relative z-10 py-8 lg:py-16">
        {isMobile ? (
          <MobileDashboard 
            activeTab={activeTab} 
            onTabChange={setActiveTab} 
            weatherData={transformedWeatherData}
            isLightMode={isLightMode}
            isCelsius={isCelsius}
            onLocationChange={handleLocationChange}
          />
        ) : (
          <>
            <DesktopDashboard 
              activeTab={activeTab} 
              onTabChange={setActiveTab} 
              weatherData={transformedWeatherData}
              isLightMode={isLightMode}
              isCelsius={isCelsius}
              onLocationChange={handleLocationChange}
            />
            {activeTab === 'home' && (
              <div className="max-w-6xl mx-auto px-8 lg:px-4 mb-8">
                <ActivityConditions weatherData={transformedWeatherData} isLightMode={isLightMode} />
                <WeatherWidgets weatherData={transformedWeatherData} isLightMode={isLightMode} isMobile={false} />
              </div>
            )}
          </>
        )}
      </div>

      {/* Controls */}
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        <TemperatureToggle isCelsius={isCelsius} onToggle={toggleTemperature} isLightMode={isLightMode} />
        <ThemeToggle isLightMode={isLightMode} onToggle={toggleTheme} />
      </div>
      
      {/* Footer */}
      <footer className={`relative z-10 mt-16 py-6 border-t border-white/10 ${isMobile ? 'mb-24' : ''}`}>
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className={`text-sm ${isLightMode ? 'text-gray-600' : 'text-white/60'}`}>
            © 2024 Jaedyn Trinidad. All rights reserved. | Weather data provided by WeatherAPI
          </p>
        </div>
      </footer>
    </div>
    </ErrorBoundary>
  );
}
