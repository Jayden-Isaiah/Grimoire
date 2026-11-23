import { createContext, useContext, useState } from 'react';
import colorsPalette from '../assets/colorsPalette';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [nomTheme, setNomTheme] = useState('parchemin');

  const changerTheme = async (nouveauTheme) => {
    if (!colorsPalette[nouveauTheme]) {
      return;
    }
    setNomTheme(nouveauTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme: colorsPalette[nomTheme], nomTheme, changerTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
