import {
  WiDayCloudy,
  WiDaySunny,
  WiDayFog,
  WiDayRain,
  WiDaySleet,
  WiDaySnow,
  WiDayShowers,
  WiDayThunderstorm,
  WiDayHail
} from "react-icons/wi";
import { IconType } from "react-icons";

type WeatherConditionAndIcon = {
  weatherIcon: IconType;
  weatherCondition: string;
};

const interpretWeatherCode = (weatherCode: number): WeatherConditionAndIcon => {
  if (weatherCode === 0) {
    return { weatherCondition: "Clear sky", weatherIcon: WiDaySunny };
  } else if (weatherCode === 1 || weatherCode === 2 || weatherCode === 3) {
    return {
      weatherCondition: "Mainly clear, partly cloudy, and overcast",
      weatherIcon: WiDayCloudy
    };
  } else if (weatherCode === 45 || weatherCode === 48) {
    return {
      weatherCondition: "Fog and depositing rime fog",
      weatherIcon: WiDayFog
    };
  } else if (weatherCode === 51 || weatherCode === 53 || weatherCode === 55) {
    return {
      weatherCondition: "Drizzle: Light, moderate, and dense intensity",
      weatherIcon: WiDayRain
    };
  } else if (weatherCode === 56 || weatherCode === 57) {
    return {
      weatherCondition: "Freezing Drizzle: Light and dense intensity",
      weatherIcon: WiDaySleet
    };
  } else if (weatherCode === 61 || weatherCode === 63 || weatherCode === 65) {
    return {
      weatherCondition: "Rain: Slight, moderate and heavy intensity",
      weatherIcon: WiDayRain
    };
  } else if (weatherCode === 66 || weatherCode === 67) {
    return {
      weatherCondition: "Freezing Rain: Light and heavy intensity",
      weatherIcon: WiDaySleet
    };
  } else if (weatherCode === 71 || weatherCode === 73 || weatherCode === 75) {
    return {
      weatherCondition: "Snow fall: Slight, moderate, and heavy intensity",
      weatherIcon: WiDaySnow
    };
  } else if (weatherCode === 77) {
    return { weatherCondition: "Snow grains", weatherIcon: WiDaySnow };
  } else if (weatherCode === 80 || weatherCode === 81 || weatherCode === 82) {
    return {
      weatherCondition: "Rain showers: Slight, moderate, and violent",
      weatherIcon: WiDayShowers
    };
  } else if (weatherCode === 85 || weatherCode === 86) {
    return {
      weatherCondition: "Snow showers slight and heavy",
      weatherIcon: WiDayShowers
    };
  } else if (weatherCode === 95) {
    return {
      weatherCondition: "Thunderstorm: Slight or moderate",
      weatherIcon: WiDayThunderstorm
    };
  } else if (weatherCode === 96 || weatherCode === 99) {
    return {
      weatherCondition: "Thunderstorm with slight and heavy hail",
      weatherIcon: WiDayHail
    };
  } else {
    return {
      weatherCondition: "Unknown weather code",
      weatherIcon: WiDaySunny
    };
  }
};

export default interpretWeatherCode;
