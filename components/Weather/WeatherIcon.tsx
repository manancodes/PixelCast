import React from "react";
import { Image } from "react-native";

interface WeatherIconProps {
  condition: string;
}

const WeatherIcon = ({ condition }: WeatherIconProps) => {
  const icon = condition;
  const hours = new Date().getHours();
  const isDayTime = hours > 6 && hours < 18;

  const weatherImageMapping: any = {
    Clear: isDayTime
      ? require("../../assets/images/Conditions/Clear.png")
      : require("../../assets/images/Conditions/Clear-Night.png"),
    Clouds: require("../../assets/images/Conditions/Clouds.png"),
    Drizzle: require("../../assets/images/Conditions/Drizzle.png"),
    Rain: require("../../assets/images/Conditions/Rain.png"),
    Thunderstorm: require("../../assets/images/Conditions/Thunderstorm.png"),
    Snow: require("../../assets/images/Conditions/Snow.png"),
    Default: require("../../assets/images/Conditions/Atmosphere.png"),
  };

  return (
    <Image
      style={{ width: 300, height: 300 }}
      source={weatherImageMapping[icon] || weatherImageMapping["Default"]}
    />
  );
};

export default WeatherIcon;
