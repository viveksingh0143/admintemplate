import PrimeLayout from '@layouts/primelayout';
import './main.css';
import * as React from "react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import ThemeContextProvider from '@hooks/themeContext';
import AuthLayout from '@layouts/authlayout';
import LoginPage from '@pages/auth/loginPage';
import RegisterPage from '@pages/auth/registerPage';
import HomePage from '@pages/secure/homePage';
import ProductListPage from '@pages/secure/products/productListPage';
import ProductCreatePage from '@pages/secure/products/productCreatePage';
import ContainerListPage from '@pages/secure/warehouse/containers/containerListPage';
import ContainerCreatePage from '@pages/secure/warehouse/containers/containerCreatePage';
import InventoryListPage from '@pages/secure/warehouse/inventories/inventoryListPage';


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
    path: "/",
    element: <PrimeLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "/secure/products",
        element: <ProductListPage />
      },
      {
        path: "/secure/products/create",
        element: <ProductCreatePage />
      },
      {
        path: "/secure/warehouse",
        children: [
          {
            path: "containers",
            children: [
              {
                index: true,
                element: <ContainerListPage />,
              },
              {
                path: "create",
                element: <ContainerCreatePage />
              }
            ]
          },
          {
            path: "inventories",
            children: [
              {
                index: true,
                element: <InventoryListPage />,
              },
              {
                path: "create",
                element: <ContainerCreatePage />
              }
            ]
          },
        ]
      },
    ]
  },
  {
    path: "/*",
    element: <Navigate to='/auth/login' />,
  },
]);
const queryClient = new QueryClient();
queryClient.getQueryCache().subscribe((event) => {
  if (event?.type === "observerResultsUpdated") {
    event.query?.invalidate();
  }
});

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

