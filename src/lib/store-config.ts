export const storeConfig = {
  pricesIncludeTax: process.env.PRICES_INCLUDE_TAX === "true"
} as const;
