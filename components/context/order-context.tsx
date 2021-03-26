import { iSalesman, iProduct, iCustomer, iOrderDetail, iOrder } from 'components/interfaces';
import React from 'react'

const initOrder: iOrder = {
  id: 0,
  cash: 0,
  customerId: 0,
  dueDate: new Date().toLocaleDateString(),
  payments: 0,
  remainPayment: 0,
  salesId: 0,
  total: 0,
  createdAt: new Date().toLocaleDateString(),
  status: 0,
  details: []
}

export type OrderContextType = {
  salesmans: iSalesman[];
  customers: iCustomer[];
  order?: iOrder;
  updateValue?: (data: iOrderDetail, method: string) => void
}

const OrderContext = React.createContext<OrderContextType>({
  salesmans: [], customers: []
})

export { initOrder };
export const OrderProvider = OrderContext.Provider;
export default OrderContext;
