import { iCategory, iProduct, iSupplier, iWarehouse } from 'components/interfaces';
import React from 'react'
export type PropertyContextType = {
  products: iProduct[] | undefined;
  categories: iCategory[];
  suppliers: iSupplier[];
  warehouses: iWarehouse[];
}
const   PropertyContext = React.createContext<PropertyContextType>({
  products: [], categories: [], suppliers: [], warehouses: []
})
export const PropertyProvider = PropertyContext.Provider;
export default PropertyContext;