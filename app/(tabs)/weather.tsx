import React, { useState, useEffect } from "react";
import { ActivityIndicator, StyleSheet, useColorScheme } from "react-native";
import {
  LocationObject,
  requestForegroundPermissionsAsync,
  getCurrentPositionAsync,
} from "expo-location";

import { Text, View } from "../../components/Themed";
import { PixelifyText } from "../../components/StyledText";

const BASE_URL = "https://api.openweathermap.org/data/2.5";
const API_KEY = process.env.EXPO_PUBLIC_API_KEY;

type MainWeather = {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
  sea_level: number;
  grnd_level: number;
};

type Weather = {
  name: string;
  main: MainWeather;
  weather: [
    {
      id: string;
      main: string;
      description: string;
      icon: string;
    }
  ];
};

export type WeatherForecast = {
  main: MainWeather;
  dt: number;
};

const Weather = () => {
  const theme = useColorScheme() ?? "light";
  const [location, setLocation] = useState<LocationObject | null>(null); // Use null instead of undefined
  const [errorMsg, setErrorMsg] = useState<string | null>(null); // Use null instead of undefined
  const [weather, setWeather] = useState<Weather | null>(null); // Use null instead of undefined
  const [forecast, setForecast] = useState<WeatherForecast[] | null>(null); // Use null instead of undefined

  const fetchWeather = async () => {
    try {
      if (!location) return;

      const response = await fetch(
        `${BASE_URL}/weather?lat=${location.coords.latitude}&lon=${location.coords.longitude}&appid=${API_KEY}&units=metric`
      );
      const data: Weather = await response.json();
      setWeather(data);
    } catch (error) {
      console.error("Error fetching weather data", error);
    }
  };

  const fetchForecast = async () => {
    try {
      if (!location) return;

      const response = await fetch(
        `${BASE_URL}/forecast?lat=${location.coords.latitude}&lon=${location.coords.longitude}&appid=${API_KEY}&units=metric`
      );
      const data: { list: WeatherForecast[] } = await response.json();
      setForecast(data.list);
    } catch (error) {
      console.error("Error fetching forecast data", error);
    }
  };

  useEffect(() => {
    const getLocation = async () => {
      try {
        let { status } = await requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setErrorMsg("Permission to access location was denied");
          return;
        }

        let location = await getCurrentPositionAsync({});
        setLocation(location);
      } catch (error) {
        console.error("Error getting location", error);
        setErrorMsg("Error getting location");
      }
    };

    getLocation();
  }, []);

  useEffect(() => {
    if (location) {
      fetchWeather();
      fetchForecast();
    }
  }, [location]);

  return weather ? (
    <>
      <View style={styles.container}>
        <PixelifyText style={styles.city}>{weather.name}</PixelifyText>
        <PixelifyText style={styles.temperature}>
          {weather.main.temp}°C
        </PixelifyText>
        <PixelifyText style={styles.description}>
          {weather.weather[0].description}
        </PixelifyText>

        {/* Additional Weather Details */}
        <View style={styles.detailsContainer}>
          <View style={styles.detail}>
            <PixelifyText>Humidity: {weather.main.humidity}%</PixelifyText>
          </View>
          <View style={styles.detail}>
            <PixelifyText>Pressure: {weather.main.pressure} hPa</PixelifyText>
          </View>
        </View>
      </View>
    </>
  ) : (
    <View style={styles.container}>
      <ActivityIndicator
        size="large"
        color={theme == "light" ? "black" : "white"}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  city: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  temperature: {
    fontSize: 90,
    fontWeight: "bold",
    marginBottom: 10,
  },
  description: {
    fontSize: 18,
    marginBottom: 20,
  },
  detailsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  detail: {
    alignItems: "center",
  },
});

export default Weather;
