import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import useSWR, { mutate } from 'swr'
import Layout, { siteTitle } from '../../components/layout'
import { iOrder, iCustomer, iSalesman, iOrderDetail, iDataList } from '../../components/interfaces'
import { OrderContextType, OrderProvider } from '../../components/context/order-context'
import { revalidationOptions } from 'components/fetcher'
import apiSales from '../api/models/salesman.model'
import apiSupplier from 'pages/api/models/supplier.model'
import apiCustomer from '../api/models/customer.model'
import { OrderForm } from '../../components/forms/order-form'
import { OrderDetailList } from 'components/lists/order-details'

type OrderPageParam = {
  customers: iDataList[];
  salesmans: iDataList[];
}

const orderPage: React.FunctionComponent<OrderPageParam> = ({ salesmans, customers }) => {
  const { query } = useRouter();
  const { order, isLoading, isError, mutate } = useOrder(parseInt('' + query.id));
  const [showDetails, setShowDetails] = useState(true)
  const [showPayments, setShowPayments] = useState(false)

  if (isError) return <div>{isError.message}</div>
  if (isLoading) return <div>Loading...</div>

  const refreshData = (data: iOrderDetail, method: string) => {
    if (order && order.details) {
      let newData: iOrderDetail[] | undefined;
      switch (method) {
        case 'insert':
          {
            newData = [...order.details, data];
          }
          break;
        case 'update':
          {
            let index: number = -1;
            for (var j = 0; j < order.details.length; j++) {
              if (order.details[j].id === data.id) {
                index = j;
                break;
              }
            }

            newData = order.details.filter(x => x.id !== data.id)
            newData.splice(index, 0, data)
          }
          break;
        case 'delete':
          {
            newData = order.details.filter(x => x.id !== data.id)
          }
          break;
      }

      newData && mutate({
        ...order,
        details: newData
      }, false);
    }
  }

  const ctx: OrderContextType = {
    order: order,
    salesmans: salesmans,
    customers: customers,
    updateValue: refreshData
  }

  return (
    <Layout home menuActive={1} heading={order && `Order: #${order.id}`}>
      <Head>
        <title>Order - {siteTitle}</title>
      </Head>
      <OrderProvider value={ctx}>
        <OrderForm />
        <div className={'container'}>
          <div className={'row ms-2'}>
            <div onClick={()=>{setShowDetails(true);setShowPayments(false)}} style={tabStyle2} className={'col-auto bg-light rounded-top'}>Details</div>
            <div onClick={()=>{setShowDetails(false);setShowPayments(true)}} style={tabStyle} className={'col-auto bg-light rounded-top'}>Angsuran</div>
          </div>
          <div className={'row border rounded bg-light rounded-3'}>
            {showDetails && <OrderDetailList />}
            {showPayments && <React.Fragment>
              {order && order.payments && order.payments.map((item, i) => {
                  return <p key={`p-key-${i}`}>{item.amount}</p>
              })}
              </React.Fragment>}
          </div>
        </div>
      </OrderProvider>
    </Layout >
  )
}

const tabStyle = {
  cursor: 'pointer',
  marginBottom: -1,
  marginLeft: 0,
  paddingTop: 5,
  paddingBottom: 5,
  //backgroundColor: '#cecece',
  borderBottom: '1px solid #dedede',
  //border: '1px solid #ff0000',
}


const tabStyle2 = {
  cursor: 'pointer',
  marginBottom: -1,
  marginLeft: 0,
  paddingTop: 5,
  paddingBottom: 5,
  //backgroundColor: '#cecece',
  border: '1px solid #dedede',
  borderBottom: 'none',
}
const useOrder = (id: number) => {
  const baseUrl: any = () => id && `/api/orders/${id}`;
  const { data, error, mutate } = useSWR<iOrder, Error>(baseUrl, fetcher, revalidationOptions);

  return {
    order: data, //{id: data?.id as number, name: data?.name as string },
    isLoading: !error && !data,
    isError: error,
    mutate: mutate,
  }

}

export async function getServerSideProps({ req, res }: any) {
  // res.setHeader(
  //   'Cache-Control',
  //   'public, s-maxage=1, stale-while-revalidate=59'
  // );

  const loadSalesmans = async () => {
    const [data, error] = await apiSales.getListSales();

    if (data) {
      return data;
    }
    return [];
  }

  const loadCustomers = async () => {
    const [data, error] = await apiCustomer.getListCustomers();
    if (data) {
      return data;
    }
    return [];
  }

  const salesmans = await loadSalesmans();
  const customers = await loadCustomers();

  // console.log(customers)

  return {
    props: {
      salesmans: salesmans,
      customers: customers
    }
  }
}

const fetcher = async (url: string): Promise<iOrder> => {
  const res = await fetch(url)
  const data: iOrder | any = await res.json()

  if (res.status !== 200) {
    throw new Error(data.message)
  }
  return data;
}

export default orderPage;
