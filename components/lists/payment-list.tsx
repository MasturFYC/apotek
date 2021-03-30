import React from 'react';
import Select from 'react-select';
import NumberFormat from 'react-number-format';
import { iOrder, iPayment, iPaymentMethod } from 'components/interfaces';
import { DivRow } from 'components/styles';
import OrderContext, { initPayment, OrderContextType } from 'components/context/order-context';
// import { PaymentForm } from 'components/forms/payment-form';

type PaymentListParam = {
  pay: iPayment
}

var n = 101;

const PaymentList: React.FunctionComponent = () => {
  const ctx = React.useContext<OrderContextType>(OrderContext);
  const [payments, setPayments] = React.useState<iPayment[]>([]);
  const [curIndex, setCurIndex] = React.useState<number>(-1);
  //const [curPayment, setCurPayment] = React.useState<iPayment>(initPayment);

  React.useEffect(() => {
    let isLoaded = false;
    const loadPayments = () => {
      if (!isLoaded) {
        setPayments(ctx.order?.payments || [initPayment]);
      }
    }

    loadPayments();

    return () => { isLoaded = true; }
  }, [ctx.order])

  const setCurrentPayment = (i: number) => {
    setCurIndex(i);
    //setCurPayment(payments[i]);
  }

  const savePayment = async (item: iPayment, method: string) => {
    const baseUrl = `/api/payment/${item.id}`;

    const res = await fetch(baseUrl, {
      method: method,
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      },
      body: JSON.stringify({
        data: method === 'DELETE' ? null : item
      })
    });

    const data: iPayment | any = await res.json();

    if (res.status !== 200) {

      alert(data.message);

    } else {

      if (ctx.order && ctx.mutate && ctx.order.payments) {
        switch (method) {
          case 'POST':
            {
              ctx.mutate((state: iOrder) => ({
                ...state,
                payment: (+state.payment) + (+item.amount),
                remainPayment: (+state.remainPayment) - (+item.amount),
                payments: [...payments, { ...item, id: data.id }]
              }), false)
            }
            break;
          case 'PUT':
            {
              /*
              let i = -1;
              let old: iPayment | null = null;

              for (let c = 0; c < payments.length; c++) {
                if (payments[c].id === item.id) {
                  i = c;
                  old = payments[c];
                  break;
                }
              }
              */
              const d = payments[curIndex];
              payments.splice(curIndex, 1, item);

//              if (d) {
                ctx.mutate((state: iOrder) => ({
                  ...state,
                  payment: (+state.payment) + (+item.amount) - (d.amount),
                  remainPayment: (+state.remainPayment) - (+item.amount) + (d.amount),
                  payments: payments
                }), false)
                //console.log(payments)
                //setPayments(ctx.order.payments)
//              }
            }
            break;
          case 'DELETE':
            {
              const d = payments[curIndex];
              payments.splice(curIndex, 1);
              ctx.mutate((state: iOrder) => ({
                ...state,
                payment: (+state.payment) - (d.amount),
                remainPayment: (+state.remainPayment) + (d.amount),
                payments: payments
              }), false)

            }
            break;
        }
      }
    }
  }

  return (
    <React.Fragment>
      <DivRow>
        <div className={'col-1'}>#ID</div>
        <div className={'col-4'}>Tanggal</div>
        <div className={'col'}>User</div>
        <div className={'col'}>Metode</div>
        <div className={'col'}>Jumlah</div>
        <div className={'col'}>Keterangan</div>
      </DivRow>
      {[...payments, { ...initPayment, orderId: ctx.order && ctx.order.id || 0 }].map((item: iPayment, index: number) => {
        return (
          <React.Fragment key={`pay-list-${index}`}>
            { index === curIndex ? <ShowPaymentForm pay={item} methods={ctx.methods}
              onSave={(e, s) => savePayment(e, s)}
              onCancel={() => curIndex === index && setCurIndex(-1)} /> :
              ShowPayment(setCurrentPayment, index, item)
            }
          </React.Fragment>
        )
      })}
      <div style={{ paddingBottom: '50px' }} />
    </React.Fragment>
  )
}

export default PaymentList;


const customStyles = {
  input: () => ({ marginTop: 8, paddingTop: 12, marginLeft: 9 }),
  valueContainer: () => ({
    height: 46,
    //   margin: '-10px 0px 0px 7px',
  }),
  singleValue: (p: any, s: any) => ({ ...p, marginTop: 6, marginLeft: 9 })
}


