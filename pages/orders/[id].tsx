import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import useSWR, { mutate } from 'swr'
import Layout, { siteTitle } from '../../components/layout'
import { iOrder, iCustomer, iSalesman, iOrderDetail, iDataList, iPayment, iPaymentMethod } from '../../components/interfaces'
import { OrderContextType, OrderProvider } from '../../components/context/order-context'
import { revalidationOptions } from 'components/fetcher'
import apiSales from '../api/models/salesman.model'
import apiSupplier from 'pages/api/models/supplier.model'
import apiCustomer from '../api/models/customer.model'
import { OrderForm } from '../../components/forms/order-form'
import PaymentList from '../../components/lists/payment-list'
import { OrderDetailList } from 'components/lists/order-details'
import { DivRow, TabStyle } from 'components/styles'
import NumberFormat from 'react-number-format'
import apiPayment from 'pages/api/models/payment.model'
import SearchProductForDetail from 'components/forms/search-for-detail-fom'

type OrderPageParam = {
  methods: iPaymentMethod[];
  customers: iDataList[];
  salesmans: iDataList[];
}

const orderPage: React.FunctionComponent<OrderPageParam> = ({ salesmans, customers, methods }) => {
  const { query } = useRouter();
  const { order, isLoading, isError, mutate } = useOrder(parseInt('' + query.id));
  const [tab, setTab] = React.useState(0);

  const refreshData = async (data: iOrderDetail, method: string, callback?: (data: iOrderDetail | null) => void) => {

    const res = await fetch(`/api/order-detail/${data.id}`, {
      method: method,
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      },
      body: JSON.stringify({
        data: method === 'DELETE' ? data.id : data
      })
    })

    const ret: any | iOrderDetail = await res.json();

    //console.log(ret)
    if (res.status !== 200) {

      alert(ret.message)
      callback && callback(null)

    } else {

      //ret.product = data.product;

      if (order && order.details) {
        switch (method) {
          case 'POST':
            {

              data.id = ret.id;

              mutate({
                ...order,
                total: (+order.total) + (+ret.subtotal),
                remainPayment: (+order.remainPayment) + (+ret.subtotal),
                details: [...order.details, data]
              }, false)

              //console.log(order)

            }
            break;

          case 'PUT':
            {
              let index: number = -1;
              let delDetail: iOrderDetail | undefined;
              for (var j = 0; j < order.details.length; j++) {
                if (order.details[j].id === data.id) {
                  index = j;
                  delDetail = order.details[j];
                  break;
                }
              }

              if (delDetail) {
                order.details.splice(index, 1, data);
                mutate({
                  ...order,
                  total: (+order.total) + (+data.subtotal) - (+delDetail.subtotal),
                  remainPayment: (+order.remainPayment) + (+data.subtotal) - (+delDetail.subtotal)
                }, false)
              }
            }
            break;

          case 'DELETE':
            {
              const delDetail = order.details.filter(x => x.id === data.id)[0];
              order.total = (+order.total) - (+delDetail.subtotal);
              order.remainPayment = (+order.remainPayment) - (+delDetail.subtotal);
              //console.log(order)
              mutate({
                ...order,
                //total: order.total - delDetail.subtotal,
                //remainPayment: order.remainPayment - delDetail.subtotal,
                details: order.details.filter(x => x.id !== delDetail.id)
              }, false)
            }
            break;
        }
      }
      callback && callback(ret);
    }
  }


  if (isError) return <div>{isError.message}</div>
  if (isLoading) return <div>Loading...</div>

  const ctx: OrderContextType = {
    order: order,
    salesmans: salesmans,
    customers: customers,
    methods: methods,
    updateValue: refreshData,
    mutate: mutate
  }

  return (
    <Layout home menuActive={1} heading={order && `Order: #${order.id}`}>
      <Head>
        <title>Order - {siteTitle}</title>
      </Head>
      <OrderProvider value={ctx}>
        <OrderForm />
        <div className={'container mt-5'}>
          <div className={'row ms-2'}>
            <TabStyle isSelected={tab===0} onClick={() => setTab(0)} className={'col-auto rounded-top'}>Details</TabStyle>
            <TabStyle isSelected={tab===1} onClick={() => setTab(1)} className={'col-auto rounded-top'}>Angsuran</TabStyle>
            <TabStyle isSelected={tab===2} onClick={() => setTab(2) } className={'col-auto rounded-top'}>Cari Produk</TabStyle>
          </div>
        </div>
        <div className={'container border-top bg-white pt-3'}>
          {tab===0 && <OrderDetailList />}
          {tab===1 && <PaymentList />}
          {tab===2 && <SearchProductForDetail />}
        </div>
      </OrderProvider>
    </Layout >
  )
}

const useOrder = (id: number) => {
  const baseUrl: any = () => id && `/api/orders/${id}`;
  const { data, error, mutate } = useSWR<iOrder, Error>(baseUrl, fetcher, revalidationOptions);

  //console.log()
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

  const loadMethods = async () => {
    const [data, error] = await apiPayment.getMethods();
    if (data) {
      return data;
    }
    return [];
  }

  const methods = await loadMethods();
  const salesmans = await loadSalesmans();
  const customers = await loadCustomers();

  // console.log(customers)

  return {
    props: {
      methods: methods,
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
