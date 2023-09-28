const PACKING_MATERIAL = "Packing Material";

const RAW_MATERIAL = "RAW Material";
const FINISHED_GOODS = "Finished Goods";
// const SEMI_FINISHED_GOODS = "Semi Finished Goods";
const GRAM = "Gram";
const KILOGRAM = "Kilogram";
const LITER = "Liter";
const MILLILITER = "Milliliter";
const PIECE = "Piece";
// Status
const ENABLE = 'ENABLE';
const DISABLE = 'DISABLE';
// Container
const PALLET = 'PALLET';
const BIN = 'BIN';
const RACK = 'RACK';

export const CommonConstant = {
  LOCAL_STORAGE: {
    MY_TOKENS_KEY: "mytkns"
  },
  PAGE_INFO: {
    PAGE_SIZE: 10
  },
  WORK_SHIFTS: [
    { number: "1", start: "09:00:00 AM", end: "05:00:00 PM", time_interval: "1: 09:00 AM - 05:00 PM" },
    { number: "2", start: "05:00:00 PM", end: "01:00:00 AM", time_interval: "2: 05:00 PM - 01:00 AM" },
    { number: "3", start: "01:00:00 AM", end: "09:00:00 AM", time_interval: "3: 01:00 AM - 09:00 AM" },
  ],
  DATE_FORMAT_TEMPLATE: "dd-MM-yyyy hh:mm:ss a",
  COMMON_STATUSES: <{}[]>[{label: ENABLE, value: ENABLE},{ label: DISABLE, value: DISABLE}],
  PO_CATEGORIES: <{label: string, value: string}[]>[
    {label: 'Production', value: 'PRODUCTION'},
    {label: 'Trails', value: 'TRAILS'},
    {label: 'NPD', value: 'NPD'},
    {label: 'Samples', value: 'SAMPLES'}
  ],
  UNIT: {
    COMMON: <string[]>[KILOGRAM, GRAM, LITER, MILLILITER, PIECE],
    WEIGHT: <string[]>[GRAM, KILOGRAM, LITER, MILLILITER],
  },
  CONTAINER: {
    TYPES: <string[]>[PALLET, BIN, RACK],
    PALLET: PALLET,
    BIN: BIN,
    RACK: RACK,
  },
  PRODUCT: {
    RAW_MATERIAL: RAW_MATERIAL,
    FINISHED_GOODS: FINISHED_GOODS,
    PACKING_MATERIAL: PACKING_MATERIAL,
    TYPES: <string[]>[RAW_MATERIAL, FINISHED_GOODS],
    RAW_MATERIAL_SUBTYPES: <string[]>[RAW_MATERIAL, PACKING_MATERIAL],
    FINISHED_GOODS_SUBTYPES: <string[]>[FINISHED_GOODS],
  }
} as const;

