import { decryptData, encryptData } from '@lib/cryptography';
import { useState, useEffect, Dispatch, SetStateAction } from 'react';


export function useLocalStorageState<T>(key: string, initialValue: T, secretKey: string | undefined = undefined): [T, Dispatch<SetStateAction<T>>] {
  const needEncryption = secretKey !== undefined && secretKey !== null && secretKey !== "";

  // Retrieve the initial value from localStorage or use the provided initialValue
  const getInitialValue = (): T => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? decryptValue(item): initialValue;
    } catch (error) {
      console.warn("An error occurred while getting initial value from localStorage:", error);
      return initialValue;
    }
  };

  const decryptValue = <T>(data: string): T => {
    if (needEncryption) {
      return decryptData(data, secretKey);
    } else {
      return JSON.parse(data);
    }
  };
  
  const encryptValue = <T>(data: T): string => {
    if (needEncryption) {
      return encryptData(data, secretKey);
    } else {
      return JSON.stringify(data);
    }
  };

  // Use useState with the retrieved initial value
  const [state, setState] = useState<T>(getInitialValue);

  // Use useEffect to update localStorage whenever state changes
  useEffect(() => {
    try {
      window.localStorage.setItem(key, encryptValue(state));
    } catch (error) {
      console.warn("An error occurred while setting value to localStorage:", error);
    }
  }, [key, state, secretKey]);

  return [state, setState];
}
