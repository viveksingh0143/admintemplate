export const API_URLS = {
  USER_API: "/admin/users",
  ROLE_API: "/admin/roles",
  LOGIN_API: "/auth/login",
  REFRESH_API: "auth/refresh-token",
  MASTER: {
    PRODUCT_API: "/master/products",
    MACHINE_API: "/master/machines",
    CUSTOMER_API: "/master/customers",
    STORE_API: "/master/stores",
    CONTAINER_API: "/master/containers",
  },
  WAREHOUSE: {
    BATCH_LABEL_API: "/warehouse/batchlabels",
    LABEL_STICKER_API: "/warehouse/labelstickers",

    INVENTORY_API: "/warehouse/inventories",
    PACKAGING_LABEL_API: "/warehouse/packaging-labels",
    
    INVENTORY_FINISHED_GOODS_API: "/warehouse/inventories/finished-goods",
    INVENTORY_RAW_MATERIAL_API: "/warehouse/inventories/raw-material",
  },
} as const;

