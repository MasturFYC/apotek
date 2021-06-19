import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import useSWR from 'swr'
//import NumberFormat from 'react-number-format'
import Layout, { siteTitle } from '../../../components/layout'
import { iSalesman, iOrder, iCustomer, iOrderDetail, iPayment } from '../../../components/interfaces'
import { DivRow, FocusSpan } from '../../../components/styles'
// import { MutatorCallback } from 'swr/dist/types'
//import CustomerLogo from '/images/customer.svg'

const SalesOrder: React.FunctionComponent = () => {
  const { query } = useRouter();
  const { salesman, isLoading, isError } = useSalesman(parseInt('' + query.id));

  if (isError) return <div>{isError.message}</div>
  if (isLoading) return <div>Loading...</div>

  // const refreshData = (data: iOrder, method: string) => {
  //   if (salesman && salesman.orders) {
  //     let newData: iOrder[] | undefined;
  //     switch (method) {
  //       case 'insert':
  //         {
  //           mutate({ ...salesman, orders: [...salesman.orders, data] }, false);
  //         }
  //         break;
  //       case 'update':
  //         {
  //           const findElement = (items: iOrder[]) => {
  //             for (var j = 0; j < items.length; j++) {
  //               if (items[j].id === data.id) {
  //                 return j;
  //               }
  //             }
  //             return -1;
  //           }
  //           const index = findElement(salesman.orders);
  //           //newData = salesman.orders.filter(x => x.id !== data.id)
  //           mutate({
  //             ...salesman,
  //             orders: [...salesman.orders.filter(x => x.id !== data.id)
  //               .splice(index, 0, data)]
  //           }, false);
  //         }
  //         break;
  //       case 'delete':
  //         {
  //           mutate({ ...salesman, orders: [...salesman.orders.filter(x => x.id !== data.id)] }, false)
  //         }
  //         break;
  //     }
  //     //newData && mutate({ ...salesman, products: newData }, false);
  //   }
  // }

  const ShowSales: React.FunctionComponent<{ sales: iSalesman }> = ({ sales }) => (
    <React.Fragment>
      <div className={'row'}>
        <div className={'col-md-auto me-5'}>
          <h4>{sales.name}</h4>
          <p>{sales.street} - {sales.city}{sales.zip && `, ${sales.zip}`}<br />
            Telp. {sales.phone}{sales.cell && ` / ${sales.cell}`}
          </p>
        </div>
        <div className={'col-md-3 col-sm-3 mb-3'}>
          <Link href={`/orders/0`}>
            <a className={'btn btn-success btn-sm py-1 px-3'}>New Order</a>
          </Link>
        </div>
      </div >
      {sales.orders &&
        <div className={'container'}>
          <ShowOrders orders={sales.orders} />
        </div>
      }
    </React.Fragment>
  )

  return (
    <Layout home menuActive={3} heading={'Sales Order'}>
      <Head>
        <title>Order by Sales - {siteTitle}</title>
      </Head>
      {salesman && <ShowSales sales={salesman} />}
    </Layout>
  )
}

const revalidationOptions = {
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  refreshWhenOffline: false,
  refreshWhenHidden: false,
  refreshInterval: 0
};

const ShowCustomer: React.FunctionComponent<{ customer: iCustomer }> = ({ customer }) => (
  <div>
    <FocusSpan><Link href={`/customer/${customer.id}`}><a>{customer.name}</a></Link></FocusSpan><br />
    <span>{customer.street} - {customer.city}{customer.zip && `, ${customer.zip}`}</span><br />
    <span>Telp. {customer.phone}{customer.cell && ` / ${customer.cell}`}</span>
  </div>
)

const ShowOrders: React.FunctionComponent<{ orders: iOrder[] }> = ({ orders }) => {
  return (
    <React.Fragment>
      {orders.map((item: iOrder, index: number) => (
        ShowOrderItem(index, item)
      ))}
      <DivRow>
        <div>Add new order</div>
      </DivRow>
    </React.Fragment >
  )
}

