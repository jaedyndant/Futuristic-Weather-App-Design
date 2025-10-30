import React, { useMemo } from 'react';
import { Cloud, CloudRain, Sun, CloudSnow, Wind, CloudDrizzle, CloudLightning, Cloudy } from 'lucide-react';

interface WeatherIconProps {
  condition: string;
  size?: number;
  animated?: boolean;
  isLightMode?: boolean;
}

// Icon mapping for better performance
const ICON_MAP = {
  sunny: Sun,
  clear: Sun,
  'light drizzle': CloudDrizzle,
  'patchy light drizzle': CloudDrizzle,
  drizzle: CloudDrizzle,
  'light rain': CloudRain,
  'patchy light rain': CloudRain,
  'moderate rain': CloudRain,
  'heavy rain': CloudRain,
  rain: CloudRain,
  rainy: CloudRain,
  snow: CloudSnow,
  snowy: CloudSnow,
  'light snow': CloudSnow,
  'heavy snow': CloudSnow,
  cloudy: Cloudy,
  overcast: Cloudy,
  'partly cloudy': Cloud,
  'patchy rain possible': Cloud,
  windy: Wind,
  thunderstorm: CloudLightning,
  storm: CloudLightning,
  'thundery outbreaks possible': CloudLightning,
  mist: Cloud,
  fog: Cloud,
} as const;

export const WeatherIcon: React.FC<WeatherIconProps> = React.memo(({ 
  condition, 
  size = 64,
  animated = false,
  isLightMode = false
}) => {
  const { IconComponent, className } = useMemo(() => {
    const normalizedCondition = condition?.toLowerCase().trim() || '';
    
    // Try exact match first
    let IconComp = ICON_MAP[normalizedCondition as keyof typeof ICON_MAP];
    
    // If no exact match, try partial matches
    if (!IconComp) {
      if (normalizedCondition.includes('sun') || normalizedCondition.includes('clear')) {
        IconComp = Sun;
      } else if (normalizedCondition.includes('drizzle')) {
        IconComp = CloudDrizzle;
      } else if (normalizedCondition.includes('rain')) {
        IconComp = CloudRain;
      } else if (normalizedCondition.includes('snow')) {
        IconComp = CloudSnow;
      } else if (normalizedCondition.includes('thunder') || normalizedCondition.includes('storm')) {
        IconComp = CloudLightning;
      } else if (normalizedCondition.includes('cloud') && normalizedCondition.includes('partly')) {
        IconComp = Cloud;
      } else if (normalizedCondition.includes('cloud') || normalizedCondition.includes('overcast')) {
        IconComp = Cloudy;
      } else if (normalizedCondition.includes('wind')) {
        IconComp = Wind;
      } else {
        IconComp = Cloud; // Default fallback
      }
    }
    
    const baseColor = isLightMode ? 'text-gray-800' : 'text-white';
    const animationClass = animated ? 'animate-pulse' : '';
    const shadowClass = isLightMode 
      ? 'drop-shadow-[0_0_10px_rgba(0,0,0,0.2)]' 
      : 'drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]';
    
    return {
      IconComponent: IconComp,
      className: `${animationClass} ${shadowClass} ${baseColor}`.trim()
    };
  }, [condition, animated, isLightMode]);

  return (
    <div className={animated ? 'animate-[float_3s_ease-in-out_infinite]' : ''}>
      <IconComponent 
        size={size}
        className={className}
        strokeWidth={1.5}
      />
    </div>
  );
});
