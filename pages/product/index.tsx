import Head from 'next/head'
//import { useRouter } from 'next/router'
import React from 'react'
//import useSWR from 'swr'
import Layout, { siteTitle } from '../../components/layout'
import { iProduct /*, iCategory, iSupplier, iWarehouse */ } from '../../components/interfaces'
import { DivRow } from 'components/styles'
// import { ShowProducts } from '../../../components/forms/product-fom'
// import { PropertyContextType, PropertyProvider } from '../../../components/context/propery-context'
//import { revalidationOptions } from '../../components/fetcher'

export default function Home() {
  const [limit, setLimit] = React.useState(5);
  const [offset, setOffset] = React.useState(0);
  const [products, setProducts] = React.useState<iProduct[]>([]);

  React.useEffect(() => {
    let isLoaded = false;

    const loadData = async () => {
      if (!isLoaded) {
        const baseUrl = `/api/product/limit-offset/${limit}/${offset}`;
        const res = await fetch(baseUrl);
        const data: iProduct[] | any = await res.json();
        if(res.status === 200 && data) {
          setProducts([...products, ...data])
        }
      }
    }

    loadData();

    return () => { isLoaded = true; }
  }, [limit, offset])

  return (
    <Layout home menuActive={1} heading={'Data Barang'}>
      <Head>
        <title>Poducts - {siteTitle}</title>
      </Head>
      <ShowProducts productLists={products} />
    </Layout>
  )
}

const ShowProducts: React.FunctionComponent<{ productLists: iProduct[] }> =
  ({ productLists }) => {
    return (
      <React.Fragment>
        {productLists && productLists.map((p: iProduct, i: number) => (
            <DivRow key={`p-${i}`}>Test: {p.name}</DivRow>
          )
        )}
      </React.Fragment>
    )
  }

