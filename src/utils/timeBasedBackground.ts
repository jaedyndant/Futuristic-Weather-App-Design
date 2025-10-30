export const getTimeBasedBackground = (weatherCondition: string = '') => {
  const hour = new Date().getHours();
  const condition = weatherCondition.toLowerCase();
  
  // Time periods
  const isNight = hour >= 22 || hour < 6;
  const isSunrise = hour >= 6 && hour < 8;
  const isSunset = hour >= 18 && hour < 22;
  const isDay = hour >= 8 && hour < 18;
  
  // Weather conditions
  const isCloudy = condition.includes('cloud') || condition.includes('overcast');
  const isRainy = condition.includes('rain') || condition.includes('drizzle');
  const isStormy = condition.includes('storm') || condition.includes('thunder');
  const isSnowy = condition.includes('snow');
  const isFoggy = condition.includes('fog') || condition.includes('mist');
  
  if (isNight) {
    if (isRainy || isStormy) {
      return 'bg-gradient-to-br from-gray-900 via-slate-900 to-black';
    }
    if (isCloudy) {
      return 'bg-gradient-to-br from-gray-800 via-gray-900 to-black';
    }
    return 'bg-gradient-to-br from-blue-900/50 to-black starry-night';
  }
  
  if (isSunrise) {
    if (isRainy || isStormy) {
      return 'bg-gradient-to-br from-gray-500 via-orange-300 to-gray-600';
    }
    if (isCloudy) {
      return 'bg-gradient-to-br from-orange-300 via-gray-400 to-blue-300';
    }
    return 'bg-gradient-to-br from-orange-400 via-pink-400 to-blue-400';
  }
  
  if (isSunset) {
    if (isRainy || isStormy) {
      return 'bg-gradient-to-br from-gray-600 via-orange-400 to-gray-700';
    }
    if (isCloudy) {
      return 'bg-gradient-to-br from-orange-400 via-gray-500 to-purple-400';
    }
    return 'bg-gradient-to-br from-orange-500 via-red-400 to-purple-500';
  }
  
  // Day time
  if (isSnowy) {
    return 'bg-gradient-to-br from-gray-300 via-blue-200 to-white';
  }
  if (isRainy || isStormy) {
    return 'bg-gradient-to-br from-gray-500 via-slate-600 to-gray-700';
  }
  if (isFoggy) {
    return 'bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500';
  }
  if (isCloudy) {
    return 'bg-gradient-to-br from-gray-400 via-slate-500 to-gray-600';
  }
  
  return 'bg-gradient-to-br from-blue-400 via-cyan-300 to-blue-500';
};

export const getTimeBasedOrbs = (weatherCondition: string = '') => {
  const hour = new Date().getHours();
  const condition = weatherCondition.toLowerCase();
  const isNight = hour >= 22 || hour < 6;
  const isCloudy = condition.includes('cloud') || condition.includes('rain');
  
  if (isNight) {
    return {
      orb1: 'bg-transparent',
      orb2: 'bg-transparent', 
      orb3: 'bg-transparent'
    };
  }
  
  return {
    orb1: isCloudy ? 'bg-gray-400/30' : 'bg-yellow-300/40',
    orb2: isCloudy ? 'bg-slate-400/20' : 'bg-orange-300/25',
    orb3: isCloudy ? 'bg-gray-300/15' : 'bg-cyan-300/20'
  };
};