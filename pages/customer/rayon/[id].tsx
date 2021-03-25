import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import useSWR, { mutate } from 'swr'
import Layout, { siteTitle } from '../../../components/layout'
import { iCustomer, iRayon } from '../../../components/interfaces'
import { initCustomer, iSelectOptions } from '../../../components/forms/customer-form'
import { CustomerList } from '../../../components/lists/customer-list'
import { initRayon } from 'components/forms/rayon-form'


const revalidationOptions = {
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  refreshWhenOffline: false,
  refreshWhenHidden: false,
  refreshInterval: 0
};

export default function CustomerByRayon() {
  const { query } = useRouter();
  const { rayon, isLoading, isError, mutate } = useRayon('' + query.id);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isSelected, setIsSelected] = useState(false);

  const [selOptions, setSelOptions] = useState<iSelectOptions[]>([])
  React.useEffect(() => {
    let isLoaded = false;

    const loadRayon = async () => {
      const res = await fetch('/api/rayon')
      const data: iRayon[] | any = await res.json();

      if (res.status !== 200) {
        alert(data.message)
      } else {
        setSelOptions(data.map((item: iRayon, i: number) => ({
          value: item.id,
          label: item.name
        }
        )))
      }
    }

    if (!isLoaded) {
      loadRayon()
    }

    return () => {
      isLoaded = true
    }
  }, [isLoading])

  if (isError) return <div>{isError.message}</div>
  if (isLoading) return <div>{'Loading...'}</div>

  const selectCustomer = (i: number) => {
    setIsSelected((i === currentIndex) ? !isSelected : true)
    setCurrentIndex(i)
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
      if (rayon && rayon.customers) {
        switch (e.method) {
          case 'DELETE':
            {
              mutate({ ...rayon, customers: rayon.customers.filter(item => item.id !== e.data.id) }, false);
              setCurrentIndex(-1);
            }
            break;
          case 'POST':
            {
              mutate({ ...rayon, customers: [...rayon.customers, data] }, false);
              setCurrentIndex(rayon.customers.length + 1 || -1)
            }
            break;
          case 'PUT':
            {
              rayon.customers.splice(currentIndex, 1, data);
              mutate(initRayon, false)
            }
            break;
        }
        callback(data)
      }
    } else {
      callback(null)
      alert(data.message)
    }


  }

  return (
    <Layout home menuActive={0} heading={`Rayon ${rayon?.name}`}>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      {rayon && rayon.customers && [...rayon.customers, initCustomer].map((item: iCustomer, i: number) => {
        return <CustomerList
          key={`cust-key-${i}`}
          data={item}
          index={i}
          refreshData={refreshCustomer}
          selOptions={selOptions}
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


const useRayon = (id: string | number) => {
  const baseUrl: any = () => id && `/api/rayon/${id}`;
  const { data, error, mutate } = useSWR<iRayon, Error>(baseUrl, fetcher, revalidationOptions);

  return {
    rayon: data,
    isLoading: !error && !data,
    isError: error,
    mutate: mutate,
  }

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


// type CustomerProperty = {
//   backColor?: string;
//   borderColor?: string;
//   onClick: (i: number) => void;
// }

// export type CustomerListType = {
//   data: iCustomer;
//   index: number;
//   property?: CustomerProperty;
//   isSelected: boolean;
//   selOptions: iSelectOptions[];
//   refreshData: (e: { method: string, data: iCustomer }, callback: Function) => void
// }
