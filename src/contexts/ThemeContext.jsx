import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

// eslint-disable-next-line react/prop-types
export function ThemeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // 다크 모드 상태가 바뀔 때마다 바디에 적용함
  useEffect(() => {
    document.body.setAttribute("data-theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  return (
    <ThemeContext.Provider value={{ isDarkMode, setIsDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useThemeContext = () => useContext(ThemeContext);
