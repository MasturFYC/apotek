import React, { useContext, useState } from 'react';
import Select from 'react-select';
import NumberFormat from 'react-number-format';
import { iCustomer, iDataList, iOrder, iSalesman } from '../interfaces';
import OrderContext, { initOrder, OrderContextType } from '../context/order-context';
import { FLabel } from 'components/styles';

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
      ctx.updateValue && ctx.updateValue(data, 'DELETE')
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
          id: data.id,cash: data.cash,
          customerId: data.customerId,
          dueDate: data.dueDate,
          salesId: data.salesId,
          total: data.total,
          payment: data.payment,
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
              <input type={'text'} className={'form-control'} id={'order-date'} defaultValue={order.createdAt && new Date(order.createdAt).toLocaleDateString()} readOnly />
              <FLabel htmlFor={'order-date'}>Tanggal Order</FLabel>
            </div>

            <div className={'col-md-6 form-floating'}>
              <input value={new Date(order.dueDate).toLocaleDateString()} type={'text'} defaultChecked date-date-format={'dd/mm/yyyy'} className={'form-control'} id={'due-date'} onChange={(e) => setOrder((state) => ({ ...state, dueDate: e.target.value }))} />
              <FLabel htmlFor={'due-date'}>Jatuh Tempo</FLabel>
            </div>

            <div className={'col-md-12 form-floating'}>
              <Select id={'customer-id'} className={'form-control border-0 p-0'} value={ctx.customers.filter(x => x.id === order.customerId)} onChange={(e) => setOrder((state) => ({ ...state, customerId: e?.id || 0 }))} options={ctx.customers} getOptionLabel={o=>o.name} getOptionValue={o => `${o.id}`} styles={customStyles} placeholder={'Pilih pelanggan...'} />
              <label htmlFor={'customer-id'} className={'col-form-label mb-3 pt-32'}>Pelanggan</label>
            </div>

            <div className={'col-md-12 form-floating'}>
              <Select id={'sales-id'} className={'form-control border-0 p-0'} value={ctx.salesmans.filter(x => x.id === order.salesId)} onChange={(e) => setOrder((state) => ({ ...state, salesId: e?.id || 0 }))} options={ctx.salesmans} getOptionLabel={o=>o.name} getOptionValue={o => `${o.id}`} styles={customStyles} placeholder={'Pilih sales...'} />
              <label htmlFor={'sales-id'} className={'col-form-label pt-3'}>Sales</label>
            </div>

            <div className={'col-md-12 form-floating'}>
              <input type={'text'} className={'form-control'} id={'user-id'} value={order.userId || ''} readOnly />
              <FLabel htmlFor={'user-id'}>Last update by user</FLabel>
            </div>

          </div>
        </div>

        <div className={'col-md-6'}>
          <div className={'row g-2'}>

            <div className={'col-md-6 form-floating'}>
              <NumberFormat displayType={'text'} id={'total-order'} className={'form-control'} thousandSeparator={true} readOnly value={order.total} decimalScale={0} fixedDecimalScale={false} placeholder={"Pembayaran Cash"} />
              <FLabel htmlFor={'total-order'}>Total Order</FLabel>
            </div>

            <div className={'col-md-6 form-floating'}>
              <NumberFormat id={'cash-order'} className={'form-control'} thousandSeparator={true} value={order.cash} decimalScale={0} fixedDecimalScale={false} placeholder={"Pembayaran Cash"}
                onValueChange={(e) => {
                  const cash = e.floatValue || 0;
                  const remain = +(order.total - (+order.payment + cash));
                  setOrder((state) => ({ ...state, cash: cash, remainPayment: remain }));
                }} />
              <FLabel htmlFor={'cash-order'}>Cash</FLabel>
            </div>

            <div className={'col-md-6 form-floating'}>
              <NumberFormat displayType={'text'} id={'payment-order'} className={'form-control'} thousandSeparator={true} readOnly value={order.payment} decimalScale={0} fixedDecimalScale={false} placeholder={"Pembayaran Cash"} />
              <FLabel htmlFor={'payment-order'}>Angsuran</FLabel>
            </div>

            <div className={'col-md-6 form-floating'}>
              <NumberFormat displayType={'text'} id={'remain-order'} className={'form-control'} thousandSeparator={true} readOnly value={order.remainPayment} decimalScale={0} fixedDecimalScale={false} placeholder={"Pembayaran Cash"} />
              <FLabel htmlFor={'remain-order'}>Sisa Bayar</FLabel>
            </div>

            <div className={'col-md-12 form-floating'}>
              <textarea style={{ height: '70px' }} className={'form-control'} id={'order-desc'} value={order.descriptions || ''} placeholder={'Keterangan'} onChange={(e) => setOrder((state) => ({ ...state, descriptions: e.target.value }))} />
              <FLabel htmlFor={'order-desc'}>Keterangan</FLabel>
            </div>

            <div className={'col-sm-7 form-floating'}>
              <Select id={'order-status'} className={'form-control border-0 p-0'} value={statusOptions.filter(x => x.id === order.status)} onChange={(e) => setOrder((state) => ({ ...state, status: e?.id || 0 }))} options={statusOptions} getOptionLabel={option => option.name} getOptionValue={option => `${option.id}`} styles={customStyles} placeholder={'Order Status'} />
              <label htmlFor={'order-status'} className={'col-form-label mb-3 pt-3'}>Status</label>
            </div>

            <div className={'col-auto pt-2'}>
              <button type={'submit'} className='btn me-2 btn-primary mb-3'>Save Order</button>
              <button type={'button'} disabled={order.id === 0} onClick={(e) => deleteData(e)} className='btn btn-danger mb-3'>Delete</button>
            </div>

          </div>
        </div>
      </div>
    </form>
  );
};

const customStyles = {
  input: () => ({marginTop: 8, paddingTop: 12, marginLeft: 9}),
   valueContainer: () => ({
     height: 46,
  //   margin: '-10px 0px 0px 7px',
   }),
   singleValue: (p:any, s:any) => ({...p, marginTop: 6, marginLeft: 9})
}

const statusOptions: iDataList[] = [
  { id: 0, name: 'Pending' },
  { id: 1, name: 'Open' },
  { id: 2, name: 'Closed' }
]

const DefaultOption = ({ name }: any) => {
  return <option value={0}>{name}</option>
}