// type SalesmanDataType = {
//   salesmane: iSalesman;
//   isLoading: boolean;
//   isError: boolean;
//   mutate: (data?: iSalesman | Promise<iSalesman> | MutatorCallback<iSalesman> | undefined, shouldRevalidate?: boolean | undefined) => {}
// }

const useSalesman = (id: number) => {
  const baseUrl: any = () => id && `/api/salesman/orders/${id}`;
  const { data, error, mutate } = useSWR<iSalesman, Error>(baseUrl, fetcher, revalidationOptions);

  return {
    salesman: data,
    isLoading: !error && !data,
    isError: error,
    mutate: mutate
  }

}

const fetcher = async (url: string): Promise<iSalesman> => {
  const res = await fetch(url)
  const data: iSalesman | any = await res.json()

  if (res.status !== 200) {
    throw new Error(data.message)
  }

  //console.log(data)
  return data;
}

// const initOrder = (defaultSalesId: number): iOrder => {
//   return {
//     id: 0,
//     customerId: 0,
//     salesId: defaultSalesId,
//     dueDate: new Date().toLocaleDateString(),
//     total: 0,
//     cash: 0,
//     payment: 0,
//     remainPayment: 0,
//     status: 0,
//   }
// }

export default SalesOrder;

// const initOrderDetail: iOrderDetail = {
//   id: 0,
//   orderId: 0,
//   productId: 0,
//   unitId: 0,
//   qty: 0,
//   realQty: 0,
//   barcode: '',
//   productName: '',
//   spec: '',
//   unitName: '',
//   price: 0,
//   discount: 0,
//   subtotal: 0,
//   profit: 0,
//   weight: 0
// }

