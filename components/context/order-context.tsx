import { iPayment, iOrderDetail, iOrder, iDataList, iPaymentMethod } from 'components/interfaces';
import React from 'react'
//import { responseInterface } from 'swr';
//import { mutateCallback } from 'swr/dist/types';

const initOrder: iOrder = {
  id: 0,
  cash: 0,
  customerId: 0,
  dueDate: new Date().toLocaleDateString(),
  payment: 0,
  remainPayment: 0,
  salesId: 0,
  total: 0,
  userId: 'Mastur',
  createdAt: new Date().toLocaleDateString(),
  status: 0,
  details: []
}

const initPayment: iPayment = {
  id: 0,
  orderId: 0,
  methodId: 0,
  amount: 0,
  createdAt: new Date().toLocaleDateString(),
  updatedAt: new Date().toLocaleDateString(),
  descriptions: '',
  userId: '',
  methodName: ''
}

export type OrderContextType = {
  methods: iPaymentMethod[];
  salesmans: iDataList[];
  customers: iDataList[];
  order?: iOrder;
  updateValue?: (data: iOrderDetail, method: string, callback?: (data: iOrderDetail | null) => void) => void,
  mutate?: Function; // (data?: iOrder | Promise<iOrder> | mutateCallback<iOrder> | undefined, shouldRevalidate?: boolean | undefined) => Promise<iOrder | undefined>
}

const OrderContext = React.createContext<OrderContextType>({
  salesmans: [], customers: [], methods: []
})

OrderContext.displayName = 'order-context';

export { initOrder, initPayment };
export const OrderProvider = OrderContext.Provider;
export default OrderContext;
