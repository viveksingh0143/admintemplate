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
import ProductFormPage from '@pages/secure/products/productFormPage';
import InventoryListPage from '@pages/secure/warehouse/inventories/inventoryListPage';
import NotFoundPage from '@pages/secure/notFoundPage';
import ProductDetailPage from '@pages/secure/products/productDetailPage';
import { NotificationProvider } from '@hooks/notificationContext';
import GlobalNotification from '@components/ui/globalNotification';
import ContainerListPage from '@pages/secure/warehouse/containers/containerListPage';
import ContainerFormPage from '@pages/secure/warehouse/containers/containerFormPage';
import ContainerDetailPage from '@pages/secure/warehouse/containers/containerDetailPage';
import StoreListPage from '@pages/secure/warehouse/stores/storeListPage';
import StoreFormPage from '@pages/secure/warehouse/stores/storeFormPage';
import StoreDetailPage from '@pages/secure/warehouse/stores/storeDetailPage';
import StockinRawMaterialPage from '@pages/secure/warehouse/inventories/stockinRawMaterialPage';
import StockinFinishedGoodsPage from '@pages/secure/warehouse/inventories/stockinFinishedGoodsPage';
import BatchListPage from '@pages/secure/warehouse/batches/batchListPage';
import BatchFormPage from '@pages/secure/warehouse/batches/batchFormPage';
import MachineListPage from '@pages/secure/machines/machineListPage';
import MachineFormPage from '@pages/secure/machines/machineFormPage';
import MachineDetailPage from '@pages/secure/machines/machineDetailPage';
import CustomerListPage from '@pages/secure/customers/customerListPage';
import CustomerDetailPage from '@pages/secure/customers/customerDetailPage';
import CustomerFormPage from '@pages/secure/customers/customerFormPage';


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
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ]
  },
  {
    path: "/",
    element: <PrimeLayout />,
    children: [
      {
        index: true,
        element: <Navigate to='/auth/login' />,
      },
      {
        path: "secure",children: [
          {
            index: true,
            element: <Navigate to='/secure/dashboard' />,
          },
          {
            path: "dashboard",
            element: <HomePage />,
          },
          {
            path: "products",
            children: [
              {
                index: true,
                element: <ProductListPage />,
              },
              {
                path: "create",
                element: <ProductFormPage />
              },
              {
                path: ":id",
                element: <ProductDetailPage />
              },
              {
                path: ":id/edit",
                element: <ProductFormPage />
              }
            ]
          },
          {
            path: "machines",
            children: [
              {
                index: true,
                element: <MachineListPage />,
              },
              {
                path: "create",
                element: <MachineFormPage />
              },
              {
                path: ":id",
                element: <MachineDetailPage />
              },
              {
                path: ":id/edit",
                element: <MachineFormPage />
              }
            ]
          },
          {
            path: "customers",
            children: [
              {
                index: true,
                element: <CustomerListPage />,
              },
              {
                path: "create",
                element: <CustomerFormPage />
              },
              {
                path: ":id",
                element: <CustomerDetailPage />
              },
              {
                path: ":id/edit",
                element: <CustomerFormPage />
              }
            ]
          },
          {
            path: "warehouse",
            children: [
              {
                path: "batches",
                children: [
                  {
                    index: true,
                    element: <BatchListPage />,
                  },
                  {
                    path: "create",
                    element: <BatchFormPage />
                  },
                  {
                    path: ":id",
                    element: <ContainerDetailPage />
                  },
                  {
                    path: ":id/edit",
                    element: <BatchFormPage />
                  }
                ]
              },
              {
                path: "containers",
                children: [
                  {
                    index: true,
                    element: <ContainerListPage />,
                  },
                  {
                    path: "create",
                    element: <ContainerFormPage />
                  },
                  {
                    path: ":id",
                    element: <ContainerDetailPage />
                  },
                  {
                    path: ":id/edit",
                    element: <ContainerFormPage />
                  }
                ]
              },
              {
                path: "stores",
                children: [
                  {
                    index: true,
                    element: <StoreListPage />,
                  },
                  {
                    path: "create",
                    element: <StoreFormPage />
                  },
                  {
                    path: ":id",
                    element: <StoreDetailPage />
                  },
                  {
                    path: ":id/edit",
                    element: <StoreFormPage />
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
                    path: "stockin-raw-material",
                    element: <StockinRawMaterialPage />
                  },
                  {
                    path: "stockin-finished-goods",
                    element: <StockinFinishedGoodsPage />
                  },
                ]
              },
            ]
          },
        ],
      },
      {
        path: "*",
        element: <NotFoundPage />
      },
    ]
  }
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
      <NotificationProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeContextProvider>
            <RouterProvider router={router} />
          </ThemeContextProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
        <GlobalNotification />
      </NotificationProvider>
    </React.StrictMode>
  );
};

export default App;