const ShowPaymentForm: React.FunctionComponent<{
  pay: iPayment,
  methods: iPaymentMethod[],
  onCancel: Function,
  onSave: (item: iPayment, method: string) => void
}> =
  ({ pay, methods, onCancel, onSave }) => {
    const [item, setItem] = React.useState<iPayment>(initPayment);

    React.useEffect(() => {
      let isLoaded = false;
      const loadPayment = () => {
        if (!isLoaded) {
          setItem(pay);
        }
      }

      loadPayment();

      return () => { isLoaded = true; }

    }, [pay]);

    const formSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSave(item, item.id === 0 ? 'POST' : 'PUT');
    }

    return (
      <DivRow>
        <form onSubmit={(e) => formSubmit(e)} className={'container'}>
          <div className={'row g-2'}>
            <div className={'col-sm-3 col-md-3 form-floating'}>
              <span className={'form-control bg-light'} id={'pay-date'}>{item.createdAt && new Date(item.createdAt).toLocaleDateString()}</span>
              <label htmlFor={'pay-date'}>Tanggal</label>
            </div>
            <div className={'col-sm-3 col-md-2 form-floating'}>
              <span className={'form-control bg-light'} id={'pay-user'}>{`${item.userId || ''}`}</span>
              <label htmlFor={'pay-user'}>User</label>
            </div>

            <div className={'col-sm-6 col-md-3 form-floating'}>
              <Select id={'pay-method'} className={'form-control border-0 p-0'}
                value={methods.filter(x => x.id === item.methodId)}
                onChange={(e) => setItem((state) => ({ ...state, methodId: e?.id || 0, methodName: e?.name }))}
                options={methods}
                autoFocus
                getOptionLabel={o => o.name}
                getOptionValue={o => `${o.id}`}
                styles={customStyles} placeholder={''} />
              <label htmlFor={'pay-method'} className={'col-form-label mb-3 pt-3'}>Metode Pembayaran</label>
            </div>

            <div className={'col-sm-4 col-md-4 form-floating'}>
              <NumberFormat value={item.amount} placeholder={'Jumlah'} id={'pay-amount'}
                displayType={'input'}
                className={'form-control'} thousandSeparator={true}
                decimalScale={2}
                onValueChange={e => setItem(state => ({ ...state, amount: e.floatValue || 0 }))}
                fixedDecimalScale={false} />
              <label htmlFor={'pay-amount'}>Jumlah</label>
            </div>

            <div className={'col form-floating'}>
              <textarea className={'form-control'} id={'pay-desc'} value={item.descriptions || ''}
                onChange={(e) => setItem(state => ({ ...state, descriptions: e.target.value }))} />
              <label htmlFor={'pay-desc'}>Keterangan</label>
            </div>
            <div className={'col-auto form-inline p-1'}>
              <button type={'submit'} className='btn btn-sm me-2 btn-primary mb-2'>Save</button>
              <button type={'button'} className='btn me-2 btn-sm btn-warning mb-2'
                onClick={(e) => {
                  e.preventDefault();
                  onCancel();
                }}>Cancel</button>
              <button type={'button'} disabled={item.id === 0} className='btn btn-sm btn-danger mb-2'
                onClick={(e) => {
                  e.preventDefault();
                  onSave(item, 'DELETE')
                }}
              >Delete</button>
            </div>
          </div>
        </form>
      </DivRow>
    )
  }


function ShowPayment(setCurrentPayment: (i: number) => void, index: number, item: iPayment): React.ReactNode {
  return <DivRow onClick={() => setCurrentPayment(index)}>
    <div className={'col-1'}>#{item.id}</div>
    <div className={'col-4'}>{item.createdAt && new Date(item.createdAt).toLocaleDateString()}</div>
    <div className={'col'}>{item.userId}</div>
    <div className={'col'}>{item.methodName}</div>
    <div className={'col'}>
      <NumberFormat
        value={item.amount}
        decimalScale={2}
        thousandSeparator={true}
        fixedDecimalScale={false}
        displayType={'text'}
        readOnly
        renderText={e => <span>{e}</span>} />
    </div>
    <div className={'col'}>{item.descriptions}</div>
  </DivRow>;
}
