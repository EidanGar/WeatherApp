import React, { useState, useEffect } from "react";
import interpretWeatherCode from "../helper/interpretWeatherCode";
import { WeatherError } from "../App";
import { IconType } from "react-icons";

type Coordinates = {
  latitude: number;
  longitude: number;
};

type Hourly<T> = {
  time: T;
  temperature_2m: T;
  relativehumidity_2m: T;
  apparent_temperature: T;
  precipitation: T;
  weathercode: T;
  windspeed_10m: T;
};

type Daily<T> = {
  time: T;
  weathercode: T;
  temperature_2m_max: T;
  temperature_2m_min: T;
  precipitation_sum: T;
  windspeed_10m_max: T;
};

type WeatherData = {
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current_weather: {
    temperature: number;
    windspeed: number;
    winddirection: number;
    weathercode: number;
    time: number;
  };
  hourly_units: Hourly<string>;
  hourly: Hourly<number[]>;
  daily_units: Daily<string>;
  daily: Daily<number[]>;
  location: string;
  weekday?: number;
};

interface WeatherIconAndCondition {
  weatherCondition: string;
  weatherIcon: IconType;
}

type WeekWeatherData = {
  weatherIconAndCondition: WeatherIconAndCondition;
  weekday: string;
  temperature: [string, string];
}[];

export type HourWeatherData = {
  weatherIconAndCondition: WeatherIconAndCondition;
  hour: string;
  temperature: number;
  relativehumidity_2m: string;
  windspeed_10m: string;
  precipitation: string;
}[];

export interface UseWeatherReturnData {
  iconAndCondition: WeatherIconAndCondition;
  humidity: string;
  windspeed: string;
  windDirection: number;
  precipitation: string;
  temperature: number;
  location: string;
  weekdayAndTime: { numericWeekday: number; longWeekday: string; hour: string };
  weekWeatherData: WeekWeatherData;
  hourWeatherData: HourWeatherData;
}

const InitialWeatherDataState: WeatherData = {
  generationtime_ms: 0,
  utc_offset_seconds: 0,
  timezone: "",
  timezone_abbreviation: "",
  elevation: 0,
  current_weather: {
    temperature: 0,
    windspeed: 0,
    winddirection: 0,
    weathercode: 0,
    time: 0
  },
  hourly_units: {
    time: "unixtime",
    temperature_2m: "°F",
    relativehumidity_2m: "%",
    apparent_temperature: "°F",
    precipitation: "inch",
    weathercode: "wmo code",
    windspeed_10m: "mp/h"
  },
  hourly: {
    time: [],
    relativehumidity_2m: [],
    temperature_2m: [],
    apparent_temperature: [],
    precipitation: [],
    weathercode: [],
    windspeed_10m: []
  },
  daily_units: {
    time: "unixtime",
    weathercode: "wmo code",
    temperature_2m_max: "°F",
    temperature_2m_min: "°F",
    precipitation_sum: "inch",
    windspeed_10m_max: "mp/h"
  },
  daily: {
    time: [],
    weathercode: [],
    temperature_2m_max: [],
    temperature_2m_min: [],
    precipitation_sum: [],
    windspeed_10m_max: []
  },
  location: ""
};

interface UseWeatherProps {
  weekday: number;
  setHasError: React.Dispatch<React.SetStateAction<WeatherError>>;
}

