import React, { useState } from 'react';
import { GlassCard } from './GlassCard';
import { Settings, MapPin, Thermometer, Bell, Globe, Info, Search } from 'lucide-react';

interface SettingsPageProps {
  isLightMode?: boolean;
  weatherData?: any;
  onLocationChange?: (location: string) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ 
  isLightMode = false, 
  weatherData, 
  onLocationChange 
}) => {
  const [tempUnit, setTempUnit] = useState<'C' | 'F'>('C');
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [newLocation, setNewLocation] = useState('');
  const [isChangingLocation, setIsChangingLocation] = useState(false);

  const handleLocationChange = async () => {
    if (!newLocation.trim() || !onLocationChange) return;
    
    try {
      setIsChangingLocation(true);
      await onLocationChange(newLocation.trim());
      setNewLocation('');
    } catch (error) {
      console.error('Failed to change location:', error);
    } finally {
      setIsChangingLocation(false);
    }
  };

  const Toggle = ({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) => (
    <button
      onClick={onToggle}
      className={`
        w-14 h-7 rounded-full relative transition-all duration-300
        ${enabled 
          ? (isLightMode ? 'bg-gray-800' : 'bg-white/30') 
          : (isLightMode ? 'bg-gray-300' : 'bg-white/20')
        }
      `}
    >
      <div 
        className={`
          absolute top-1 w-5 h-5 rounded-full transition-all duration-300
          ${isLightMode ? 'bg-white' : 'bg-white'}
          ${enabled ? 'right-1' : 'left-1'}
        `}
      />
    </button>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-8 animate-[theme-fade_0.3s_ease-in]">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Settings size={32} className={isLightMode ? 'text-gray-800' : 'text-white'} strokeWidth={1.5} />
          <h2 className={`${isLightMode ? 'text-gray-900' : 'text-white'} text-3xl tracking-tight`}>
            Settings
          </h2>
        </div>
        <p className={`${isLightMode ? 'text-gray-600' : 'text-white/60'} ml-11`}>
          Customize your weather experience
        </p>
      </div>

      <div className="space-y-6">


        {/* Location */}
        <GlassCard isLightMode={isLightMode} className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <MapPin size={24} className={isLightMode ? 'text-gray-800' : 'text-white'} strokeWidth={1.5} />
              <div>
                <h3 className={`${isLightMode ? 'text-gray-900' : 'text-white'} text-lg mb-1`}>
                  Location Services
                </h3>
                <p className={`${isLightMode ? 'text-gray-600' : 'text-white/60'} text-sm`}>
                  Allow automatic location detection
                </p>
              </div>
            </div>
            <button
              onClick={() => setLocationEnabled(!locationEnabled)}
              className={`w-14 h-7 rounded-full relative transition-all duration-300 ${
                locationEnabled 
                  ? (isLightMode ? 'bg-gray-800 toggle-animate-on' : 'bg-white/30 toggle-animate-on') 
                  : (isLightMode ? 'bg-gray-300 toggle-animate-off' : 'bg-white/20 toggle-animate-off')
              }`}
            >
              <div className={`absolute top-1 w-5 h-5 rounded-full transition-all duration-300 ${
                isLightMode ? 'bg-white' : 'bg-white'
              } ${
                locationEnabled ? 'right-1' : 'left-1'
              }`} />
            </button>
          </div>

          {locationEnabled && (
            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="flex items-center justify-between mb-3">
                <span className={`${isLightMode ? 'text-gray-800' : 'text-white/90'} text-sm`}>
                  Current Location
                </span>
                <span className={`${isLightMode ? 'text-gray-600' : 'text-white/60'} text-sm`}>
                  {weatherData?.location?.name ? `${weatherData.location.name}, ${weatherData.location.country}` : 'Amsterdam, NL'}
                </span>
              </div>
              
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    placeholder="Enter city name..."
                    className={`
                      flex-1 px-4 py-3 rounded-xl border transition-all
                      ${isLightMode 
                        ? 'bg-white/80 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-gray-600' 
                        : 'bg-white/10 border-white/20 text-white placeholder-white/50 focus:border-white/40'
                      }
                      focus:outline-none focus:ring-2 focus:ring-white/20
                    `}
                    onKeyPress={(e) => e.key === 'Enter' && handleLocationChange()}
                  />
                  <button
                    onClick={handleLocationChange}
                    disabled={!newLocation.trim() || isChangingLocation}
                    className={`
                      px-3 py-3 rounded-xl transition-all flex items-center justify-center
                      ${isLightMode ? 'glass-nav-item-light' : 'glass-nav-item'}
                      disabled:opacity-50 disabled:cursor-not-allowed
                      hover:scale-105 active:scale-95
                    `}
                  >
                    <Search size={16} className={isLightMode ? 'text-gray-900' : 'text-white'} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </GlassCard>

        {/* Notifications */}
        <GlassCard isLightMode={isLightMode} className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Bell size={24} className={isLightMode ? 'text-gray-800' : 'text-white'} strokeWidth={1.5} />
              <div>
                <h3 className={`${isLightMode ? 'text-gray-900' : 'text-white'} text-lg mb-1`}>
                  Notifications
                </h3>
                <p className={`${isLightMode ? 'text-gray-600' : 'text-white/60'} text-sm`}>
                  Receive weather alerts and updates
                </p>
              </div>
            </div>
            <button
              onClick={() => setNotificationsEnabled(!notificationsEnabled)}
              className={`w-14 h-7 rounded-full relative transition-all duration-300 ${
                notificationsEnabled 
                  ? (isLightMode ? 'bg-gray-800 toggle-animate-on' : 'bg-white/30 toggle-animate-on') 
                  : (isLightMode ? 'bg-gray-300 toggle-animate-off' : 'bg-white/20 toggle-animate-off')
              }`}
            >
              <div className={`absolute top-1 w-5 h-5 rounded-full transition-all duration-300 ${
                isLightMode ? 'bg-white' : 'bg-white'
              } ${
                notificationsEnabled ? 'right-1' : 'left-1'
              }`} />
            </button>
          </div>

          {notificationsEnabled && (
            <div className="space-y-3 pt-4 border-t border-white/10">
              <div className="flex items-center justify-between">
                <span className={`${isLightMode ? 'text-gray-800' : 'text-white/90'} text-sm`}>
                  Severe Weather Alerts
                </span>
                <button className={`w-14 h-7 rounded-full relative transition-all duration-300 ${
                  isLightMode ? 'bg-gray-800 toggle-animate-on' : 'bg-white/30 toggle-animate-on'
                }`}>
                  <div className={`absolute top-1 w-5 h-5 rounded-full transition-all duration-300 bg-white right-1`} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className={`${isLightMode ? 'text-gray-800' : 'text-white/90'} text-sm`}>
                  Daily Forecast Summary
                </span>
                <button className={`w-14 h-7 rounded-full relative transition-all duration-300 ${
                  isLightMode ? 'bg-gray-800 toggle-animate-on' : 'bg-white/30 toggle-animate-on'
                }`}>
                  <div className={`absolute top-1 w-5 h-5 rounded-full transition-all duration-300 bg-white right-1`} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className={`${isLightMode ? 'text-gray-800' : 'text-white/90'} text-sm`}>
                  Precipitation Alerts
                </span>
                <button className={`w-14 h-7 rounded-full relative transition-all duration-300 ${
                  isLightMode ? 'bg-gray-300 toggle-animate-off' : 'bg-white/20 toggle-animate-off'
                }`}>
                  <div className={`absolute top-1 w-5 h-5 rounded-full transition-all duration-300 bg-white left-1`} />
                </button>
              </div>
            </div>
          )}
        </GlassCard>

        {/* Auto Refresh */}
        <GlassCard isLightMode={isLightMode} className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Globe size={24} className={isLightMode ? 'text-gray-800' : 'text-white'} strokeWidth={1.5} />
              <div>
                <h3 className={`${isLightMode ? 'text-gray-900' : 'text-white'} text-lg mb-1`}>
                  Auto Refresh
                </h3>
                <p className={`${isLightMode ? 'text-gray-600' : 'text-white/60'} text-sm`}>
                  Automatically update weather data every 15 minutes
                </p>
              </div>
            </div>
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`w-14 h-7 rounded-full relative transition-all duration-300 ${
                autoRefresh 
                  ? (isLightMode ? 'bg-gray-800 toggle-animate-on' : 'bg-white/30 toggle-animate-on') 
                  : (isLightMode ? 'bg-gray-300 toggle-animate-off' : 'bg-white/20 toggle-animate-off')
              }`}
            >
              <div className={`absolute top-1 w-5 h-5 rounded-full transition-all duration-300 ${
                isLightMode ? 'bg-white' : 'bg-white'
              } ${
                autoRefresh ? 'right-1' : 'left-1'
              }`} />
            </button>
          </div>
        </GlassCard>

        {/* About */}
        <GlassCard isLightMode={isLightMode} className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <Info size={24} className={isLightMode ? 'text-gray-800' : 'text-white'} strokeWidth={1.5} />
            <div>
              <h3 className={`${isLightMode ? 'text-gray-900' : 'text-white'} text-lg mb-1`}>
                About
              </h3>
              <p className={`${isLightMode ? 'text-gray-600' : 'text-white/60'} text-sm`}>
                Weather Dashboard v1.0
              </p>
            </div>
          </div>
          
          <div className="space-y-2 pt-4 border-t border-white/10">
            <div className="flex justify-between">
              <span className={`${isLightMode ? 'text-gray-700' : 'text-white/80'} text-sm`}>Last Updated</span>
              <span className={`${isLightMode ? 'text-gray-600' : 'text-white/60'} text-sm`}>2 minutes ago</span>
            </div>
            <div className="flex justify-between">
              <span className={`${isLightMode ? 'text-gray-700' : 'text-white/80'} text-sm`}>Data Source</span>
              <span className={`${isLightMode ? 'text-gray-600' : 'text-white/60'} text-sm`}>OpenWeather API</span>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
