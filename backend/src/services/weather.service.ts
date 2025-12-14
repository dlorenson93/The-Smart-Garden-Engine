import axios from 'axios';

export interface WeatherData {
  current: {
    temp: number;
    feelsLike: number;
    condition: string;
    icon: string;
    humidity: number;
    windSpeed: number;
    precipitation: number;
  };
  forecast: Array<{
    date: string;
    dayOfWeek: string;
    high: number;
    low: number;
    condition: string;
    icon: string;
    precipitationChance: number;
  }>;
  sunrise: string;
  sunset: string;
  location: {
    latitude: number;
    longitude: number;
  };
}

/**
 * Map WMO weather codes to human-readable conditions and icons
 * https://open-meteo.com/en/docs
 */
function getWeatherInfo(weatherCode: number, isDay: boolean = true): { condition: string; icon: string } {
  const weatherMap: Record<number, { condition: string; dayIcon: string; nightIcon: string }> = {
    0: { condition: 'Clear', dayIcon: '☀️', nightIcon: '🌙' },
    1: { condition: 'Mostly Clear', dayIcon: '🌤️', nightIcon: '🌙' },
    2: { condition: 'Partly Cloudy', dayIcon: '⛅', nightIcon: '☁️' },
    3: { condition: 'Cloudy', dayIcon: '☁️', nightIcon: '☁️' },
    45: { condition: 'Foggy', dayIcon: '🌫️', nightIcon: '🌫️' },
    48: { condition: 'Foggy', dayIcon: '🌫️', nightIcon: '🌫️' },
    51: { condition: 'Light Drizzle', dayIcon: '🌦️', nightIcon: '🌧️' },
    53: { condition: 'Drizzle', dayIcon: '🌦️', nightIcon: '🌧️' },
    55: { condition: 'Heavy Drizzle', dayIcon: '🌧️', nightIcon: '🌧️' },
    61: { condition: 'Light Rain', dayIcon: '🌦️', nightIcon: '🌧️' },
    63: { condition: 'Rain', dayIcon: '🌧️', nightIcon: '🌧️' },
    65: { condition: 'Heavy Rain', dayIcon: '🌧️', nightIcon: '🌧️' },
    71: { condition: 'Light Snow', dayIcon: '🌨️', nightIcon: '🌨️' },
    73: { condition: 'Snow', dayIcon: '❄️', nightIcon: '❄️' },
    75: { condition: 'Heavy Snow', dayIcon: '❄️', nightIcon: '❄️' },
    77: { condition: 'Snow Grains', dayIcon: '🌨️', nightIcon: '🌨️' },
    80: { condition: 'Light Showers', dayIcon: '🌦️', nightIcon: '🌧️' },
    81: { condition: 'Showers', dayIcon: '🌧️', nightIcon: '🌧️' },
    82: { condition: 'Heavy Showers', dayIcon: '🌧️', nightIcon: '🌧️' },
    85: { condition: 'Light Snow Showers', dayIcon: '🌨️', nightIcon: '🌨️' },
    86: { condition: 'Snow Showers', dayIcon: '❄️', nightIcon: '❄️' },
    95: { condition: 'Thunderstorm', dayIcon: '⛈️', nightIcon: '⛈️' },
    96: { condition: 'Thunderstorm with Hail', dayIcon: '⛈️', nightIcon: '⛈️' },
    99: { condition: 'Thunderstorm with Heavy Hail', dayIcon: '⛈️', nightIcon: '⛈️' },
  };

  const info = weatherMap[weatherCode] || { condition: 'Unknown', dayIcon: '🌤️', nightIcon: '🌙' };
  return {
    condition: info.condition,
    icon: isDay ? info.dayIcon : info.nightIcon,
  };
}

/**
 * Convert Celsius to Fahrenheit
 */
function celsiusToFahrenheit(celsius: number): number {
  return Math.round((celsius * 9) / 5 + 32);
}

/**
 * Format time from ISO string to 12-hour format
 */
function formatTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

/**
 * Get day of week from date string
 */
function getDayOfWeek(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { weekday: 'short' });
}

/**
 * Fetch weather data from Open-Meteo API
 * @param latitude - Latitude coordinate
 * @param longitude - Longitude coordinate
 * @returns Weather data including current conditions and 7-day forecast
 */
