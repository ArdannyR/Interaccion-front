import { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext({});

export function SettingsProvider({ children }) {
  const [tone, setTone] = useState(() => {
    try {
      return localStorage.getItem('appTone') || 'verde';
    } catch { return 'verde'; }
  });

  const [textSize, setTextSize] = useState(() => {
    try {
      return localStorage.getItem('appTextSize') || 'normal';
    } catch { return 'normal'; }
  });

  const [motion, setMotion] = useState(() => {
    try {
      return localStorage.getItem('appMotion') || 'activadas';
    } catch { return 'activadas'; }
  });

  useEffect(() => {
    try {
      localStorage.setItem('appTone', tone);
      document.documentElement.setAttribute('data-tone', tone);
    } catch (err) { console.error('Error saving tone', err); }
  }, [tone]);

  useEffect(() => {
    try {
      localStorage.setItem('appTextSize', textSize);
      document.documentElement.setAttribute('data-text-size', textSize);
    } catch (err) { console.error('Error saving text size', err); }
  }, [textSize]);

  useEffect(() => {
    try {
      localStorage.setItem('appMotion', motion);
      document.documentElement.setAttribute('data-motion', motion);
    } catch (err) { console.error('Error saving motion', err); }
  }, [motion]);

  return (
    <SettingsContext.Provider value={{ tone, setTone, textSize, setTextSize, motion, setMotion }}>
      {children}
    </SettingsContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useSettings = () => useContext(SettingsContext);
