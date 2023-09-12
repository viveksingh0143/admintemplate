export const CommonConstant = {
  LOCAL_STORAGE: {
    MY_TOKENS_KEY: "mytkns"
  },
  PAGE_INFO: {
    PAGE_SIZE: 8
  },
  WORK_SHIFTS: [
    { number: "1", start: "09:00:00 AM", end: "05:00:00 PM", time_interval: "1: 09:00 AM - 05:00 PM" },
    { number: "2", start: "05:00:00 PM", end: "01:00:00 AM", time_interval: "2: 05:00 PM - 01:00 AM" },
    { number: "3", start: "01:00:00 AM", end: "09:00:00 AM", time_interval: "3: 01:00 AM - 09:00 AM" },
  ],
  DATE_FORMAT_TEMPLATE: "dd-MM-yyyy hh:mm:ss a",
  COMMON_STATUSES: <{}[]>[{label: 'ENABLE', value: "ENABLE"},{ label: 'DISABLE', value: "DISABLE"}],
  COMMON_PRODUCT_TYPES: <string[]>["RAW Material", "Finished Goods"],
  COMMON_UNITS: <string[]>["Kilogram", "Gram", "Liter", "Milliliter", "Piece"],
  COMMON_WEIGHT_UNITS: <string[]>["Gram", "Kilogram", "Liter", "Milliliter"],
  COMMON_CONTAINER_TYPES: <string[]>['PALLET', 'BIN', 'RACK'],
  PO_CATEGORIES: <{label: string, value: string}[]>[{label: 'Production', value: 'PRODUCTION'}, {label: 'Trails', value: 'TRAILS'}, {label: 'NPD', value: 'NPD'}, {label: 'Samples', value: 'SAMPLES'}],
  UNIT_TYPES: <{label: string, value: string}[]>[{label: 'Grams', value: 'GMs'}, {label: 'Kilogram', value: 'KGs'}],
} as const;

