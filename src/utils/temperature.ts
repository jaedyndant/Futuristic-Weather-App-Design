export const celsiusToFahrenheit = (celsius: number): number => {
  return Math.round((celsius * 9/5) + 32);
};

export const formatTemperature = (temp: number, isCelsius: boolean): string => {
  const value = isCelsius ? Math.round(temp) : celsiusToFahrenheit(temp);
  return `${value}°${isCelsius ? 'C' : 'F'}`;
};