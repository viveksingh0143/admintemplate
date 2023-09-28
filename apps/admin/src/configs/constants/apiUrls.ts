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
    PALLET_NEED_APPROVALS_API: "/master/containers/need-approvals",
    JOB_ORDER_API: "/master/joborders",
    REQUISITION_API: "/master/requisitions",
    REQUISITION_NEED_APPROVALS_API: "/master/requisitions/need-approvals",
    OUTWARD_REQUEST_API: "/master/outwardrequests",
    
  },
  WAREHOUSE: {
    BATCH_LABEL_API: "/warehouse/batchlabels",
    LABEL_STICKER_API: "/warehouse/labelstickers",
    INVENTORY_API: "/warehouse/inventories",

    STOCK_API: "/warehouse/stocks",
    PACKAGING_LABEL_API: "/warehouse/packaging-labels",
    
    INVENTORY_FINISHED_GOODS_API: "/warehouse/inventories/finished-goods",
    INVENTORY_RAW_MATERIAL_API: "/warehouse/inventories/raw-material",
  },
} as const;

