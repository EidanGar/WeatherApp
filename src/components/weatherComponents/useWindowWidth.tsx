import { useState, useEffect, useCallback } from "react";

const useWindowWidth = (): number => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const handleResize = useCallback(() => {
    setWindowWidth(window.innerWidth);
  }, []);

  useEffect(() => {
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [handleResize]);

  return Number.isNaN(windowWidth) ? window.innerWidth : windowWidth;
};

export default useWindowWidth;
