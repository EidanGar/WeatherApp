import React, { useState } from "react";
import "./styles/styles.css";
import useWeather, { UseWeatherReturnData } from "./hooks/useWeather";
import Weather from "./components/Weather";

export type WeatherError = {
  error: boolean;
  reason: string;
};

const App = () => {
  const [weekday, setWeekday] = useState(new Date().getDay());
  const [hasError, setHasError] = useState<WeatherError>({
    error: false,
    reason: ""
  });
  const weatherData: UseWeatherReturnData = useWeather({
    weekday,
    setHasError
  });

  return (
    <div className="app">
      {<Weather {...{ weatherData, setWeekday, weekday }} />}
    </div>
  );
};

export default App;
