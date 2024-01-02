// Weather.tsx

import React, { useState, useEffect } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import {
  LocationObject,
  requestForegroundPermissionsAsync,
  getCurrentPositionAsync,
} from "expo-location";

import { PixelifyText } from "../components/StyledText";
import WeatherIcon from "../components/Weather/WeatherIcon";
import {
  fetchWeatherData,
  fetchForecastData,
  Weather,
  WeatherForecast,
} from "../utils/api";

const WeatherScreen = () => {
  const theme = "light";
  const [location, setLocation] = useState<LocationObject | null>(null);
  const [weather, setWeather] = useState<Weather | null>(null);
  const [forecast, setForecast] = useState<WeatherForecast[] | null>(null);

  const fetchWeather = async () => {
    try {
      if (!location) return;
      const data = await fetchWeatherData(
        location.coords.latitude,
        location.coords.longitude
      );

      setWeather(data);
    } catch (error) {
      console.error("Error fetching weather data", error);
    }
  };

  const fetchForecast = async () => {
    try {
      if (!location) return;
      const data = await fetchForecastData(
        location.coords.latitude,
        location.coords.longitude
      );
      setForecast(data);
    } catch (error) {
      console.error("Error fetching forecast data", error);
    }
  };

  useEffect(() => {
    const getLocation = async () => {
      try {
        let { status } = await requestForegroundPermissionsAsync();
        if (status !== "granted") {
          return;
        }
        let location = await getCurrentPositionAsync({});
        setLocation(location);
      } catch (error) {
        console.error("Error getting location", error);
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

  return (
    <View style={styles.container}>
      {weather ? (
        <>
          <View style={styles.navBar}>
            <PixelifyText style={styles.navText}>
              {weather.weather[0].main}
            </PixelifyText>
          </View>
          <View style={styles.centerContainer}>
            <WeatherIcon condition={weather.weather[0].main} />
          </View>
          <View style={styles.detailsContainer}>
            <Text style={styles.city}>{weather.name}</Text>
            <PixelifyText style={styles.temperature}>
              {weather.main.temp}°C
            </PixelifyText>
            <Text style={styles.city}>
              Feels like {weather.main.feels_like}°C
            </Text>
          </View>
        </>
      ) : (
        <ActivityIndicator
          size="large"
          color={theme == "light" ? "black" : "white"}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
    padding: 30,
    justifyContent: "space-between",
  },
  centerContainer: {
    alignItems: "center",
  },
  navBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  navText: {
    fontSize: 38,
    width: 200,
    fontWeight: "bold",
  },
  city: {
    paddingLeft: 4,
    fontSize: 18,
  },
  temperature: {
    fontSize: 80,
    fontWeight: "bold",
  },
  detailsContainer: {
    width: "100%",
  },
});

export default WeatherScreen;
