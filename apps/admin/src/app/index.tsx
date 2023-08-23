import PrimeLayout from '@layouts/primelayout';
import './main.css';
import * as React from "react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import ThemeContextProvider from '@hooks/themeContext';
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
  {
    path: "/",
    element: <PrimeLayout />,
    children: [
      {
        index: true,
        element: <SamplePage />,
      },
    ]
  },
]);
const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <ThemeContextProvider>
          <RouterProvider router={router} />
        </ThemeContextProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;