export async function getWeather(latitude: number, longitude: number): Promise<WeatherData> {
  try {
    // Open-Meteo API - Free, no API key required
    const response = await axios.get('https://api.open-meteo.com/v1/forecast', {
      timeout: 10000, // 10 second timeout
      params: {
        latitude,
        longitude,
        current: [
          'temperature_2m',
          'apparent_temperature',
          'relative_humidity_2m',
          'precipitation',
          'weather_code',
          'wind_speed_10m',
          'is_day',
        ].join(','),
        daily: [
          'weather_code',
          'temperature_2m_max',
          'temperature_2m_min',
          'sunrise',
          'sunset',
          'precipitation_probability_max',
        ].join(','),
        temperature_unit: 'fahrenheit',
        wind_speed_unit: 'mph',
        precipitation_unit: 'inch',
        timezone: 'auto',
        forecast_days: 7,
      },
    });

    const data = response.data;

    // Parse current weather
    const currentWeatherInfo = getWeatherInfo(data.current.weather_code, data.current.is_day === 1);

    // Parse 7-day forecast
    const forecast = data.daily.time.map((date: string, index: number) => {
      const forecastWeatherInfo = getWeatherInfo(data.daily.weather_code[index], true);
      return {
        date,
        dayOfWeek: getDayOfWeek(date),
        high: Math.round(data.daily.temperature_2m_max[index]),
        low: Math.round(data.daily.temperature_2m_min[index]),
        condition: forecastWeatherInfo.condition,
        icon: forecastWeatherInfo.icon,
        precipitationChance: data.daily.precipitation_probability_max[index] || 0,
      };
    });

    // Get today's sunrise and sunset
    const sunrise = formatTime(data.daily.sunrise[0]);
    const sunset = formatTime(data.daily.sunset[0]);

    return {
      current: {
        temp: Math.round(data.current.temperature_2m),
        feelsLike: Math.round(data.current.apparent_temperature),
        condition: currentWeatherInfo.condition,
        icon: currentWeatherInfo.icon,
        humidity: Math.round(data.current.relative_humidity_2m),
        windSpeed: Math.round(data.current.wind_speed_10m),
        precipitation: parseFloat(data.current.precipitation.toFixed(2)),
      },
      forecast,
      sunrise,
      sunset,
      location: {
        latitude,
        longitude,
      },
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw new Error('Failed to fetch weather data from Open-Meteo API');
  }
}

/**
 * Get weather data using postal code (requires geocoding first)
 * Note: Open-Meteo doesn't have built-in geocoding, so we use their geocoding API
 */
export async function getWeatherByPostalCode(postalCode: string, countryCode: string = 'US'): Promise<WeatherData> {
  try {
    // For US ZIP codes, try to use a more specific geocoding approach
    let geocodeUrl = 'https://geocoding-api.open-meteo.com/v1/search';
    let params: any = {
      name: postalCode,
      count: 1,
      language: 'en',
      format: 'json',
    };

    // If it's a US ZIP code (5 digits), add country filter
    if (countryCode === 'US' && /^\d{5}$/.test(postalCode)) {
      params.country = 'US';
      params.name = postalCode;
    }

    const geocodeResponse = await axios.get(geocodeUrl, { params, timeout: 10000 });

    if (!geocodeResponse.data.results || geocodeResponse.data.results.length === 0) {
      // Try alternative: use the ZIP code as a city search
      const altResponse = await axios.get(geocodeUrl, {
        params: {
          name: `${postalCode}, ${countryCode}`,
          count: 1,
          language: 'en',
          format: 'json',
        },
        timeout: 10000,
      });

      if (!altResponse.data.results || altResponse.data.results.length === 0) {
        throw new Error(`Location not found for postal code: ${postalCode}`);
      }

      const location = altResponse.data.results[0];
      return await getWeather(location.latitude, location.longitude);
    }

    const location = geocodeResponse.data.results[0];
    return await getWeather(location.latitude, location.longitude);
  } catch (error) {
    console.error('Error fetching weather by postal code:', error);
    throw new Error(`Failed to fetch weather data for postal code: ${postalCode}`);
  }
}
