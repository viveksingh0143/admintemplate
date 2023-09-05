export const API_URLS = {
  LOGIN_API: "/auth/login",
  REFRESH_API: "/refresh-token",
  PRODUCT_API: "/secure/products",
  MACHINE_API: "/secure/machines",
  CUSTOMER_API: "/secure/customers",
  WAREHOUSE: {
    CONTAINER_API: "/secure/warehouse/containers",
    STORE_API: "/secure/warehouse/stores",
    INVENTORY_API: "/secure/warehouse/inventories",
    PACKAGING_LABEL_API: "/secure/warehouse/packaging-labels",
    BATCH_API: "/secure/warehouse/batches",
    INVENTORY_FINISHED_GOODS_API: "/secure/warehouse/inventories/finished-goods",
    INVENTORY_RAW_MATERIAL_API: "/secure/warehouse/inventories/raw-material",
  },
} as const;

