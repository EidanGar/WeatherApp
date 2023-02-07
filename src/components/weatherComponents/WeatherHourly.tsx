import React, { useState } from "react";
import { parseTemperature } from "./WeatherCurrent";
import useWindowWidth from "./useWindowWidth";

type HourWeatherData = {
  weatherIcon: any;
  hour: string;
  temperature: number;
  relativehumidity_2m: string;
  windspeed_10m: string;
  precipitation: string;
}[];

enum WeatherParameter {
  TEMPERATURE = "TEMPERATURE",
  HUMIDITY = "HUMIDITY",
  WINDSPEED = "WINDSPEED"
}

const WeatherHourly = ({
  hourWeatherData,
  isFahrenheit
}: {
  hourWeatherData: HourWeatherData;
  isFahrenheit: boolean;
}) => {
  const [weatherParameter, setWeatherParameter] = useState<WeatherParameter>(
    WeatherParameter.TEMPERATURE
  );
  const windowWidth = useWindowWidth();
  const HourlyWeatherCard = ({
    temperature,
    hour,
    relativehumidity_2m,
    windspeed_10m,
    precipitation
  }) => {
    const temp = parseTemperature(temperature, isFahrenheit);
    const displayParameter: number =
      weatherParameter === WeatherParameter.TEMPERATURE
        ? temp
        : weatherParameter === WeatherParameter.HUMIDITY
        ? +relativehumidity_2m.slice(0, -1)
        : windspeed_10m.match(/\d+/)[0];
    const getMetric = () => {
      let parameterMetric;

      if (weatherParameter === WeatherParameter.TEMPERATURE) {
        parameterMetric = isFahrenheit ? "F°" : "C°";
      } else if (weatherParameter === WeatherParameter.WINDSPEED) {
        parameterMetric = "mp/h";
      } else {
        parameterMetric = "mm";
      }

      return parameterMetric;
    };
    return (
      <div className="weather-hourly-card">
        <span className="weather-hourly-param-value">
          {displayParameter + getMetric()}
        </span>
        <div
          className="weather-hourly-param"
          style={{
            height:
              (isFahrenheit === false &&
              weatherParameter === WeatherParameter.TEMPERATURE
                ? (displayParameter * 9) / 5 + 32
                : displayParameter) *
                (weatherParameter === WeatherParameter.HUMIDITY
                  ? 0.06
                  : weatherParameter === WeatherParameter.WINDSPEED
                  ? 0.18
                  : 0.07) +
              "rem"
          }}
        ></div>
        <span className="weather-hourly-card-hour">{hour}</span>
      </div>
    );
  };

  console.log("windowWidth:", Math.round((1200 - windowWidth / 2) / 200));

  return (
    <div className="weather-hourly">
      <div className="weather-hourly-control">
        <span
          onClick={() => setWeatherParameter(WeatherParameter.TEMPERATURE)}
          className={`weather-hourly-control-parameter ${
            weatherParameter === WeatherParameter.TEMPERATURE &&
            "selected-parameter"
          }`}
        >
          Temperature
        </span>
        <span
          onClick={() => setWeatherParameter(WeatherParameter.HUMIDITY)}
          className={`weather-hourly-control-parameter ${
            weatherParameter === WeatherParameter.HUMIDITY &&
            "selected-parameter"
          }`}
        >
          Humidity
        </span>
        <span
          onClick={() => setWeatherParameter(WeatherParameter.WINDSPEED)}
          className={`weather-hourly-control-parameter ${
            weatherParameter === WeatherParameter.WINDSPEED &&
            "selected-parameter"
          }`}
        >
          Wind
        </span>
      </div>
      <div
        className="hour-elements"
        style={{
          gridTemplateColumns: `repeat(${
            hourWeatherData.filter(
              (hour, i) => i % Math.round((1200 - windowWidth / 2) / 200) === 0
            ).length
          }, 1fr)`
        }}
      >
        {hourWeatherData
          .filter(
            (hour, i) => i % Math.round((1200 - windowWidth / 2) / 200) === 0
          )
          .map((hour) => (
            <HourlyWeatherCard {...hour} />
          ))}
      </div>
    </div>
  );
};

export default WeatherHourly;
