import React, { useState } from 'react';
import { GlassCard } from './GlassCard';
import { Radar, Play, Pause, SkipBack, SkipForward, Layers } from 'lucide-react';

interface RadarPageProps {
  isLightMode?: boolean;
  weatherData?: any;
}

export const RadarPage: React.FC<RadarPageProps> = ({ isLightMode = false, weatherData }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeLayer, setActiveLayer] = useState('precipitation');
  const [zoomLevel, setZoomLevel] = useState(7);
  const [animationFrame, setAnimationFrame] = useState(0);


  const layers = [
    { id: 'precipitation', label: 'Precipitation', overlay: 'rain' },
    { id: 'temperature', label: 'Temperature', overlay: 'temp' },
    { id: 'wind', label: 'Wind Speed', overlay: 'wind' },
  ];

  // Use weather location or default to Netherlands
  const getMapCenter = () => {
    if (weatherData?.location) {
      return { lat: weatherData.location.lat || 52.370, lon: weatherData.location.lon || 4.895 };
    }
    return { lat: 52.370, lon: 4.895 };
  };
  
  const [mapCenter, setMapCenter] = useState(getMapCenter());
  
  // Update map center when weather data changes
  React.useEffect(() => {
    setMapCenter(getMapCenter());
  }, [weatherData?.location]);

  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setAnimationFrame(prev => (prev + 1) % 8);
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const getRadarUrl = () => {
    try {
      const currentLayer = layers.find(l => l.id === activeLayer);
      return `https://embed.windy.com/embed.html?type=map&location=coordinates&metricRain=default&metricTemp=default&metricWind=default&zoom=${zoomLevel}&overlay=${currentLayer?.overlay || 'rain'}&product=ecmwf&level=surface&lat=${mapCenter.lat}&lon=${mapCenter.lon}&menu=false&message=false&marker=false&calendar=false&pressure=false&type=map&actualGrid=false&menu=false`;
    } catch (error) {
      console.warn('Error generating radar URL:', error);
      return '';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-2 lg:px-8 animate-[theme-fade_0.3s_ease-in]">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Radar size={32} className={isLightMode ? 'text-gray-800' : 'text-white'} strokeWidth={1.5} />
          <h2 className={`${isLightMode ? 'text-gray-900' : 'text-white'} text-3xl tracking-tight`}>
            Weather Radar
          </h2>
        </div>
        <p className={`${isLightMode ? 'text-gray-600' : 'text-white/60'} ml-11`}>
          Live precipitation and weather patterns
        </p>
      </div>

      {/* Radar */}
      <GlassCard isLightMode={isLightMode} className="mb-6 overflow-hidden">
        <div className="relative aspect-video lg:aspect-video aspect-square bg-gray-900">
          {/* Map Background */}
          <div className="absolute inset-0">
            <iframe
              key={`${activeLayer}-${zoomLevel}`}
              src={getRadarUrl()}
              className="w-full h-full border-0"
              title="Weather Radar Netherlands"
              onError={() => console.warn('Radar iframe failed to load')}
            />
          </div>
          
          {/* Fallback if iframe doesn't load */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-800 to-blue-900">
            {/* Netherlands Map Outline */}
            <svg viewBox="0 0 400 300" className="w-full h-full">
              <defs>
                <pattern id="radarGrid" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5"/>
                </pattern>
              </defs>
              
              {/* Grid background */}
              <rect width="100%" height="100%" fill="url(#radarGrid)" />
              

              
              {/* Major cities */}
              <circle cx="200" cy="120" r="3" fill="#fbbf24" stroke="white" strokeWidth="1"/>
              <text x="205" y="115" fill="white" fontSize="10" className="font-medium">Amsterdam</text>
              
              <circle cx="220" cy="140" r="2" fill="#10b981" stroke="white" strokeWidth="1"/>
              <text x="225" y="135" fill="white" fontSize="9">Utrecht</text>
              
              <circle cx="180" cy="160" r="2" fill="#f97316" stroke="white" strokeWidth="1"/>
              <text x="185" y="155" fill="white" fontSize="9">Rotterdam</text>
              
              <circle cx="240" cy="180" r="2" fill="#ef4444" stroke="white" strokeWidth="1"/>
              <text x="245" y="175" fill="white" fontSize="9">Eindhoven</text>
            </svg>
            
            {/* Weather radar overlay */}
            <div className="absolute inset-0">
              {weatherData?.current?.condition?.text?.toLowerCase().includes('rain') && (
                <>
                  <div className="absolute top-[25%] left-[35%] w-32 h-32 bg-blue-500/30 rounded-full blur-2xl animate-pulse"></div>
                  <div className="absolute top-[45%] left-[55%] w-24 h-24 bg-blue-400/25 rounded-full blur-xl animate-pulse"></div>
                  <div className="absolute top-[35%] left-[45%] w-20 h-20 bg-cyan-400/20 rounded-full blur-lg animate-pulse"></div>
                </>
              )}
              
              {weatherData?.current?.condition?.text?.toLowerCase().includes('cloud') && (
                <>
                  <div className="absolute top-[30%] left-[40%] w-40 h-40 bg-gray-400/20 rounded-full blur-3xl"></div>
                  <div className="absolute top-[50%] left-[50%] w-35 h-35 bg-gray-300/15 rounded-full blur-2xl"></div>
                </>
              )}
            </div>
          </div>



          {/* Radar Legend - moved to bottom right and more compact */}
          <div className="absolute bottom-2 right-2">
            <div className={`${isLightMode ? 'bg-white/40' : 'bg-black/30'} backdrop-blur-sm px-2 py-1 rounded`}>
              <div className="flex items-center gap-1">
                <div className="w-2 h-1 bg-green-400 rounded-sm"></div>
                <div className="w-2 h-1 bg-yellow-400 rounded-sm"></div>
                <div className="w-2 h-1 bg-red-500 rounded-sm"></div>
                <span className={`${isLightMode ? 'text-gray-700' : 'text-white/80'} text-xs ml-1`}>Rain</span>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="p-3 lg:p-6 border-t border-white/10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-3 lg:gap-4">


            {/* Zoom Controls */}
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className={`${isLightMode ? 'glass-nav-item-light' : 'glass-nav-item'} px-3 py-2 rounded-lg text-sm hover:scale-105 transition-transform`}
              >
                {isPlaying ? 
                  <Pause size={16} className={isLightMode ? 'text-gray-800' : 'text-white'} /> : 
                  <Play size={16} className={isLightMode ? 'text-gray-800' : 'text-white'} />
                }
              </button>
              <button 
                className={`${isLightMode ? 'glass-nav-item-light' : 'glass-nav-item'} px-2 lg:px-3 py-2 rounded-lg text-sm hover:scale-105 transition-transform`}
                onClick={() => setZoomLevel(Math.max(4, zoomLevel - 1))}
              >
                <span className={isLightMode ? 'text-gray-800' : 'text-white'}>-</span>
              </button>
              <span className={`${isLightMode ? 'text-gray-800' : 'text-white'} text-xs lg:text-sm min-w-[30px] lg:min-w-[40px] text-center`}>
                {zoomLevel}x
              </span>
              <button 
                className={`${isLightMode ? 'glass-nav-item-light' : 'glass-nav-item'} px-2 lg:px-3 py-2 rounded-lg text-sm hover:scale-105 transition-transform`}
                onClick={() => setZoomLevel(Math.min(15, zoomLevel + 1))}
              >
                <span className={isLightMode ? 'text-gray-800' : 'text-white'}>+</span>
              </button>
            </div>



            <div className="flex-1 max-w-md w-full lg:w-auto order-last lg:order-none">
              <div className={`h-1 ${isLightMode ? 'bg-gray-300' : 'bg-white/20'} rounded-full`}>
                <div className={`h-full w-1/3 ${isLightMode ? 'bg-gray-800' : 'bg-white'} rounded-full`}></div>
              </div>
            </div>
          </div>
        </div>
      </GlassCard>


    </div>
  );
};
