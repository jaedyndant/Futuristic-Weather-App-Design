import { useState, useEffect } from 'react';
import { fetchWeatherData, getCurrentLocation, WeatherData } from '../services/weatherApi';

export const useWeather = (defaultLocation = 'London') => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = async (location: string) => {
    if (!location) {
      setError('Location is required');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      const data = await fetchWeatherData(location);
      setWeatherData(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch weather';
      setError(errorMessage);
      console.warn('Weather fetch error:', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentLocationWeather = async () => {
    try {
      setLoading(true);
      const coords = await getCurrentLocation();
      await fetchWeather(`${coords.lat},${coords.lon}`);
    } catch (err) {
      console.warn('Geolocation failed, using default location:', err);
      await fetchWeather(defaultLocation);
    }
  };

  useEffect(() => {
    fetchCurrentLocationWeather();
  }, []);

  return { weatherData, loading, error, fetchWeather, refetch: fetchCurrentLocationWeather };
};