export const CommonConstant = {
  LOCAL_STORAGE: {
    MY_TOKENS_KEY: "mytkns"
  },
  PAGE_INFO: {
    PAGE_SIZE: 8
  },
  COMMON_STATUSES: <{}[]>[{label: 'ACTIVE', value: 'active'},{ label: 'INACTIVE', value: 'inactive'}],
  PO_CATEGORIES: <{label: string, value: string}[]>[{label: 'Production', value: 'PRODUCTION'}, {label: 'Trails', value: 'TRAILS'}, {label: 'NPD', value: 'NPD'}, {label: 'Samples', value: 'SAMPLES'}],
  UNIT_TYPES: <{label: string, value: string}[]>[{label: 'Grams', value: 'GMs'}, {label: 'Kilogram', value: 'KGs'}],
} as const;

