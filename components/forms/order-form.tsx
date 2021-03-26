import React, { useContext, useState } from 'react';
import { iOrder } from '../interfaces';
import OrderContext, { initOrder, OrderContextType } from '../context/order-context';

export const OrderForm = () => {
  const ctx: OrderContextType = useContext(OrderContext);
  const [order, setOrder] = useState<iOrder>(initOrder);

  React.useEffect(() => {
    let isLoaded = false;
    const loadOrder = () => {
      if (!isLoaded) {
        setOrder(ctx.order && ctx.order || initOrder);
      }
    };
    loadOrder();
    return () => { isLoaded = true; };
  }, []);

  const deleteData = async (e: React.MouseEvent) => {
    const baseUrl = `/api/orders/${order.id}`;

    e.preventDefault();

    const res = await fetch(baseUrl, {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      }
    });

    const data: any = await res.json();

    if (res.status !== 200) {
      alert(data.message);
    } else {
      ctx.updateValue && ctx.updateValue(data, 'delete')
      //updateCommand({ data: order, method: 'delete' });
    }

    return false;
  };


  const formSubmit = async (e: React.FormEvent) => {
    const baseUrl = `/api/orders/${order.id}`;

    e.preventDefault();
    /*
    const check = checkError(order);
    if (check) {
      setErrorText(check);
      return false;
    }
    */

    const res = await fetch(baseUrl, {
      method: order.id === 0 ? 'POST' : 'PUT',
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      },
      body: JSON.stringify({
        data: {
          id: order.id,
          cash: order.cash,
          customerId: order.customerId,
          dueDate: order.dueDate,
          salesId: order.salesId,
          total: order.total
        }
      })
    });

    const data: iOrder | any = await res.json();

    if (res.status !== 200) {
      alert(data.message);
    } else {
      ctx.updateValue && ctx.updateValue(data, order.id === 0 ? 'insert' : 'update')
      //updateCommand({ data: data, method: order.id === 0 ? 'insert' : 'update' });
      setOrder((state) => (
        {
          ...state,
          id: data.id,
          cash: data.cash,
          customerId: data.customerId,
          dueDate: data.dueDate,
          salesId: data.salesId,
          total: data.total,
          payments: data.payments,
          remainPayment: data.remainPayment
        })
      )
    }

    return false;
  };

  return (
    <form onSubmit={(e) => formSubmit(e)}>
      <div className={'row'}>
        <div className={'col-md-6 form-floating mb-2'}>
          <select id={'cust-id'} className={'form-control'} value={order.customerId} onChange={(e) => setOrder((state) => ({ ...state, customerId: +e.target.value }))}>
            <DefaultOption name={'Pilih pelanggan...'} />
            {ctx.customers.map((c) => (<option key={`sel-cust-${c.id}`} value={c.id}>{c.name}</option>))}
          </select>
          <label htmlFor={'cust-id'} className={'col-form-label mx-2'}>Pelanggan</label>
        </div>
        <div className={'col-md-6 form-floating mb-2'}>
          <select id={'sales-id'} className={'form-control'} value={order.salesId} onChange={(e) => setOrder((state) => ({ ...state, salesId: +e.target.value }))}>
            <DefaultOption name={'Pilih sales...'} />
            {ctx.salesmans.map((c) => (<option key={`sel-sales-${c.id}`} value={c.id}>{c.name}</option>))}
          </select>
          <label htmlFor={'sales-id'} className={'col-form-label mx-2'}>Sales</label>
        </div>
        <div className={'col-md-6 form-floating mb-2'}>
          <input type={'number'} className={'form-control'} id={'total-order'} value={order.total} readOnly />
          <label htmlFor={'total-order'} className={'col-form-label mx-2'}>Total Order</label>
        </div>
        <div className={'col-md-6 form-floating mb-2'}>
          <input type={'text'} className={'form-control'} id={'cash-order'} value={order.cash} onChange={(e) => {
            const cash = +e.target.value || 0;
            const remain = +(order.total - (+order.payments + cash))
            console.log(cash)
            setOrder((state) => ({ ...state, cash: cash, remainPayment: remain }))

          }
          } />
          <label htmlFor={'cash-order'} className={'col-form-label mx-2'}>Cash</label>
        </div>
        <div className={'col-md-6 form-floating mb-2'}>
          <input type={'number'} className={'form-control'} id={'payment-order'} value={order.payments} readOnly />
          <label htmlFor={'payment-order'} className={'col-form-label mx-2'}>Angsuran</label>
        </div>
        <div className={'col-md-6 form-floating mb-2'}>
          <input type={'number'} className={'form-control'} id={'remain-order'} value={order.remainPayment} readOnly />
          <label htmlFor={'remain-order'} className={'col-form-label mx-2'}>Sisa Bayar</label>
        </div>
      </div>
      <div className={'container mt-3'}>
        <button type={'submit'} className='btn w85 me-2 btn-primary'>
          Save Data
              </button>
        <button type={'button'}
          disabled={order.id === 0}
          onClick={(e) => deleteData(e)} className='btn w85 btn-danger'>
          Delete
              </button>
      </div>
    </form>
  );
};


const DefaultOption = ({ name }: any) => {
  return <option value={0}>{name}</option>
}