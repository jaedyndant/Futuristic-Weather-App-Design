import React, { useState, useEffect } from 'react';
import { GlassCard } from './GlassCard';
import { Bell, AlertTriangle, Info, Wind, Snowflake, Zap } from 'lucide-react';
import { useNotifications } from '../../hooks/useNotifications';
import { NotificationToast } from '../ui/NotificationToast';

interface AlertsPageProps {
  isLightMode?: boolean;
}

const weatherAlerts = [
  {
    id: 1,
    type: 'warning',
    title: 'Severe Thunderstorm Warning',
    description: 'Heavy rain and strong winds expected in your area. Seek shelter and avoid outdoor activities.',
    time: '2 hours ago',
    severity: 'high',
    icon: Zap,
    expires: 'Expires at 6:00 PM',
  },
  {
    id: 2,
    type: 'watch',
    title: 'Wind Advisory',
    description: 'Gusty winds up to 35 mph possible. Secure outdoor objects and use caution while driving.',
    time: '5 hours ago',
    severity: 'medium',
    icon: Wind,
    expires: 'Expires at 9:00 PM',
  },
  {
    id: 3,
    type: 'info',
    title: 'Temperature Drop Alert',
    description: 'Temperatures will drop significantly overnight. Prepare for cold weather conditions.',
    time: '1 day ago',
    severity: 'low',
    icon: Snowflake,
    expires: 'Expires tomorrow',
  },
];

