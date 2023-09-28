import React, { FC, ReactNode } from 'react';
import { useThemeContext } from '@hooks/themeContext';

interface HasPermissionProps {
  permission?: {
    module?: string,
    name?: string,
  },
  children: ReactNode,
}

const HasPermission: FC<HasPermissionProps> = ({ permission, children }) => {
  const { sessionUser } = useThemeContext();

  const hasPermission = sessionUser?.permissions?.some(
    p => p.module === permission?.module && p.name === permission?.name
  );

  return permission ? (hasPermission ? <>{children}</> : null) : <>{children}</>;
};

export default HasPermission;
