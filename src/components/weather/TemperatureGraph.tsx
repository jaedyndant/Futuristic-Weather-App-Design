import React, { useState } from 'react';
import { GlassCard } from './GlassCard';
import { formatTemperature } from '../../utils/temperature';
import { TrendingUp, TrendingDown, Thermometer } from 'lucide-react';

interface TemperatureGraphProps {
  weatherData: any;
  isLightMode?: boolean;
  isCelsius?: boolean;
  isMobile?: boolean;
}

export const TemperatureGraph: React.FC<TemperatureGraphProps> = ({ 
  weatherData, 
  isLightMode = false, 
  isCelsius = true,
  isMobile = false
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  const allHourlyData = weatherData.hourly.slice(0, 12);
  const hourlyData = isMobile ? 
    allHourlyData.filter((_, i) => i % 3 === 0) : 
    allHourlyData.filter((_, i) => i % 2 === 0);
  const temps = hourlyData.map((hour: any) => hour.temp);
  const minTemp = Math.min(...temps);
  const maxTemp = Math.max(...temps);
  const tempRange = maxTemp - minTemp || 1;
  const avgTemp = temps.reduce((a, b) => a + b, 0) / temps.length;
  
  const firstHalf = temps.slice(0, 6).reduce((a, b) => a + b, 0) / 6;
  const secondHalf = temps.slice(6).reduce((a, b) => a + b, 0) / 6;
  const trend = secondHalf > firstHalf ? 'rising' : secondHalf < firstHalf ? 'falling' : 'stable';

  const getYPosition = (temp: number) => {
    return isMobile ? 
      75 - ((temp - minTemp) / tempRange) * 50 :
      80 - ((temp - minTemp) / tempRange) * 65;
  };

  const pathData = hourlyData.map((hour: any, index: number) => {
    const x = isMobile ? 
      (index / (hourlyData.length - 1)) * 100 :
      (index / (hourlyData.length - 1)) * 100;
    const y = getYPosition(hour.temp);
    return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  return (
    <GlassCard isLightMode={isLightMode} className={`${isMobile ? 'p-4' : 'p-6'} w-full`}>
      <div className={`${isMobile ? 'block' : 'flex gap-6'}`}>
        <div className={`${isMobile ? 'w-full' : 'flex-1'}`}>
      <div className={`${isMobile ? 'flex-col gap-3' : 'flex items-center justify-between'} mb-4`}>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Thermometer size={isMobile ? 18 : 20} className={isLightMode ? 'text-gray-800' : 'text-white'} />
            <h3 className={`${isLightMode ? 'text-gray-900' : 'text-white'} ${isMobile ? 'text-base' : 'text-lg'}`}>
              Temperature Trend
            </h3>
          </div>
          <p className={`${isLightMode ? 'text-gray-600' : 'text-white/60'} ${isMobile ? 'text-xs' : 'text-sm'}`}>
            Next 12 hours • Avg {formatTemperature(avgTemp, isCelsius)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {trend === 'rising' ? (
            <TrendingUp size={isMobile ? 16 : 20} className="text-red-500" />
          ) : trend === 'falling' ? (
            <TrendingDown size={isMobile ? 16 : 20} className="text-blue-500" />
          ) : (
            <div className="w-4 h-0.5 bg-gray-500 rounded" />
          )}
          <span className={`${isMobile ? 'text-xs' : 'text-sm'} ${isLightMode ? 'text-gray-700' : 'text-white/80'}`}>
            {trend === 'rising' ? 'Rising' : trend === 'falling' ? 'Falling' : 'Stable'}
          </span>
        </div>
      </div>
      
      <div className={`relative ${isMobile ? 'h-32 mb-4' : 'h-48 mb-6'} w-full`}>
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <defs>
            <linearGradient id="tempGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={isLightMode ? "#3b82f6" : "#60a5fa"} stopOpacity="0.4"/>
              <stop offset="50%" stopColor={isLightMode ? "#8b5cf6" : "#a78bfa"} stopOpacity="0.2"/>
              <stop offset="100%" stopColor={isLightMode ? "#3b82f6" : "#60a5fa"} stopOpacity="0"/>
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/> 
              </feMerge>
            </filter>
          </defs>
          
          {[0, 20, 40, 60, 80, 100].map(x => (
            <line
              key={x}
              x1={x}
              y1="10"
              x2={x}
              y2="85"
              stroke={isLightMode ? "#e5e7eb" : "#374151"}
              strokeWidth="0.5"
              opacity="0.5"
            />
          ))}
          
          <path
            d={`${pathData} L 100 85 L 0 85 Z`}
            fill="url(#tempGradient)"
          />
          
          <path
            d={pathData}
            stroke={isLightMode ? "#3b82f6" : "#60a5fa"}
            strokeWidth="3"
            fill="none"
            filter="url(#glow)"
          />
          
          {hourlyData.map((hour: any, index: number) => {
            const x = (index / (hourlyData.length - 1)) * 100;
            const y = getYPosition(hour.temp);
            const isHovered = hoveredPoint === index;
            return (
              <g key={index}>
                <circle
                  cx={x}
                  cy={y}
                  r={isHovered ? "6" : "4"}
                  fill={isLightMode ? "#3b82f6" : "#60a5fa"}
                  stroke={isLightMode ? "#ffffff" : "#1f2937"}
                  strokeWidth="2"
                  className="cursor-pointer transition-all duration-200"
                  onMouseEnter={() => setHoveredPoint(index)}
                  onMouseLeave={() => setHoveredPoint(null)}
                />
                {isHovered && (
                  <g>
                    <rect
                      x={x - 15}
                      y={y - 25}
                      width="30"
                      height="18"
                      fill={isLightMode ? "#1f2937" : "#ffffff"}
                      rx="4"
                      opacity="0.9"
                    />
                    <text
                      x={x}
                      y={y - 12}
                      textAnchor="middle"
                      fontSize="10"
                      fill={isLightMode ? "#ffffff" : "#1f2937"}
                      fontWeight="bold"
                    >
                      {formatTemperature(hour.temp, isCelsius)}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
          
          <text
            x="2"
            y={getYPosition(maxTemp) - 2}
            fontSize="10"
            fill={isLightMode ? "#ef4444" : "#f87171"}
            fontWeight="bold"
          >
            High: {formatTemperature(maxTemp, isCelsius)}
          </text>
          <text
            x="2"
            y={getYPosition(minTemp) + 12}
            fontSize="10"
            fill={isLightMode ? "#3b82f6" : "#60a5fa"}
            fontWeight="bold"
          >
            Low: {formatTemperature(minTemp, isCelsius)}
          </text>
        </svg>
      </div>
      
      <div className={`grid ${isMobile ? 'grid-cols-4' : 'grid-cols-6'} ${isMobile ? 'gap-1 px-2' : 'gap-4'} ${isMobile ? 'text-xs mb-3' : 'text-xs mb-4'}`}>
        {hourlyData.map((hour: any, index: number) => (
          <div key={index} className={`text-center ${isMobile ? 'w-full' : ''}`}>
            <div className={`${isLightMode ? 'text-gray-900' : 'text-white'} font-medium mb-1 ${isMobile ? 'text-xs' : ''}`}>
              {formatTemperature(hour.temp, isCelsius)}
            </div>
            <div className={`${isLightMode ? 'text-gray-600' : 'text-white/60'} ${isMobile ? 'text-xs' : ''}`}>
              {hour.time}
            </div>
            {!isMobile && (
              <div className={`${isLightMode ? 'text-gray-500' : 'text-white/50'} text-xs mt-1 capitalize`}>
                {hour.condition.split(' ')[0]}
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className={`grid grid-cols-3 ${isMobile ? 'gap-2 pt-3' : 'gap-4 pt-4'} border-t border-white/10`}>
        <div className="text-center">
          <div className={`${isLightMode ? 'text-gray-600' : 'text-white/60'} ${isMobile ? 'text-xs' : 'text-xs'} mb-1`}>Range</div>
          <div className={`${isLightMode ? 'text-gray-900' : 'text-white'} font-medium ${isMobile ? 'text-sm' : ''}`}>
            {Math.round(tempRange)}°
          </div>
        </div>
        <div className="text-center">
          <div className={`${isLightMode ? 'text-gray-600' : 'text-white/60'} ${isMobile ? 'text-xs' : 'text-xs'} mb-1`}>Peak Time</div>
          <div className={`${isLightMode ? 'text-gray-900' : 'text-white'} font-medium ${isMobile ? 'text-sm' : ''}`}>
            {hourlyData[temps.indexOf(maxTemp)]?.time || 'N/A'}
          </div>
        </div>
        <div className="text-center">
          <div className={`${isLightMode ? 'text-gray-600' : 'text-white/60'} ${isMobile ? 'text-xs' : 'text-xs'} mb-1`}>Trend</div>
          <div className={`font-medium ${isMobile ? 'text-sm' : ''} ${
            trend === 'rising' ? 'text-red-500' : 
            trend === 'falling' ? 'text-blue-500' : 
            (isLightMode ? 'text-gray-700' : 'text-white/80')
          }`}>
            {trend === 'rising' ? '+' : trend === 'falling' ? '-' : '='}{Math.abs(Math.round(secondHalf - firstHalf))}°
          </div>
        </div>
      </div>
        </div>
        
        {!isMobile && (
          <div className="w-48 flex flex-col gap-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={`${isLightMode ? 'text-gray-600' : 'text-white/60'} text-xs`}>Wind</span>
                <span className={`${isLightMode ? 'text-gray-900' : 'text-white'} text-sm font-medium`}>
                  {weatherData.current.windSpeed} km/h
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className={`${isLightMode ? 'text-gray-600' : 'text-white/60'} text-xs`}>Humidity</span>
                <span className={`${isLightMode ? 'text-gray-900' : 'text-white'} text-sm font-medium`}>
                  {weatherData.current.humidity}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className={`${isLightMode ? 'text-gray-600' : 'text-white/60'} text-xs`}>Visibility</span>
                <span className={`${isLightMode ? 'text-gray-900' : 'text-white'} text-sm font-medium`}>
                  {weatherData.current.visibility} km
                </span>
              </div>
            </div>
            
            <div className={`border-t border-white/10 pt-4`}>
              <div className={`${isLightMode ? 'text-gray-600' : 'text-white/60'} text-xs mb-2`}>Current Condition</div>
              <div className={`${isLightMode ? 'text-gray-900' : 'text-white'} text-sm font-medium capitalize`}>
                {weatherData.current.condition}
              </div>
            </div>
            
            <div className={`border-t border-white/10 pt-4`}>
              <div className={`${isLightMode ? 'text-gray-600' : 'text-white/60'} text-xs mb-2`}>Feels Like</div>
              <div className={`${isLightMode ? 'text-gray-900' : 'text-white'} text-lg font-bold`}>
                {formatTemperature(weatherData.current.temperature + (Math.random() > 0.5 ? 2 : -2), isCelsius)}
              </div>
            </div>
          </div>
        )}
      </div>
    </GlassCard>
  );
};