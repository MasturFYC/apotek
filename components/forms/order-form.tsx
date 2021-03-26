import React, { useContext, useState } from 'react';
import Select from 'react-select';
import NumberFormat from 'react-number-format';
import { iCustomer, iOrder, iSalesman } from '../interfaces';
import OrderContext, { initOrder, OrderContextType } from '../context/order-context';

export const OrderForm = () => {
  const ctx: OrderContextType = useContext(OrderContext);
  const [order, setOrder] = useState<iOrder>(initOrder);

  React.useEffect(() => {
    let isLoaded = false;
    const loadOrder = () => {
      if (!isLoaded) {
        setOrder(ctx.order && ctx.order || initOrder);
        //console.log(ctx.order?.dueDate)
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

    //console.log(order.dueDate)

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
          total: order.total,
          status: order.status,
          userId: order.userId,
          descriptions: order.descriptions
        }
      })
    });

    const data: iOrder | any = await res.json();

    if (res.status !== 200) {
      alert(data.message);
    } else {
      //ctx.updateValue && ctx.updateValue(data, order.id === 0 ? 'insert' : 'update')
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
          remainPayment: data.remainPayment,
          status: data.status,
          userId: data.userId,
          descriptions: data.descriptions
        })
      )
    }

    return false;
  };

  return (
    <form onSubmit={(e) => formSubmit(e)}>
      <div className={'row'}>
        <div className={'col-md-6 mb-2'}>
          <div className={'row g-2'}>

            <div className={'col-md-6 form-floating'}>
              <input type={'text'} className={'form-control'} id={'order-date'} value={order.createdAt && new Date(order.createdAt).toLocaleDateString()} readOnly />
              <label htmlFor={'order-date'} className={'col-form-label'}>Tanggal Order</label>
            </div>

            <div className={'col-md-6 form-floating'}>
              <input value={new Date(order.dueDate).toLocaleDateString()} type={'text'} defaultChecked date-date-format={'dd/mm/yyyy'} className={'form-control'} id={'due-date'} onChange={(e) => setOrder((state) => ({ ...state, dueDate: e.target.value }))} />
              <label htmlFor={'due-date'} className={'col-form-label'}>Jatuh Tempo</label>
            </div>

            <div className={'col-md-12 form-floating'}>
              <Select id={'customer-id'} className={'form-control border-0 p-0'}
                value={getCustomerFilter(ctx.customers, order.customerId)}
                onChange={(e) => setOrder((state) => ({ ...state, customerId: e?.value || 0 }))}
                options={ctx.customers.map(x => ({ value: x.id, label: x.name }))}
                styles={customStyles}
                placeholder={'Pilih pelanggan...'} />
              <label htmlFor={'customer-id'} className={'col-form-label mb-3 pt-2'}>Pelanggan</label>
            </div>

            <div className={'col-md-12 form-floating'}>
            <Select id={'sales-id'} className={'form-control border-0 p-0'}
                value={getSalesFilter(ctx.salesmans, order.salesId)}
                onChange={(e) => setOrder((state) => ({ ...state, salesId: e?.value || 0 }))}
                options={ctx.salesmans.map(x => ({ value: x.id, label: x.name }))}
                styles={customStyles}
                placeholder={'Pilih sales...'} />
              <label htmlFor={'sales-id'} className={'col-form-label pt-2'}>Sales</label>
            </div>

            <div className={'col-md-12 form-floating'}>
              <input type={'text'} className={'form-control'} id={'user-id'} value={order.userId} readOnly />
              <label htmlFor={'user-id'} className={'col-form-label'}>Last update by user</label>
            </div>

          </div>
        </div>

        <div className={'col-md-6'}>
          <div className={'row g-2'}>
            <div className={'col-md-6 form-floating'}>
              <NumberFormat
                displayType={'text'}
                id={'total-order'}
                className={'form-control'}
                thousandSeparator={true}
                readOnly
                value={order.total}
                decimalScale={0}
                fixedDecimalScale={false}
                placeholder={"Pembayaran Cash"} />
              <label htmlFor={'total-order'} className={'col-form-label'}>Total Order</label>
            </div>
            <div className={'col-md-6 form-floating'}>
              <NumberFormat
                id={'cash-order'}
                className={'form-control'}
                thousandSeparator={true}
                value={order.cash}
                decimalScale={0}
                fixedDecimalScale={false}
                placeholder={"Pembayaran Cash"}
                onValueChange={(e) => {
                  const cash = e.floatValue || 0;
                  const remain = +(order.total - (+order.payments + cash))
                  setOrder((state) => ({ ...state, cash: cash, remainPayment: remain }))
                }} />
              <label htmlFor={'cash-order'} className={'col-form-label'}>Cash</label>
            </div>
            <div className={'col-md-6 form-floating'}>
              <NumberFormat
                displayType={'text'}
                id={'payment-order'}
                className={'form-control'}
                thousandSeparator={true}
                readOnly
                value={order.payments}
                decimalScale={0}
                fixedDecimalScale={false}
                placeholder={"Pembayaran Cash"} />
              <label htmlFor={'payment-order'} className={'col-form-label'}>Angsuran</label>
            </div>

            <div className={'col-md-6 form-floating'}>
              <NumberFormat
                displayType={'text'}
                id={'remain-order'}
                className={'form-control'}
                thousandSeparator={true}
                readOnly
                value={order.remainPayment}
                decimalScale={0}
                fixedDecimalScale={false}
                placeholder={"Pembayaran Cash"} />
              <label htmlFor={'remain-order'} className={'col-form-label'}>Sisa Bayar</label>

            </div>
            <div className={'col-md-12 form-floating'}>
              <textarea style={{ height: '70px' }} className={'form-control'} id={'order-desc'} value={order.descriptions}
                onChange={(e) => setOrder((state) => ({ ...state, descriptions: e.target.value }))}
              />
              <label htmlFor={'order-desc'} className={'col-form-label'}>Keterangan</label>
            </div>
            <div className={'col-md-7 form-floating'}>
              <Select id={'order-status'} className={'form-control border-0 p-0'}
                value={statusOptions.filter(x => x.value === order.status)}
                onChange={(e) => setOrder((state) => ({ ...state, status: e?.value || 0 }))}
                options={statusOptions}
                styles={customStyles}
                placeholder={'Order Status'} />
              <label htmlFor={'order-status'} className={'col-form-label mb-3 pt-2'}>Status</label>
            </div>
            <div className={'col-md-5 form-floating pt-2'}>
              <button type={'submit'} className='btn me-2 btn-primary'>
                Save Order</button>
              <button type={'button'}
                disabled={order.id === 0}
                onClick={(e) => deleteData(e)} className='btn btn-danger'>
                Delete</button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

const getCustomerFilter = (customers: iCustomer[], id: number) => {
  const customer = customers.filter(x => x.id === id)[0];
  return customer && {value: customer.id, label: customer.name }  || {value: 0, label: 'Pilih pelanggan...' }
}
const getSalesFilter = (salesmans: iSalesman[], id: number) => {
  const sales = salesmans.filter(x => x.id === id)[0];
  return sales && {value: sales.id, label: sales.name }  || {value: 0, label: 'Pilih sales...' }
}

const customStyles = {
  input: () => ({
    height: '42px',
    paddingTop: '12px',
    //margingTop: '-20px',
    //marginBottom: '-25px',
  })
}

type statusOptionType = {
  value: number;
  label: string;
}

const statusOptions: statusOptionType[] = [{
  value: 0,
  label: 'Pending'
}, {
  value: 1,
  label: 'Open'
}, {
  value: 2,
  label: 'Closed'
}]

const DefaultOption = ({ name }: any) => {
  return <option value={0}>{name}</option>
}
