import weatherConditions from '../data/weatherConditions.json';

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY || 'b5a00645ee994388976210951252910';
const BASE_URL = 'https://api.weatherapi.com/v1';

export interface WeatherData {
  location: {
    name: string;
    country: string;
    lat: number;
    lon: number;
  };
  current: {
    temp_c: number;
    condition: {
      text: string;
      code: number;
    };
    humidity: number;
    wind_kph: number;
    vis_km: number;
    uv: number;
    pressure_mb: number;
    feelslike_c: number;
    air_quality?: {
      co: number;
      no2: number;
      o3: number;
      so2: number;
      pm2_5: number;
      pm10: number;
      us_epa_index: number;
      gb_defra_index: number;
    };
  };
  forecast: {
    forecastday: Array<{
      date: string;
      day: {
        maxtemp_c: number;
        mintemp_c: number;
        condition: {
          text: string;
          code: number;
        };
        daily_chance_of_rain: number;
        avghumidity: number;
        maxwind_kph: number;
      };
      astro: {
        sunrise: string;
        sunset: string;
      };
      hour: Array<{
        time: string;
        temp_c: number;
        condition: {
          text: string;
          code: number;
        };
      }>;
    }>;
  };
}

export const getWeatherCondition = (code: number, isDay: boolean = true) => {
  const condition = weatherConditions.find(c => c.code === code);
  return condition ? (isDay ? condition.day : condition.night) : 'Unknown';
};

export const fetchWeatherData = async (location: string): Promise<WeatherData> => {
  if (!location || typeof location !== 'string') {
    throw new Error('Invalid location parameter');
  }
  
  try {
    const response = await fetch(
      `${BASE_URL}/forecast.json?key=${API_KEY}&q=${encodeURIComponent(location)}&days=7&aqi=yes&alerts=no`
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Weather API error: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    if (!data || !data.current || !data.location) {
      throw new Error('Invalid weather data received');
    }
    
    return data;
  } catch (error) {
    console.error('Failed to fetch weather data:', error);
    throw error;
  }
};

export const getCurrentLocation = (): Promise<{lat: number, lon: number}> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'));
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude
        });
      },
      (error) => {
        reject(new Error(`Geolocation error: ${error.message}`));
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  });
};