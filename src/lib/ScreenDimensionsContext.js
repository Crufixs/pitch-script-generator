"use client";
import React, { createContext, useState, useEffect } from "react";

const ScreenDimensionsContext = createContext();

export const ScreenDimensionsProvider = ({ children }) => {
  const [dimensions, setDimensions] = useState({
    width: null,
    height: null,
  });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    handleResize(); // Set initial dimensions
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <ScreenDimensionsContext.Provider value={dimensions}>
      {children}
    </ScreenDimensionsContext.Provider>
  );
};

export default ScreenDimensionsContext;
