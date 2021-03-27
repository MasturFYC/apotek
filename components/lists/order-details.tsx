import React, { useContext, useState } from 'react';
import { iOrderDetail } from 'components/interfaces';
import OrderContext, { OrderContextType } from 'components/context/order-context';

export const OrderDetailList = () => {
  const ctx: OrderContextType = useContext(OrderContext);

  if (ctx.order && ctx.order.details && ctx.order.details.length) {

    return (
      <React.Fragment>
        {ctx.order.details.map((d: iOrderDetail, i: number) => {
          return <div key={`d-key-${i}`}>{d.barcode}</div>
        })}
      </React.Fragment>
    )
  }
  
  return  <div className={'fs-4 fw-bold text-danger mt-3'}>Tidak ada details dari order ini...</div>
  
}