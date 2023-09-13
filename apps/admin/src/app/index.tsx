import './main.css';
import * as React from "react";
import PrimeLayout from '@layouts/primelayout';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import ThemeContextProvider from '@hooks/themeContext';
import AuthLayout from '@layouts/authlayout';
import LoginPage from '@pages/auth/loginPage';
import RegisterPage from '@pages/auth/registerPage';
import HomePage from '@pages/secure/homePage';
import InventoryListPage from '@pages/secure/warehouse/inventories/inventoryListPage';
import NotFoundPage from '@pages/secure/notFoundPage';
import { NotificationProvider } from '@hooks/notificationContext';
import GlobalNotification from '@components/ui/globalNotification';
import StoreListPage from '@pages/secure/master/stores/storeListPage';
import StoreFormPage from '@pages/secure/master/stores/storeFormPage';
import StoreDetailPage from '@pages/secure/master/stores/storeDetailPage';
import StockinRawMaterialPage from '@pages/secure/warehouse/inventories/stockinRawMaterialPage';
import StockinFinishedGoodsPage from '@pages/secure/warehouse/inventories/stockinFinishedGoodsPage';
import BatchListPage from '@pages/secure/warehouse/batchlabels/batchlabelListPage';
import BatchFormPage from '@pages/secure/warehouse/batchlabels/batchlabelFormPage';
import MachineListPage from '@pages/secure/master/machines/machineListPage';
import MachineFormPage from '@pages/secure/master/machines/machineFormPage';
import MachineDetailPage from '@pages/secure/master/machines/machineDetailPage';
import CustomerListPage from '@pages/secure/master/customers/customerListPage';
import CustomerDetailPage from '@pages/secure/master/customers/customerDetailPage';
import CustomerFormPage from '@pages/secure/master/customers/customerFormPage';
import BatchDetailPage from '@pages/secure/warehouse/batchlabels/batchlabelDetailPage';
import UserListPage from '@pages/admin/users/userListPage';
import UserFormPage from '@pages/admin/users/userFormPage';
import RoleListPage from '@pages/admin/roles/roleListPage';
import RoleFormPage from '@pages/admin/roles/roleFormPage';
import RoleDetailPage from '@pages/admin/roles/roleDetailPage';
import UserDetailPage from '@pages/admin/users/userDetailPage';
import ContainerListPage from '@pages/secure/master/containers/containerListPage';
import ContainerFormPage from '@pages/secure/master/containers/containerFormPage';
import ContainerDetailPage from '@pages/secure/master/containers/containerDetailPage';
import ProductListPage from '@pages/secure/master/products/productListPage';
import ProductFormPage from '@pages/secure/master/products/productFormPage';
import ProductDetailPage from '@pages/secure/master/products/productDetailPage';
import LabelStickerListPage from '@pages/secure/warehouse/labelstickers/labelstickerListPage';
import LabelStickerDetailPage from '@pages/secure/warehouse/labelstickers/labelstickerDetailPage';
import StockListPage from '@pages/secure/warehouse/stocks/stockListPage';


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
        element: <Navigate to='/secure/dashboard' />,
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
            path: "admin",
            children: [
              {
                path: "users",
                children: [
                  {
                    index: true,
                    element: <UserListPage />,
                  },
                  {
                    path: "create",
                    element: <UserFormPage />
                  },
                  {
                    path: ":id",
                    element: <UserDetailPage />
                  },
                  {
                    path: ":id/edit",
                    element: <UserFormPage />
                  }
                ]
              },
              {
                path: "roles",
                children: [
                  {
                    index: true,
                    element: <RoleListPage />,
                  },
                  {
                    path: "create",
                    element: <RoleFormPage />
                  },
                  {
                    path: ":id",
                    element: <RoleDetailPage />
                  },
                  {
                    path: ":id/edit",
                    element: <RoleFormPage />
                  }
                ]
              }
            ]
          },
          {
            path: "master",
            children: [
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
              }
            ]
          },
          {
            path: "warehouse",
            children: [
              {
                path: "batchlabels",
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
                    element: <BatchDetailPage />
                  },
                  {
                    path: ":id/edit",
                    element: <BatchFormPage />
                  }
                ]
              },
              {
                path: "labelstickers",
                children: [
                  {
                    index: true,
                    element: <LabelStickerListPage />,
                  },
                  {
                    path: ":id",
                    element: <LabelStickerDetailPage />
                  },
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
                  {
                    path: ":id/stocks",
                    children: [
                      {
                        index: true,
                        element: <StockListPage />,
                      },
                    ]
                  }
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
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});
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