const useWeather = ({
  weekday,
  setHasError
}: UseWeatherProps): UseWeatherReturnData => {
  const [coordinates, setCoordinates] = useState<Coordinates>({
    longitude: NaN,
    latitude: NaN
  });
  const [weatherData, setWeatherData] = useState<WeatherData>(
    InitialWeatherDataState
  );

  const fallBackFetch = async () => {
    const ipFetchResponse = await fetch("https://api.ipify.org?format=json");
    if (!ipFetchResponse.ok) throw new Error(ipFetchResponse.statusText);
    const { ip } = await ipFetchResponse.json();

    const locationFetchResponse = await fetch(`https://ipapi.co/${ip}/json/`);
    if (!locationFetchResponse.ok)
      throw new Error(locationFetchResponse.statusText);
    const ipData = await locationFetchResponse.json();
    console.log(ipData);
    const formattedLocation = `${ipData.region}, ${ipData.country}`;
    const { longitude, latitude } = ipData;
    return { longitude, latitude, location: formattedLocation };
  };

  interface SetTimerReturn {
    currentHour: number;
    numericWeekday: number;
    longWeekday: string;
  }

  const getWeatherTime = (weekday: number | undefined): SetTimerReturn => {
    const date = new Date();
    const numericWeekday = weekday ?? date.getDay();
    const currentHour = numericWeekday * 24 + date.getHours();

    const weekdays = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    ];

    const longWeekday = weekdays[numericWeekday];

    return { currentHour, numericWeekday, longWeekday };
  };

  const parseWeatherData = ({
    current_weather,
    hourly_units,
    location,
    hourly,
    daily,
    weekday: chosenWeekday
  }: WeatherData): UseWeatherReturnData => {
    let { temperature, winddirection: windDirection } = current_weather;
    const iconAndCondition: WeatherIconAndCondition = interpretWeatherCode(
      daily.weathercode[chosenWeekday]
    );
    const windspeed =
      daily.windspeed_10m_max[chosenWeekday] + hourly_units.windspeed_10m;
    const { currentHour, numericWeekday, longWeekday } = getWeatherTime(
      chosenWeekday
    );
    const { precipitation: precipitationA, relativehumidity_2m } = hourly;
    const precipitation = `${precipitationA[currentHour] ?? 0}mm`;
    const humidity = `${relativehumidity_2m[currentHour] ?? 0}%`;
    const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const weekWeatherData: WeekWeatherData = weekdays.map((day, idx) => {
      return {
        weatherIconAndCondition: interpretWeatherCode(daily.weathercode[idx]),
        weekday: day,
        temperature: [
          daily.temperature_2m_min[idx] + "°",
          daily.temperature_2m_max[idx] + "°"
        ]
      };
    });
    const {
      precipitation: hourlyPrecipitation,
      windspeed_10m: hourlyWindspeed,
      relativehumidity_2m: hourlyHumidity,
      weathercode,
      temperature_2m
    } = hourly;
    const currentDayHoursCode = weathercode?.slice(numericWeekday * 24) ?? [];
    const currentDayHoursTemp =
      temperature_2m?.slice(numericWeekday * 24) ?? [];
    const currentDayHoursHumidity =
      hourlyHumidity?.slice(numericWeekday * 24) ?? [];
    const currentDayHoursWindspeed =
      hourlyWindspeed?.slice(numericWeekday * 24) ?? [];
    const currentDayHoursPrecipitation =
      hourlyPrecipitation?.slice(numericWeekday * 24) ?? [];
    const hoursInDay = [
      "1:00 am",
      "2:00 am",
      "3:00 am",
      "4:00 am",
      "5:00 am",
      "6:00 am",
      "7:00 am",
      "8:00 am",
      "9:00 am",
      "10:00 am",
      "11:00 am",
      "12:00 pm",
      "1:00 pm",
      "2:00 pm",
      "3:00 pm",
      "4:00 pm",
      "5:00 pm",
      "6:00 pm",
      "7:00 pm",
      "8:00 pm",
      "9:00 pm",
      "10:00 pm",
      "11:00 pm",
      "12:00 am"
    ];

    const hourWeatherData: HourWeatherData = hoursInDay.map((hour, idx) => {
      return {
        weatherIconAndCondition: interpretWeatherCode(
          currentDayHoursCode[idx]
        ) as any,
        temperature: currentDayHoursTemp[idx],
        hour: hour.split(":00").join(""),
        relativehumidity_2m: currentDayHoursHumidity[idx] + "%",
        windspeed_10m:
          Math.round(currentDayHoursWindspeed[idx]) +
          hourly_units.windspeed_10m,
        precipitation: currentDayHoursPrecipitation[idx] + "mm"
      };
    });

    const weekdayAndTime = {
      longWeekday,
      numericWeekday,
      hour: hoursInDay[new Date().getHours() - 1]
    };

    const fallBackTemp =
      (daily.temperature_2m_max[chosenWeekday] +
        daily.temperature_2m_min[chosenWeekday]) /
      2;
    temperature =
      chosenWeekday !== new Date().getDay() ? fallBackTemp : temperature;

    const weatherObj = {
      weekWeatherData,
      windDirection,
      humidity,
      precipitation,
      windspeed,
      iconAndCondition,
      temperature,
      weekdayAndTime,
      location,
      hourWeatherData
    };

    console.log("weatherData:", weatherObj);

    return weatherObj;
  };

  useEffect(() => {
    const getWeatherData = async () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const { latitude, longitude } = position.coords;
          setCoordinates({ latitude, longitude });
        });
      }

      const { latitude, longitude, location } = await fallBackFetch();
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      const API_KEY = `https://api.open-meteo.com/v1/forecast?latitude=${
        coordinates.latitude | latitude
      }&longitude=${
        coordinates.longitude | longitude
      }&hourly=temperature_2m,relativehumidity_2m,apparent_temperature,precipitation,windspeed_10m&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max&current_weather=true&temperature_unit=fahrenheit&windspeed_unit=mph&timeformat=unixtime&timezone=${timezone}`;

      const weatherApiData: WeatherData | WeatherError = await (
        await fetch(API_KEY)
      ).json();

      if ("error" in weatherApiData) {
        setHasError({ error: true, reason: weatherApiData.reason });
      } else {
        weatherApiData.location = location;
        weatherApiData.weekday = weekday;
        console.log(weatherApiData);
        setWeatherData(weatherApiData);
      }
    };
    getWeatherData();
  }, [coordinates.latitude, coordinates.longitude, weekday, setHasError]);

  return parseWeatherData(weatherData);
};

export default useWeather;
