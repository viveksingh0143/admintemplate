import { decryptData, encryptData } from '@lib/cryptography';
import { useState, useEffect, Dispatch, SetStateAction } from 'react';


export function useEncryptedState<T>(key: string, initialValue: T, secretKey: string): [T, Dispatch<SetStateAction<T>>] {
  // Retrieve the initial value from localStorage or use the provided initialValue
  const getInitialValue = (): T => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? decryptData(item, secretKey) : initialValue;
    } catch (error) {
      console.warn("An error occurred while getting initial value from localStorage:", error);
      return initialValue;
    }
  };

  // Use useState with the retrieved initial value
  const [state, setState] = useState<T>(getInitialValue);

  // Use useEffect to update localStorage whenever state changes
  useEffect(() => {
    try {
      window.localStorage.setItem(key, encryptData(state, secretKey));
    } catch (error) {
      console.warn("An error occurred while setting value to localStorage:", error);
    }
  }, [key, state, secretKey]);

  return [state, setState];
}
