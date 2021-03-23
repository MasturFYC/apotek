import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import useSWR, { mutate } from 'swr'
import Layout, { siteTitle } from '../../../components/layout'
import { iSalesman, iOrder } from '../../../components/interfaces'
import { DivHead, DivRow } from 'components/styles'

const categoryPage: React.FunctionComponent = () => {
  const { query } = useRouter();
  const { salesman, isLoading, isError, mutate } = useSalesman(parseInt('' + query.id));

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

  const ShowSales: React.FunctionComponent<{ sales?: iSalesman }> = ({ sales }) => (
    <div className={'row'}>
      <div className={'col-md-9 col-sm-9'}>
        <DivHead>
          <h4>{sales?.name}</h4>
          <p>{sales?.street} - {sales?.city}{sales?.zip && `, ${sales?.zip}`}<br />
            Telp. {sales?.phone}{sales?.cell && ` / ${sales?.cell}`}
          </p>
        </DivHead>
        <ShowOrders orders={sales?.orders} />
      </div>
      <div className={'col-md-3 co-sm-3'}>
        <div>Add New Order</div>
      </div>
    </div >
  )

  const ShowOrders: React.FunctionComponent<{ orders?: iOrder[] }> = ({ orders }) => {

    return (
      <>
        {orders && orders.map((item: iOrder, index: number) => {

          <DivRow key={`key-order-${index}`}>
            <div>{item.id}</div>
            <div>{item.createdAt ?? ''}</div>
          </DivRow>

        })}
      </>
    )
  }

  return (
    <Layout home menuActive={3} heading={'Sales Order'}>
      <Head>
        <title>Order by Sales - {siteTitle}</title>
      </Head>
      <section className={'container bg-white'}>
        <ShowSales sales={salesman} />
      </section>
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

export default categoryPage;
