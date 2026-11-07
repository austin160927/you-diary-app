import React, { createContext, useContext, useState, useEffect } from 'react';
import { LIGHT_BOOK_THEME, DARK_BOOK_THEME, ThemeColors } from '../constants/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ThemeContextType {
  isDark: boolean;
  theme: ThemeColors;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('@you_dark_mode').then(val => {
      if (val === 'true') setIsDark(true);
    });
  }, []);

  const toggleTheme = () => {
    setIsDark(prev => {
      const next = !prev;
      AsyncStorage.setItem('@you_dark_mode', next ? 'true' : 'false');
      return next;
    });
  };

  const theme = isDark ? DARK_BOOK_THEME : LIGHT_BOOK_THEME;

  return (
    <ThemeContext.Provider value={{ isDark, theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};
