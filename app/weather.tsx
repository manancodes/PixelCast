// Weather.tsx

import React, { useState, useEffect } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import {
  LocationObject,
  requestForegroundPermissionsAsync,
  getCurrentPositionAsync,
} from "expo-location";
import get from "lodash/get";

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
              {get(weather, "weather[0].main", "Check Outside")}
            </PixelifyText>
          </View>
          <View style={styles.centerContainer}>
            <WeatherIcon
              condition={get(weather, "weather[0].main", "Check Outside")}
            />
          </View>
          <View style={styles.detailsContainer}>
            <Text style={styles.city}>{get(weather, "name", "Las Vegas")}</Text>
            <PixelifyText style={styles.temperature}>
              {get(weather, "main.temp", "20")}°C
            </PixelifyText>
            <Text style={styles.city}>
              Feels like {get(weather, "main.feels_like", "20")}°C
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
