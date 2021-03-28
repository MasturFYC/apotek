import { iSalesman, iProduct, iCustomer, iOrderDetail, iOrder, iDataList } from 'components/interfaces';
import React from 'react'
import { responseInterface } from 'swr';
import { mutateCallback } from 'swr/dist/types';

const initOrder: iOrder = {
  id: 0,
  cash: 0,
  customerId: 0,
  dueDate: new Date().toLocaleDateString(),
  payment: 0,
  remainPayment: 0,
  salesId: 0,
  total: 0,
  createdAt: new Date().toLocaleDateString(),
  status: 0,
  details: []
}

export type OrderContextType = {
  salesmans: iDataList[];
  customers: iDataList[];
  order?: iOrder;
  updateValue?: (data: iOrderDetail, method: string, callback: (data: iOrderDetail | null) => void) => void
}

const OrderContext = React.createContext<OrderContextType>({
  salesmans: [], customers: []
})

OrderContext.displayName = 'order-context';

export { initOrder };
export const OrderProvider = OrderContext.Provider;
export default OrderContext;
