import React from "react";
import { parseTemperature } from "./WeatherCurrent";
import { IconType } from "react-icons";

type WeekWeatherData = {
  weatherIconAndCondition: { weatherCondition: string; weatherIcon: IconType };
  weekday: string;
  temperature: [string, string];
}[];

interface WeatherDailyProps {
  weekWeatherData: WeekWeatherData;
  isFahrenheit: boolean;
  setWeekday: React.Dispatch<React.SetStateAction<number>>;
  weekday: number;
}

const WeatherDaily = ({
  weekWeatherData,
  isFahrenheit,
  setWeekday,
  weekday: selectedWeekday
}: WeatherDailyProps) => {
  interface WeatherDayCardProps {
    weatherIconAndCondition: {
      weatherCondition: string;
      weatherIcon: IconType;
    };
    weekday: string;
    temperature: [string, string];
    idx: number;
  }

  console.log("weekWeatherData:", weekWeatherData);

  const WeatherDayCard = ({
    weatherIconAndCondition,
    weekday,
    temperature,
    idx
  }: WeatherDayCardProps) => {
    const [minTemp, maxTemp] = temperature.map((a) => +a.slice(0, -1));

    return (
      <div
        onClick={() => setWeekday(idx)}
        className={`weather-daily-card ${
          idx === selectedWeekday ? "checked-daily" : ""
        }`}
      >
        <span className="weather-daily-card-day">{weekday}</span>
        <weatherIconAndCondition.weatherIcon className="weather-daily-card-icon" />
        <div className="weather-daily-card-temp">
          <span className="weather-daily-card-temp-max">{`${parseTemperature(
            maxTemp,
            isFahrenheit
          )}°`}</span>
          <span className="weather-daily-card-temp-min">{`${parseTemperature(
            minTemp,
            isFahrenheit
          )}°`}</span>
        </div>
      </div>
    );
  };
  return (
    <div className="weather-daily">
      {weekWeatherData.map((day, idx) => (
        <WeatherDayCard key={idx} {...{ ...day, idx }} />
      ))}
    </div>
  );
};

export default WeatherDaily;
