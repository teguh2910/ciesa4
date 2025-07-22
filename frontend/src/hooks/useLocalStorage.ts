import { useState, useEffect } from 'react';

/**
 * Custom hook for localStorage with TypeScript support
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Save state
      setStoredValue(valueToStore);
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}

/**
 * Hook for form data persistence
 */
export function useFormPersistence<T extends Record<string, any>>(
  formId: string,
  initialData: T
) {
  const [formData, setFormData] = useLocalStorage<T>(`form_${formId}`, initialData);

  const updateField = (field: keyof T, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateFields = (fields: Partial<T>) => {
    setFormData(prev => ({
      ...prev,
      ...fields,
    }));
  };

  const resetForm = () => {
    setFormData(initialData);
  };

  const clearForm = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(`form_${formId}`);
    }
    setFormData(initialData);
  };

  return {
    formData,
    setFormData,
    updateField,
    updateFields,
    resetForm,
    clearForm,
  };
}

/**
 * Hook for API configuration persistence
 */
export function useApiConfigPersistence() {
  const initialConfig = {
    endpoint: '',
    api_key: '',
    username: '',
    password: '',
    timeout: 30,
  };

  return useLocalStorage('api_config', initialConfig);
}

/**
 * Hook for user preferences
 */
export function useUserPreferences() {
  const initialPreferences = {
    theme: 'light' as 'light' | 'dark',
    language: 'en' as 'en' | 'id',
    autoSave: true,
    showHelpText: true,
    compactMode: false,
  };

  return useLocalStorage('user_preferences', initialPreferences);
}
