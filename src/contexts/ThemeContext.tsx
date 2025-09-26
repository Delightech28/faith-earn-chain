import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark' ? 'dark' : 'light';
  });

  // On login, try to load theme from Firestore
  useEffect(() => {
    const loadUserTheme = async () => {
      if (auth.currentUser) {
        const userDoc = doc(db, "users", auth.currentUser.uid);
        const userSnap = await getDoc(userDoc);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          if (userData.theme && (userData.theme === 'dark' || userData.theme === 'light')) {
            setTheme(userData.theme);
            return;
          }
        }
      }
      // fallback to localStorage already handled by initial state
    };
    loadUserTheme();
    // Only run on login
    // eslint-disable-next-line
  }, [auth.currentUser]);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};