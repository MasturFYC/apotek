import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import useSWR from 'swr'
import NumberFormat from 'react-number-format'
import Layout, { siteTitle } from '../../../components/layout'
import { iSalesman, iOrder, iCustomer } from '../../../components/interfaces'
import { DivRow, FocusSpan } from '../../../components/styles'
// import { MutatorCallback } from 'swr/dist/types'

const SalesOrder: React.FunctionComponent = () => {
  const { query } = useRouter();
  const { salesman, isLoading, isError } = useSalesman(parseInt('' + query.id));
  const [showOrderDetail, setShowOrderDetail] = useState(false)
  const [showPayment, setShowPayment] = useState(false)

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

  const ShowCustomer = (customer: iCustomer) => (
    <div>
      <FocusSpan><Link href={`/customer/${customer.id}`}><a>{customer.name}</a></Link></FocusSpan><br />
      <span>{customer.street} - {customer.city}{customer.zip && `, ${customer.zip}`}</span><br />
      <span>Telp. {customer.phone}{customer.cell && ` / ${customer.cell}`}</span>
    </div>
  )

  const convertToDate = (val?: string | undefined) => {
    const s = val ? new Date(val) : new Date();
    return s.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  }

  const toLocalFormat = (val: number) => (val.toLocaleString('id-ID', {useGrouping: true}))

  const ShowOrders: React.FunctionComponent<{ orders: iOrder[] }> = ({ orders }) => (
    <React.Fragment>
      {orders.map((item: iOrder, index: number) => (
        <DivRow key={`key-order-${index}`}>
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
                  <img src={'/images/customer.svg'} style={{width: 32, marginTop: 6}} />
                </div>
                <div className={'col-11 ps-3'}>
                  <ShowCustomer {...item.customer} />
                </div>
              </div>
            </div>}
          <div className={'col-md-12'}>
            <button className={'btn btn-sm btn-secondary me-2'} onClick={() => {
              setShowPayment(false)
              setShowOrderDetail(true)
            }}>Details</button>
            <button className={'btn btn-sm btn-secondary me-2'} onClick={() => {
              setShowPayment(true)
              setShowOrderDetail(false)
            }}>Payments</button>
            <Link href={`/orders/${item.id}`}>
              <a className={'btn btn-success btn-sm py-1 px-3'}>Open</a>
            </Link>
          </div>
          {showOrderDetail && <ShowOrderDetail orderId={item.id} />}
          {showPayment && <ShowPayments />}
        </DivRow >
      ))}
      <DivRow>
        <div>Add new order</div>
      </DivRow>
    </React.Fragment >
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
  orderId;
  //const [orderDetails, setOrderDetails] = useState<iOrderDetail[]>([]);
  /*
   React.useEffect(() => {
     let isLoaded = false;

     const loadDetails = async () => {
       const res = await fetch(`/order/details/${orderId}`)
       const data: iOrderDetail[] | any = await res.json()

       if (res.status !== 200) {
         throw new Error(data.message)
       }

       if (!isLoaded) {
         setOrderDetails(data)
       }

     }

     loadDetails();

     return () => {
       isLoaded = false;
     }

   })
   */
  return (
    <div>Details</div>
  )
}

function ShowPayments() {
  return (
    <div>Payments</div>
  )
}
