import React, { useState } from "react";
import { UseWeatherReturnData } from "../hooks/useWeather";

import WeatherCurrent from "./weatherComponents/WeatherCurrent";
import WeatherDaily from "./weatherComponents/WeatherDaily";
import WeatherHourly from "./weatherComponents/WeatherHourly";

interface WeatherProps {
  weatherData: UseWeatherReturnData;
  setWeekday: React.Dispatch<React.SetStateAction<number>>;
  weekday: number;
}

const Weather = ({
  weatherData: {
    temperature,
    weekdayAndTime,
    location,
    windspeed,
    humidity,
    iconAndCondition,
    precipitation,
    weekWeatherData,
    windDirection,
    hourWeatherData
  },
  setWeekday,
  weekday
}: WeatherProps) => {
  const [isFahrenheit, setIsFahrenheit] = useState(true);
  const weatherCurrentProps = {
    temperature,
    precipitation,
    humidity,
    windspeed,
    location,
    weekdayAndTime,
    iconAndCondition,
    isFahrenheit,
    setIsFahrenheit
  };

  return (
    <div className="weather">
      <WeatherCurrent {...weatherCurrentProps} />
      <WeatherHourly {...{ hourWeatherData, isFahrenheit }} />
      <WeatherDaily
        {...{ weekWeatherData, weekday, isFahrenheit, setWeekday }}
      />
    </div>
  );
};

export default Weather;
