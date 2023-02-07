import React from "react";
import { IconType } from "react-icons";

type WeatherCurrentProps = {
  temperature: number;
  precipitation: string;
  humidity: string;
  windspeed: string;
  location: string;
  weekdayAndTime: { numericWeekday: number; longWeekday: string; hour: string };
  iconAndCondition: { weatherCondition: string; weatherIcon: IconType };
  isFahrenheit: boolean;
  setIsFahrenheit: React.Dispatch<React.SetStateAction<boolean>>;
};

export const parseTemperature = (
  temperature: number,
  isFahrenheit: boolean
) => {
  const celsius = (temperature - 32) * (5 / 9);
  return Math.round(isFahrenheit ? temperature : celsius);
};

const WeatherCurrent = ({
  temperature,
  precipitation,
  humidity,
  windspeed,
  location,
  weekdayAndTime,
  iconAndCondition,
  isFahrenheit,
  setIsFahrenheit
}: WeatherCurrentProps) => {
  const SetTempMeasurement = () => {
    return (
      <div className="weather-current-temperature-measurement">
        <span
          className="weather-current-temperature-measurement-f"
          onClick={() => setIsFahrenheit(true)}
          style={{
            color: isFahrenheit ? "black" : "gray",
            cursor: isFahrenheit ? "unset" : "pointer"
          }}
        >
          F°
        </span>
        <span
          className="weather-current-temperature-measurement-c"
          onClick={() => setIsFahrenheit(false)}
          style={{
            color: isFahrenheit ? "gray" : "black",
            cursor: isFahrenheit ? "pointer" : "unset"
          }}
        >
          C°
        </span>
      </div>
    );
  };

  return (
    <div className="weather-current">
      <div className="weather-current-temperature">
        <iconAndCondition.weatherIcon className="weather-current-icon" />
        <span className="weather-current-temperature-temp">
          {parseTemperature(temperature, isFahrenheit)}
        </span>
        <SetTempMeasurement />
      </div>
      <div className="weather-current-extra">
        <span className="weather-current-extra-metric">
          Precipitation: {precipitation}
        </span>
        <span className="weather-current-extra-metric">
          Humidity: {humidity}
        </span>
        <span className="weather-current-extra-metric">Wind: {windspeed}</span>
      </div>
      <div className="weather-current-current">
        <span className="weather-current-current-location">{location}</span>
        <span className="weather-current-current-date">{`${weekdayAndTime?.longWeekday} ${weekdayAndTime?.hour}`}</span>
        <span className="weather-current-current-weather">
          {iconAndCondition?.weatherCondition ?? ""}
        </span>
      </div>
    </div>
  );
};

export default WeatherCurrent;