const ShowOrderDetail: React.FunctionComponent<{ orderId: number }> = ({ orderId }) => {

  const [orderDetails, setOrderDetails] = useState<iOrderDetail[]>([]);
  const [dataLength, setDataLength] = useState(0);

  React.useEffect(() => {
    let isLoaded = false;

    const loadDetails = async () => {
      const res = await fetch(`/api/orders/details/${orderId}`)
      const data: iOrderDetail[] | any = await res.json()

      if (res.status !== 200) {
        throw new Error(data.message)
      }

      if (!isLoaded) {
        setOrderDetails(data)
        setDataLength(data.length)
      }

    }

    loadDetails();

    return () => {
      isLoaded = false;
    }

  }, [orderId]);

  return (
    <div className={'container'}>
      <table className={'table table-hover table-sm mt-1 caption-top'}>
        <caption>Order Details</caption>
        <thead>
          <tr>
            <th>#</th>
            <th>Nama Barang</th>
            <th className={'text-end'}>Qty/Unit</th>
            <th className={'text-end'}>Harga</th>
            <th className={'text-end'}>Disc.</th>
            <th className={'text-end'}>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {orderDetails && orderDetails.map((item: iOrderDetail, index: number) => (
            <tr key={`od-key-${index}`}>
              <td>{item.id}</td>
              <td>{item.productName}{item.spec && `, ${item.spec}`}</td>
              <td className={'text-end'}>{toLocalFormat(+item.qty)} {item.unitName}</td>
              <td className={'text-end'}>{toLocalFormat(+item.price)}</td>
              <td className={'text-end'}>{toLocalFormat(+item.discount)}</td>
              <td className={'text-end'}>{toLocalFormat(+item.subtotal)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={5}>Total {dataLength} item{dataLength > 1 ? 's' : ''}</td>
            <th className={'text-end'}>{ orderDetails && toLocalFormat(orderDetails.reduce((sum: number, item: iOrderDetail) => (sum + (+item.subtotal)), 0))}</th>
            </tr>
        </tfoot>
      </table>
    </div>
  )
}

const toLocalFormat = (val: number) => (val.toLocaleString('id-ID', { style: 'decimal', minimumFractionDigits: 0, maximumFractionDigits:2, useGrouping: true }))

const convertToDate = (val?: string | undefined) => {
  const s = val ? new Date(val) : new Date();
  return s.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
}
function ShowOrderItem(index: number, item: iOrder): JSX.Element {
  const [showOrderDetail, setShowOrderDetail] = useState(false)
  const [showPayment, setShowPayment] = useState(false)


  return <DivRow key={`key-order-${index}`}>
    <div className={'col-6 col-md-6 mb-3'}>
      <label style={{ width: '100px' }}>ID:</label>#{item.id}<br />
      <label style={{ width: '100px' }}>Tgl. Order:</label>{convertToDate(item.createdAt)}<br />
      <label style={{ width: '100px' }}>Jatuh Tempo:</label>{convertToDate(item.dueDate)}<br />
      <label style={{ width: '100px' }}>Total Order:</label>{toLocalFormat(item.total)}<br />
      <label style={{ width: '100px' }}>Cash:</label>{toLocalFormat(item.cash)}<br />
      <label style={{ width: '100px' }}>Angsuran:</label>{toLocalFormat(item.payment)}<br />
      <label style={{ width: '100px' }}>Piutang:</label>{toLocalFormat(item.remainPayment)}
    </div>
    {item.customer &&
      <div className={'col-6 col-md-6 mb-3'}>
        <div className={'row'}>
          <div className={'col-1'}>
            <img alt="Customer" src={'/images/customer.svg'} style={{ width: 32, marginTop: 6 }} /> 
          </div>
          <div className={'col-11 ps-3'}>
            <ShowCustomer customer={item.customer} />
          </div>
        </div>
      </div>}
    <div className={'col-md-12'}>
    <label role={'button'} className={'me-2'}>
        <input type="checkbox"
        defaultChecked={showOrderDetail}
        onChange={() => setShowOrderDetail(!showOrderDetail)}
        />{' '}Details</label>
      <label role={'button'} className={'me-2'}>
        <input type="checkbox"
        defaultChecked={showPayment}
        onChange={() => setShowPayment(!showPayment)}
        />{' '}Angsuran</label>
      <Link href={`/orders/${item.id}`}>
        <a className={'btn btn-success btn-sm py-1 px-3'}>Open</a>
      </Link>
    </div>
    {showOrderDetail && <ShowOrderDetail orderId={item.id} />}
    {showPayment && <ShowPayments orderId={item.id} />}
  </DivRow>
}

const ShowPayments: React.FunctionComponent<{ orderId: number }> = ({ orderId }) => {

  const [payments, setPayments] = useState<iPayment[]>([]);
  const [dataLength, setDataLength] = useState(0);

  React.useEffect(() => {
    let isLoaded = false;

    const loadPayments = async () => {
      const res = await fetch(`/api/orders/payments/${orderId}`)
      const data: iOrderDetail[] | any = await res.json()

      if (res.status !== 200) {
        throw new Error(data.message)
      }

      if (!isLoaded) {
        setPayments(data)
        setDataLength(data.length)
      }

    }

    loadPayments();

    return () => {
      isLoaded = false;
    }

  }, [orderId]);

  return (
    <div className={'container'}>
      <table className={'table table-hover table-sm mt-1 caption-top'}>
        <caption>Order Payments</caption>
        <thead>
          <tr>
            <th>#</th>
            <th className={'text-center'}>TGl. Bayar</th>
            <th>User</th>
            <th>Metode</th>
            <th className={'text-end'}>Jumlah</th>
            <th>Keterangan</th>
          </tr>
        </thead>
        <tbody>
          {payments && payments.map((item: iPayment, index: number) => (
            <tr key={`od-key-${index}`}>
              <td>{item.id}</td>
              <td className={'text-center'}>{convertToDate(item.createdAt)}</td>
              <td>{item.userId}</td>
              <td>{item.methodName}</td>
              <td className={'text-end'}>{toLocalFormat(+item.amount)}</td>
              <td>{item.descriptions}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={4}>Total {dataLength} item{dataLength > 1 ? 's' : ''}</td>
            <th className={'text-end'}>{payments && toLocalFormat(payments.reduce((sum: number, item: iPayment) => (sum + (+item.amount)), 0))}</th>
            <td>{' '}</td>
            </tr>
        </tfoot>
      </table>
    </div>
  )
}
