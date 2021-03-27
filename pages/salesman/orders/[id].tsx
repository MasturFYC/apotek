import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import useSWR, { mutate } from 'swr'
import Layout, { siteTitle } from '../../../components/layout'
import { iSalesman, iOrder, iCustomer, iOrderDetail } from '../../../components/interfaces'
import { CustomerName, DivRow } from 'components/styles'

const salesOrder: React.FunctionComponent = () => {
  const { query } = useRouter();
  const { salesman, isLoading, isError, mutate } = useSalesman(parseInt('' + query.id));
  const [showOrderDetail, setShowOrderDetail] = useState(false)
  const [showPayment, setShowPayment] = useState(false)

  if (isError) return <div>{isError.message}</div>
  if (isLoading) return <div>Loading...</div>

  const refreshData = (data: iOrder, method: string) => {
    if (salesman && salesman.orders) {
      let newData: iOrder[] | undefined;
      switch (method) {
        case 'insert':
          {
            mutate({ ...salesman, orders: [...salesman.orders, data] }, false);
          }
          break;
        case 'update':
          {
            const findElement = (items: iOrder[]) => {
              for (var j = 0; j < items.length; j++) {
                if (items[j].id === data.id) {
                  return j;
                }
              }
              return -1;
            }
            const index = findElement(salesman.orders);
            //newData = salesman.orders.filter(x => x.id !== data.id)
            mutate({
              ...salesman,
              orders: [...salesman.orders.filter(x => x.id !== data.id)
                .splice(index, 0, data)]
            }, false);
          }
          break;
        case 'delete':
          {
            mutate({ ...salesman, orders: [...salesman.orders.filter(x => x.id !== data.id)] }, false)
          }
          break;
      }
      //newData && mutate({ ...salesman, products: newData }, false);
    }
  }

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
          <button className={'btn btn-success'}>Add New Order</button>
        </div>
      </div >
      {sales.orders &&
        <div className={'row'}>
          <div className={'container'}>
            <ShowOrders orders={sales.orders} />
          </div>
        </div>
      }
    </React.Fragment>
  )

  const ShowCustomer = (customer: iCustomer) => (
    <div>
      <CustomerName><Link href={`/customer/${customer.id}`}><a>{customer.name}</a></Link></CustomerName><br />
      <span>{customer.street} - {customer.city}{customer.zip && `, ${customer.zip}`}</span><br />
      <span>Telp. {customer.phone}{customer.cell && ` / ${customer.cell}`}</span>
    </div>
  )

  const ShowOrders: React.FunctionComponent<{ orders: iOrder[] }> = ({ orders }) => (
    <React.Fragment>
      {orders.map((item: iOrder, index: number) => (
        <DivRow key={`key-order-${index}`}>
          <div className={'col-md-6 me-3 mb-3'}>
            <label style={{ width: '100px' }}>ID:</label>#{item.id}<br />
            <label style={{ width: '100px' }}>Tgl. Order:</label>{item.createdAt ?? ''}<br />
            <label style={{ width: '100px' }}>Jatuh Tempo:</label>{item.dueDate ?? ''}<br />
            <label style={{ width: '100px' }}>Total Order:</label>{item.total}<br />
            <label style={{ width: '100px' }}>Cash:</label>{item.cash}<br />
            <label style={{ width: '100px' }}>Angsuran:</label>{item.payments}<br />
            <label style={{ width: '100px' }}>Piutang:</label>{item.remainPayment}<br />
          </div>
          {item.customer &&
            <div className={'col-md-auto mb-3'}>
              <ShowCustomer {...item.customer} />
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
              <a className={'btn btn-success bn-sm py-1 px-3'}>Open</a>
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

export default salesOrder;

const initOrderDetail: iOrderDetail = {
  id: 0,
  orderId: 0,
  productId: 0,
  unitId: 0,
  qty: 0,
  realQty: 0,
  barcode: '',
  productName: '',
  spec: '',
  unitName: '',
  price: 0,
  disc: 0,
  subtotal: 0
}

const ShowOrderDetail: React.FunctionComponent<{ orderId: number }> = ({ orderId }) => {
  const [orderDetails, setOrderDetails] = useState<iOrderDetail[]>([]);

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
  return (
    <div>Details</div>
  )
}

function ShowPayments() {
  return (
    <div>Payments</div>
  )
}