export const AlertsPage: React.FC<AlertsPageProps> = ({ isLightMode = false }) => {
  const { notifications, permission, requestPermission, showNotification, removeNotification } = useNotifications();
  const [alertSettings, setAlertSettings] = useState({
    severeWeather: true,
    dailyForecast: false,
    rainAlerts: true
  });
  const [testAlertsEnabled, setTestAlertsEnabled] = useState<{[key: number]: boolean}>({});
  const [masterToggle, setMasterToggle] = useState(false);

  const toggleTestAlert = (alertId: number) => {
    setTestAlertsEnabled(prev => ({
      ...prev,
      [alertId]: !prev[alertId]
    }));
  };

  const toggleAllAlerts = () => {
    const newState = !masterToggle;
    setMasterToggle(newState);
    const newTestAlerts: {[key: number]: boolean} = {};
    weatherAlerts.forEach(alert => {
      newTestAlerts[alert.id] = newState;
    });
    setTestAlertsEnabled(newTestAlerts);
  };

  useEffect(() => {
    if (permission === 'default') {
      requestPermission();
    }
  }, [permission, requestPermission]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (alertSettings.severeWeather && Math.random() > 0.7) {
        const alerts = [
          { title: 'Severe Weather Alert', message: 'Heavy rain expected in your area', type: 'warning' as const },
          { title: 'Wind Advisory', message: 'Strong winds up to 35 mph possible', type: 'warning' as const },
          { title: 'Temperature Alert', message: 'Significant temperature drop expected', type: 'info' as const },
        ];
        const randomAlert = alerts[Math.floor(Math.random() * alerts.length)];
        showNotification(randomAlert);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [alertSettings.severeWeather, showNotification]);

  const toggleSetting = (setting: keyof typeof alertSettings) => {
    setAlertSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const getSeverityColor = (severity: string) => {
    if (isLightMode) {
      switch (severity) {
        case 'high':
          return 'border-red-500 bg-red-50/50';
        case 'medium':
          return 'border-yellow-500 bg-yellow-50/50';
        case 'low':
          return 'border-blue-500 bg-blue-50/50';
        default:
          return 'border-gray-400';
      }
    } else {
      switch (severity) {
        case 'high':
          return 'border-red-500/50 bg-red-500/5';
        case 'medium':
          return 'border-yellow-500/50 bg-yellow-500/5';
        case 'low':
          return 'border-blue-500/50 bg-blue-500/5';
        default:
          return 'border-white/10';
      }
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high':
        return AlertTriangle;
      case 'medium':
        return Bell;
      case 'low':
        return Info;
      default:
        return Info;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-8 animate-[theme-fade_0.3s_ease-in]">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Bell size={32} className={isLightMode ? 'text-gray-800' : 'text-white'} strokeWidth={1.5} />
          <h2 className={`${isLightMode ? 'text-gray-900' : 'text-white'} text-3xl tracking-tight`}>
            Weather Alerts
          </h2>
        </div>
        <p className={`${isLightMode ? 'text-gray-600' : 'text-white/60'} ml-11`}>
          Active warnings and notifications for your area
        </p>
      </div>

      {/* Master Toggle */}
      <div className="mb-6">
        <GlassCard isLightMode={isLightMode} className="p-4">
          <div className="flex items-center justify-between">
            <span className={`${isLightMode ? 'text-gray-900' : 'text-white'} font-medium`}>Turn On All Alerts</span>
            <button 
              onClick={toggleAllAlerts}
              className={`w-12 h-6 rounded-full transition-all duration-300 relative ${
                masterToggle 
                  ? 'bg-blue-500 toggle-animate-on' 
                  : isLightMode ? 'bg-gray-300 toggle-animate-off' : 'bg-white/20 toggle-animate-off'
              }`}
            >
              <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all duration-300 shadow-md ${
                masterToggle ? 'right-0.5' : 'left-0.5'
              }`}></div>
            </button>
          </div>
        </GlassCard>
      </div>

      {weatherAlerts.length > 0 ? (
        <div className="space-y-4">
          {weatherAlerts.map((alert) => {
            const WeatherIcon = alert.icon;
            const SeverityIcon = getSeverityIcon(alert.severity);
            
            return (
              <GlassCard 
                key={alert.id} 
                hover 
                isLightMode={isLightMode}
                className={`p-6 border-l-4 ${getSeverityColor(alert.severity)}`}
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    <div className={`
                      p-4 rounded-2xl
                      ${isLightMode ? 'bg-white/50' : 'bg-white/10'}
                    `}>
                      <WeatherIcon 
                        size={32} 
                        className={isLightMode ? 'text-gray-800' : 'text-white'} 
                        strokeWidth={1.5} 
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <SeverityIcon 
                        size={20} 
                        className={
                          alert.severity === 'high' 
                            ? 'text-red-500' 
                            : alert.severity === 'medium' 
                            ? 'text-yellow-500' 
                            : 'text-blue-500'
                        } 
                        strokeWidth={1.5}
                      />
                      <h3 className={`${isLightMode ? 'text-gray-900' : 'text-white'} text-xl`}>
                        {alert.title}
                      </h3>
                    </div>

                    <p className={`${isLightMode ? 'text-gray-700' : 'text-white/80'} mb-3`}>
                      {alert.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <p className={`${isLightMode ? 'text-gray-600' : 'text-white/60'} text-sm`}>
                        {alert.expires}
                      </p>
                      <button 
                        onClick={() => toggleTestAlert(alert.id)}
                        className={`w-12 h-6 rounded-full transition-all duration-300 relative ${
                          testAlertsEnabled[alert.id] 
                            ? 'bg-blue-500 toggle-animate-on' 
                            : isLightMode ? 'bg-gray-300 toggle-animate-off' : 'bg-white/20 toggle-animate-off'
                        }`}
                      >
                        <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all duration-300 shadow-md ${
                          testAlertsEnabled[alert.id] ? 'right-0.5' : 'left-0.5'
                        }`}></div>
                      </button>
                    </div>
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>
      ) : (
        <GlassCard isLightMode={isLightMode} className="p-12 text-center">
          <Bell 
            size={64} 
            className={`${isLightMode ? 'text-gray-400' : 'text-white/30'} mx-auto mb-4`} 
            strokeWidth={1.5}
          />
          <h3 className={`${isLightMode ? 'text-gray-900' : 'text-white'} text-xl mb-2`}>
            No Active Alerts
          </h3>
          <p className={`${isLightMode ? 'text-gray-600' : 'text-white/60'}`}>
            There are currently no weather alerts for your location.
          </p>
        </GlassCard>
      )}

      {/* Alert Settings */}
      <div className="mt-8">
        <h3 className={`${isLightMode ? 'text-gray-900' : 'text-white/90'} mb-4 tracking-wide`}>
          Alert Preferences
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <GlassCard hover isLightMode={isLightMode} className="p-4">
            <div className="flex items-center justify-between">
              <span className={isLightMode ? 'text-gray-900' : 'text-white'}>Severe Weather</span>
              <button 
                onClick={() => toggleSetting('severeWeather')}
                className={`w-12 h-6 rounded-full transition-all duration-300 relative ${
                  alertSettings.severeWeather 
                    ? 'bg-blue-500 toggle-animate-on' 
                    : isLightMode ? 'bg-gray-300 toggle-animate-off' : 'bg-white/20 toggle-animate-off'
                }`}
              >
                <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all duration-300 shadow-md ${
                  alertSettings.severeWeather ? 'right-0.5' : 'left-0.5'
                }`}></div>
              </button>
            </div>
          </GlassCard>

          <GlassCard hover isLightMode={isLightMode} className="p-4">
            <div className="flex items-center justify-between">
              <span className={isLightMode ? 'text-gray-900' : 'text-white'}>Daily Forecast</span>
              <button 
                onClick={() => toggleSetting('dailyForecast')}
                className={`w-12 h-6 rounded-full transition-all duration-300 relative ${
                  alertSettings.dailyForecast 
                    ? 'bg-blue-500 toggle-animate-on' 
                    : isLightMode ? 'bg-gray-300 toggle-animate-off' : 'bg-white/20 toggle-animate-off'
                }`}
              >
                <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all duration-300 shadow-md ${
                  alertSettings.dailyForecast ? 'right-0.5' : 'left-0.5'
                }`}></div>
              </button>
            </div>
          </GlassCard>

          <GlassCard hover isLightMode={isLightMode} className="p-4">
            <div className="flex items-center justify-between">
              <span className={isLightMode ? 'text-gray-900' : 'text-white'}>Rain Alerts</span>
              <button 
                onClick={() => toggleSetting('rainAlerts')}
                className={`w-12 h-6 rounded-full transition-all duration-300 relative ${
                  alertSettings.rainAlerts 
                    ? 'bg-blue-500 toggle-animate-on' 
                    : isLightMode ? 'bg-gray-300 toggle-animate-off' : 'bg-white/20 toggle-animate-off'
                }`}
              >
                <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all duration-300 shadow-md ${
                  alertSettings.rainAlerts ? 'right-0.5' : 'left-0.5'
                }`}></div>
              </button>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Notification Toasts */}
      <div className="fixed top-20 right-4 z-50 space-y-2">
        {notifications.map((notification) => (
          <NotificationToast
            key={notification.id}
            {...notification}
            onClose={removeNotification}
            isLightMode={isLightMode}
          />
        ))}
      </div>
    </div>
  );
};
