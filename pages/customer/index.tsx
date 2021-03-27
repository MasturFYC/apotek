import Head from 'next/head'
import React, { useState } from 'react'
import useSWR, { mutate } from 'swr'
import Layout, { siteTitle } from 'components/layout'
import { iCustomer, iRayon } from 'components/interfaces'
import { initCustomer } from 'components/forms/customer-form'
import { CustomerList } from 'components/lists/customer-list'
import { revalidationOptions } from 'components/fetcher'


export default function Home() {
  const { data: customers, error, mutate } = useSWR<iCustomer[]>(`/api/customer`, fetcher, revalidationOptions);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isSelected, setIsSelected] = useState(false);
  const [rayons, setRayons] = useState<iRayon[]>([])

  React.useEffect(() => {
    let isLoaded = false;

    const loadRayon = async () => {
      const res = await fetch('/api/rayon')
      const data: iRayon[] | any = await res.json();

      if (res.status !== 200) {
        alert(data.message)
      } else {
        setRayons(data)
      }
    }
    if (!isLoaded) {
      loadRayon()
    }

    return () => {
      isLoaded = true
    }
  }, [])


  if (error) return <div>{error.message}</div>
  if (!customers) return <div>{'Loading...'}</div>

  const selectCustomer = (i: number) => {
    setIsSelected((i === currentIndex) ? !isSelected : true)
    setCurrentIndex(i)
    // dispatchSelectedColor({
    //   index: i,
    //   currentIndex: i,
    //   isSelected: (i === currentIndex) ? !isSelected : true
    // })
  }

  const refreshCustomer = async (e: { method: string, data: iCustomer }, callback: Function) => {
    const url = `/api/customer/${e.data.id}`
    const fetchOptions = {
      method: e.method,
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      },
      body: JSON.stringify(e.data)
    }

    const res = await fetch(url, fetchOptions);
    const data: iCustomer | any = await res.json();

    if (res.status === 200) {
      switch (e.method) {
        case 'DELETE':
          {
            mutate(customers.filter(item => item.id !== e.data.id), false);
            setCurrentIndex(-1);
          }
          break;
        case 'POST':
          {
            mutate([...customers, data], false);
            setCurrentIndex(customers.length + 1 || -1)
          }
          break;
        case 'PUT':
          {
            customers.splice(currentIndex, 1, data);
            mutate(customers, false)
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
    <Layout home menuActive={0} heading={'Data Pelanggan'}>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      {customers && [...customers, initCustomer].map((item: iCustomer, i: number) => {
        return <CustomerList
          key={`cust-key-${i}`}
          data={item}
          index={i}
          refreshData={refreshCustomer}
          rayons={rayons}
          isSelected={isSelected && currentIndex === i}
          property={{ onClick: selectCustomer }} />
      })}
    </Layout>
  )
}

const fetcher = async (url: string) => {
  const res = await fetch(url)
  const data: any = await res.json()

  if (res.status !== 200) {
    throw new Error(data.message)
  }

  return data;
}


// type colorReducerType = {
//   color: string;
//   index: number;
//   currentIndex: number;
//   isSelected: boolean;
// }

// const backColors: string[] = ['#f8f9fa', '#e9ecef', '#f1f8ff']
// const initSelected: colorReducerType = {
//   color: backColors[0],
//   index: 0,
//   currentIndex: -1,
//   isSelected: false
// }

// type colorReducerAction = {
//   index: number;
//   currentIndex: number;
//   isSelected: boolean;
// }
