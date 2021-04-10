import Head from 'next/head'
import React, { useState } from 'react'
import useSWR from 'swr'
import Layout, { siteTitle } from '../../components/layout'
import { iRayon } from '../../components/interfaces'
import { RayonList } from '../../components/lists/rayon-list'
import { initRayon } from '../../components/forms/rayon-form'


const Home: React.FunctionComponent = () => {
  const { data: rayons, error, mutate } = useSWR<iRayon[]>(`/api/rayon`, fetcher, revalidationOptions);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isSelected, setIsSelected] = useState(false);
  //  const [selOptions, setSelOptions] = useState<iSelectOptions[]>([])


  if (error) return <div>{error.message}</div>
  if (!rayons) return <div>{'Loading...'}</div>

  const selectRayon = (i: number) => {
    setIsSelected((i === currentIndex) ? !isSelected : true)
    setCurrentIndex(i)
  }

  const refreshRayon = async (method: string, rayon: iRayon, callback: Function) => {
    const url = `/api/rayon/${rayon.id}`
    const fetchOptions = {
      method: method,
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      },
      body: JSON.stringify(rayon)
    }

    const res = await fetch(url, fetchOptions);
    const data: iRayon | any = await res.json();

    if (res.status === 200) {
      switch (method) {
        case 'DELETE':
          {
            mutate(rayons.filter(item => item.id !== rayon.id), false);
            setCurrentIndex(-1);
          }
          break;
        case 'POST':
          {
            mutate([...rayons, data], false);
            setCurrentIndex(rayons && rayons?.length + 1 || -1)
          }
          break;
        case 'PUT':
          {
            rayons.splice(currentIndex, 1, data);
            mutate(rayons, false)
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
    <Layout home menuActive={6} heading={'Data Rayon'}>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      {rayons && [...rayons, initRayon].map((item: iRayon, i: number) => {
        return (
          <RayonList
            key={`sup-key-${i}`}
            data={item}
            index={i}
            isSelected={isSelected && currentIndex === i}
            refreshData={refreshRayon}
            property={{ onClick: selectRayon }} />
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
