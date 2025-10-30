export const calculateFeelsLike = (temperature: number, windSpeed: number, humidity: number): number => {
  // Wind chill formula (for temperatures below 10°C/50°F)
  if (temperature <= 10) {
    const windChillC = 13.12 + 0.6215 * temperature - 11.37 * Math.pow(windSpeed, 0.16) + 0.3965 * temperature * Math.pow(windSpeed, 0.16);
    return Math.round(windChillC);
  }
  
  // Heat index formula (for temperatures above 26°C/80°F)
  if (temperature >= 26) {
    const heatIndex = temperature + 0.33 * (humidity / 100) * 6.105 * Math.exp(17.27 * temperature / (237.7 + temperature)) - 0.70 * windSpeed - 4.25;
    return Math.round(heatIndex);
  }
  
  // For moderate temperatures, slight adjustment based on wind and humidity
  const adjustment = (windSpeed > 10 ? -1 : 0) + (humidity > 80 ? 1 : humidity < 30 ? -1 : 0);
  return Math.round(temperature + adjustment);
};