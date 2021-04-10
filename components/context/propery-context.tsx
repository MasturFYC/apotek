import { iCategory, iProduct, iSupplier, iWarehouse } from 'components/interfaces';
import React from 'react'
export type PropertyContextType = {
  products?: iProduct[];
  categories: iCategory[];
  suppliers: iSupplier[];
  warehouses: iWarehouse[];
  updateValue?: (data: iProduct, method: string) => void
}
const PropertyContext = React.createContext<PropertyContextType>({
  products: [], categories: [], suppliers: [], warehouses: []
})
export const PropertyProvider = PropertyContext.Provider;
export default PropertyContext;
