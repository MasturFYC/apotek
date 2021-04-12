import Head from 'next/head'
import React, { useState } from 'react'
import useSWR from 'swr'

import Layout, { siteTitle } from '../../components/layout'
import { iSalesman } from '../../components/interfaces'
import { SalesList } from '../../components/lists/sales-list'
import { SalesMethodType } from '../../components/forms/sales-form'

const revalidationOptions = {
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  refreshWhenOffline: false,
  refreshWhenHidden: false,
  refreshInterval: 0
};

const initSales: iSalesman = {
  id: 0,
  name: '',
  street: '',
  city: '',
  phone: '',
  cell: '',
  zip: ''
}


export default function Home() {
  const { data: sales, error, mutate } = useSWR(`/api/salesman`, fetcher, revalidationOptions);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isSelected, setIsSelected] = useState(false);

  if (error) return <div>{error.message}</div>
  if (!sales) return <div>{'Loading...'}</div>

  const selectSales = (i: number) => {
    setIsSelected((i === currentIndex) ? !isSelected : true)
    setCurrentIndex(i)
  }

  const refreshSales = async (e: SalesMethodType, callback: Function) => {
    const url = `/api/salesman/${e.data.id}`
    const fetchOptions = {
      method: e.method,
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      },
      body: JSON.stringify(e.data)
    }

    const res = await fetch(url, fetchOptions);
    const data: iSalesman | any = await res.json();

    if (res.status === 200) {
      switch (e.method) {
        case 'DELETE':
          {
            mutate(sales.filter(item => item.id !== e.data.id), false);
            setCurrentIndex(-1);
          }
          break;
        case 'POST':
          {
            mutate([...sales, data], false);
            setCurrentIndex(sales && sales?.length + 1 || -1)
          }
          break;
        case 'PUT':
          {
            sales.splice(currentIndex, 1, data);
            mutate(sales, false)
          }
          break;
      }
      callback(data)
    } else {
      callback(null)
      alert(data.message)
    }

  }

  return (
    <Layout home menuActive={3} heading={'Data Sales'}>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <div className={'row container'}>
          {sales && sales.map((item: iSalesman, i: number) => {
            return <SalesList
              key={`cust-key-${i}`}
              data={item}
              index={i}
              isSelected={isSelected && currentIndex === i}
              property={{
                onClick: selectSales
              }}
              refreshData={refreshSales}
            />
          })
          }
      </div>
    </Layout>
  )
}

const fetcher = async (url: string) => {
  const res = await fetch(url)
  const data: any = await res.json()

  if (res.status !== 200) {
    throw new Error(data.message)
  }

  return [...data, initSales];
}