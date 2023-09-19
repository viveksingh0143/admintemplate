import { CommonVariant } from '@ctypes/common';
import React, { createContext, useContext, useState } from 'react';

type NotificationContextType = {
  message: string;
  type: CommonVariant;
  setShowNotification: (message: string, type: CommonVariant) => Promise<void>;
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [message, setMessage] = useState('');
  const [type, setType] = useState<CommonVariant>('info');

  const setShowNotification = (message: string, type: CommonVariant) => {
    return new Promise<void>((resolve, reject) => {
      try {
        if (message) setMessage(message);
        if (type) setType(type);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  };

  return (
    <NotificationContext.Provider value={{ message, type, setShowNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};
