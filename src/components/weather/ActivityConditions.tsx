import React, { useState, useRef } from 'react';
import { GlassCard } from './GlassCard';
import { Car, Bike } from 'lucide-react';

interface ActivityConditionsProps {
  weatherData: any;
  isLightMode?: boolean;
}

const RunningIcon = ({ isLightMode }: { isLightMode?: boolean }) => (
  <div className={`w-6 h-6 animate-[running_1s_ease-in-out_infinite] ${isLightMode ? 'text-gray-800' : 'text-white'}`}>
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <path d="M13.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM9.8 8.9L7 23h2.1l1.8-8 2.1 2v6h2v-7.5l-2.1-2 .6-3c1.3 1.5 3.3 2.5 5.5 2.5v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1L5 8.5V13h2V9.6l2.8-.7z"/>
    </svg>
  </div>
);

const activities = [
  { id: 'running', name: 'Running', icon: RunningIcon },
  { id: 'cycling', name: 'Cycling', icon: Bike },
  { id: 'driving', name: 'Driving', icon: Car }
];

const getActivityRating = (condition: string, windSpeed: number, visibility: number, activity: string) => {
  const isRainy = condition.toLowerCase().includes('rain') || condition.toLowerCase().includes('storm');
  const isCloudy = condition.toLowerCase().includes('cloud');
  
  if (activity === 'driving') {
    if (isRainy || visibility < 5) return { rating: 'Poor', color: 'text-red-500' };
    if (windSpeed > 25) return { rating: 'Fair', color: 'text-yellow-500' };
    return { rating: 'Good', color: 'text-green-500' };
  }
  
  if (activity === 'running' || activity === 'cycling') {
    if (isRainy || windSpeed > 30) return { rating: 'Poor', color: 'text-red-500' };
    if (windSpeed > 20 || isCloudy) return { rating: 'Fair', color: 'text-yellow-500' };
    return { rating: 'Good', color: 'text-green-500' };
  }
  
  return { rating: 'Good', color: 'text-green-500' };
};

export const ActivityConditions: React.FC<ActivityConditionsProps> = ({ weatherData, isLightMode = false }) => {
  const [activeActivity, setActiveActivity] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const currentActivity = activities[activeActivity];
  const Icon = currentActivity.icon;
  const rating = getActivityRating(
    weatherData.current.condition,
    weatherData.current.windSpeed,
    weatherData.current.visibility,
    currentActivity.id
  );

  const handleScroll = (direction: 'left' | 'right') => {
    if (direction === 'left' && activeActivity > 0) {
      setActiveActivity(activeActivity - 1);
    } else if (direction === 'right' && activeActivity < activities.length - 1) {
      setActiveActivity(activeActivity + 1);
    }
  };

  const handleTouchScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const scrollLeft = container.scrollLeft;
    const cardWidth = 320;
    const newIndex = Math.round(scrollLeft / cardWidth);
    if (newIndex !== activeActivity && newIndex >= 0 && newIndex < activities.length) {
      setActiveActivity(newIndex);
    }
  };

  return (
    <div className="mb-6">
      <div 
        ref={scrollRef}
        className="flex overflow-x-auto scrollbar-hidden snap-x snap-mandatory lg:transition-transform lg:duration-300 lg:ease-in-out lg:overflow-hidden"
        style={{ transform: window.innerWidth >= 1024 ? `translateX(-${activeActivity * 320}px)` : 'none' }}
        onScroll={handleTouchScroll}
      >
        {activities.map((activity, index) => {
          const ActivityIcon = activity.icon;
          const activityRating = getActivityRating(
            weatherData.current.condition,
            weatherData.current.windSpeed,
            weatherData.current.visibility,
            activity.id
          );
          
          return (
            <GlassCard key={activity.id} isLightMode={isLightMode} className="p-6 w-80 flex-shrink-0 mr-4 snap-center">
              <div className="flex items-center gap-3 mb-4">
                <ActivityIcon isLightMode={isLightMode} className={isLightMode ? 'text-gray-800' : 'text-white'} />
                <h3 className={`${isLightMode ? 'text-gray-900' : 'text-white'} text-lg`}>
                  {activity.name}
                </h3>
              </div>
              
              <div>
                <p className={`${activityRating.color} text-2xl mb-1`}>{activityRating.rating}</p>
                <p className={`${isLightMode ? 'text-gray-600' : 'text-white/60'} text-sm`}>
                  {activityRating.rating === 'Good' ? `Great weather for ${activity.name.toLowerCase()} right now` :
                   activityRating.rating === 'Fair' ? `Okay conditions for ${activity.name.toLowerCase()}` :
                   `Not ideal for ${activity.name.toLowerCase()} today`}
                </p>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
};