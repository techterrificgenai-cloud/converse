
'use client';

import { useState, useEffect } from 'react';

// A custom hook to synchronize state with localStorage.
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  // This function gets the stored value from localStorage, or returns the initial value.
  // It's wrapped in a function to ensure it only runs on the client-side.
  const getStoredValue = () => {
    // Check if we are on the server first. If so, return initial value.
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error reading from localStorage', error);
      return initialValue;
    }
  };

  const [storedValue, setStoredValue] = useState<T>(initialValue);

  // This effect runs once on mount on the client side to get the initial value
  // from localStorage.
  useEffect(() => {
    setStoredValue(getStoredValue());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error('Error writing to localStorage', error);
    }
  };

  return [storedValue, setValue];
}
