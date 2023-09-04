import { useNotification } from '@hooks/notificationContext';
import React, { useEffect, useRef } from 'react';
import { Notification, NotificationHandles } from './notification';

const GlobalNotification: React.FC = () => {
  const { message, type } = useNotification();
  const notificationRef = useRef<NotificationHandles>(null);

  useEffect(() => {
    if (notificationRef.current && message && message !== "") {
      notificationRef.current.showNotification(message, type);
    }
  }, [message, type])

  return (
    <>
      <Notification ref={notificationRef} type={type} fixed={true} className='p-4' />
    </>
  );
};

export default GlobalNotification;
