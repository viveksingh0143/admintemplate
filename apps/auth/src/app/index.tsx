import PrimeLayout from '@layouts/primelayout';
import './main.css';
import * as React from "react";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import ThemeContextProvider from '@contexts/themeContext';
import SamplePage from '@pages/sample';
import AuthLayout from '@layouts/authlayout';
import LoginPage from '@pages/auth/loginPage';
import RegisterPage from '@pages/auth/registerPage';


const router = createBrowserRouter([
  {
    path: "/auth/*",
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: <Navigate to='/auth/login' />,
      },
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'register',
        element: <RegisterPage />,
      },
    ]
  },
  {
    path: "/*",
    element: <Navigate to='/auth/login' />,
  },
  // {
  //   path: "/",
  //   element: <PrimeLayout />,
  //   children: [
  //     {
  //       index: true,
  //       element: <SamplePage />,
  //     },
  //   ]
  // },
]);

const App: React.FC = () => {
  return (
    <React.StrictMode>
      <ThemeContextProvider>
        <RouterProvider router={router} />
      </ThemeContextProvider>
    </React.StrictMode>
  );
};

export default App;

