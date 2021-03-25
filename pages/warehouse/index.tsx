import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import useSWR, { mutate } from 'swr'
import Layout, { siteTitle } from '../../components/layout'
import { iWarehouse } from '../../components/interfaces'
import { WarehouseList } from 'components/lists/warehouse-list'
import { initWarehouse } from 'components/forms/warehouse-form'


const Home: React.FunctionComponent = () => {
  const { data: warehouses, error, mutate } = useSWR<iWarehouse[]>(`/api/warehouse`, fetcher, revalidationOptions);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isSelected, setIsSelected] = useState(false);
  //  const [selOptions, setSelOptions] = useState<iSelectOptions[]>([])


  if (error) return <div>{error.message}</div>
  if (!warehouses) return <div>{'Loading...'}</div>

  const selectWarehouse = (i: number) => {
    setIsSelected((i === currentIndex) ? !isSelected : true)
    setCurrentIndex(i)
  }

  const refreshWarehouse = async (method: string, warehouse: iWarehouse, callback: Function) => {
    const url = `/api/warehouse/${warehouse.id}`
    const fetchOptions = {
      method: method,
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      },
      body: JSON.stringify(warehouse)
    }

    const res = await fetch(url, fetchOptions);
    const data: iWarehouse | any = await res.json();

    if (res.status === 200) {
      switch (method) {
        case 'DELETE':
          {
            mutate(warehouses.filter(item => item.id !== warehouse.id), false);
            setCurrentIndex(-1);
          }
          break;
        case 'POST':
          {
            mutate([...warehouses, data], false);
            setCurrentIndex(warehouses && warehouses?.length + 1 || -1)
          }
          break;
        case 'PUT':
          {
            warehouses.splice(currentIndex, 1, data);
            mutate(warehouses, false)
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
    <Layout home menuActive={5} heading={'Data Gudang'}>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      {warehouses && [...warehouses, initWarehouse].map((item: iWarehouse, i: number) => {
        return (
          <WarehouseList
            key={`sup-key-${i}`}
            data={item}
            index={i}
            isSelected={isSelected && currentIndex === i}
            refreshData={refreshWarehouse}
            property={{ onClick: selectWarehouse }} />
        )
      })}
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

const fetcher = async (url: string) => {
  const res = await fetch(url)
  const data: any = await res.json()

  if (res.status !== 200) {
    return alert(data.message)
  }

  return data;
}

export default Home;
