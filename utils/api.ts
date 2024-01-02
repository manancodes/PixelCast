// api.ts

const BASE_URL = "https://api.openweathermap.org/data/2.5";
const API_KEY = process.env.EXPO_PUBLIC_API_KEY;

export type MainWeather = {
  temp: number;
  feels_like: number;
};

export type Weather = {
  name: string;
  main: MainWeather;
  weather: [
    {
      main: string;
    }
  ];
};

export type WeatherForecast = {
  main: MainWeather;
  dt: number;
};

export const fetchWeatherData = async (
  latitude: number,
  longitude: number
): Promise<Weather> => {
  try {
    const response = await fetch(
      `${BASE_URL}/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
    );
    return await response.json();
  } catch (error) {
    console.error("Error fetching weather data", error);
    throw error;
  }
};

export const fetchForecastData = async (
  latitude: number,
  longitude: number
): Promise<WeatherForecast[]> => {
  try {
    const response = await fetch(
      `${BASE_URL}/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
    );
    const data = await response.json();
    return data.list;
  } catch (error) {
    console.error("Error fetching forecast data", error);
    throw error;
  }
};
