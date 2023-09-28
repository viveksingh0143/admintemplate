import React, { FC } from 'react';
import { useThemeContext } from '@hooks/themeContext';
import { Route, RouteProps, Navigate } from 'react-router-dom';
import { PermissionType } from '@ctypes/contexts/themeContextTypes';

type ProtectedRoutesProps = RouteProps & {
  permissions: PermissionType[]
}

const ProtectedRoutes: FC<ProtectedRoutesProps> = ({ permissions, ...routeProps }) => {
  const { sessionUser } = useThemeContext();

  const isUserLoggedIn = sessionUser.name !== ""

  const userHasRequiredPermission = sessionUser?.permissions?.some(
    permission => permissions?.some(p => p.name === permission.name && p.module === permission.module)
  );

  if (!isUserLoggedIn) {
    return <Navigate to="/auth/login" />;
  } else if (userHasRequiredPermission) {
    return <Route {...routeProps} />;
  } else {
    return <Navigate to='/' />;
  }
};

export default ProtectedRoutes;
