import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import useSWR, { mutate } from 'swr'
import Layout, { siteTitle } from '../../../components/layout'
import { iCategory, iProduct, iSupplier, iWarehouse } from '../../../components/interfaces'
import apiCategory from '../../api/models/category.model'
import apiWarehouse from '../../api/models/warehouse.model'
import apiSupplier from '../../api/models/supplier.model'
import { ShowProducts } from '../../../components/forms/product'
import { PropertyContextType, PropertyProvider } from '../../../components/context/propery-context'

type supplierPageParam = {
  supplier: iSupplier;
  categories: iCategory[];
  suppliers: iSupplier[];
  warehouses: iWarehouse[];
}

const Home: React.FunctionComponent<supplierPageParam> = ({ categories, suppliers, warehouses }) => {
  const { query } = useRouter();
  const { supplier, isLoading, isError, mutate } = useSupplier(parseInt('' + query.id));

  if (isError) return <div>{isError.message}</div>
  if (isLoading) return <div>Loading...</div>

  const refreshData = (data: iProduct, method: string) => {
    if (supplier && supplier.products) {
      let newData: iProduct[] | undefined;
      switch (method) {
        case 'insert':
          {
            newData = [...supplier.products, data];
          }
          break;
        case 'update':
          {
            const index: number = findElements(supplier.products, data.id);
            newData = supplier.products.filter(x => x.id !== data.id)
            newData.splice(index, 0, data)
          }
          break;
        case 'delete':
          {
            newData = supplier.products.filter(x => x.id !== data.id)
          }
          break;
      }
      newData && mutate({ ...supplier, products: newData }, false);
    }
  }
  const childParam: PropertyContextType = {
    products: supplier && supplier.products || undefined,
    categories: categories,
    suppliers: suppliers,
    warehouses: warehouses,
    updateValue: refreshData
  };

  return (
    <Layout home menuActive={1} heading={supplier && supplier.name}>
      <Head>
        <title>Poduct by supplier - {siteTitle}</title>
      </Head>
      <PropertyProvider value={childParam}>
        <ShowProducts />
      </PropertyProvider>
    </Layout>
  )
}


const useSupplier = (id: number) => {
  const baseUrl: any = () => id && `/api/supplier/${id}`;
  const revalidationOptions = {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshWhenOffline: false,
    refreshWhenHidden: false,
    refreshInterval: 0
  };
  const { data, error, mutate } = useSWR<iSupplier, Error>(baseUrl, fetcher, revalidationOptions);

  return {
    supplier: data, //{id: data?.id as number, name: data?.name as string },
    isLoading: !error && !data,
    isError: error,
    mutate: mutate,
  }

}

function findElements(arr: iProduct[], id: number) {
  let index = -1;

  if (arr) {
    for (var j = 0; j < arr.length; j++) {
      if (arr[j].id === id) {
        index = j;
        break;
      }
    }
  }

  return index;
}


export async function getServerSideProps({ query }: any) {
  /*
    const loadsupplier = async () => {
      const [data,error] = await apisupplier.getsupplier(+query.id)
      if(data) {
        return data;
      }
      return null;
    }
  */

  const loadCategories = async () => {
    const [data, error] = await apiCategory.getListCategories();
    if (data) {
      return data;
    }
    return [];
  }

  const loadSuppliers = async () => {
    const [data, error] = await apiSupplier.getListSuppliers();
    if (data) {
      return data;
    }
    return [];
  }

  const loadWarehouses = async () => {
    const [data, error] = await apiWarehouse.getListWarehouses();
    if (data) {
      return data;
    }
    return [];
  }

  // const supplier = await loadsupplier()
  const categories = await loadCategories();
  const suppliers = await loadSuppliers();
  const warehouses = await loadWarehouses();

  return {
    props: {
      categories: categories,
      suppliers: suppliers,
      warehouses: warehouses
    }
  }
}

const fetcher = async (url: string): Promise<iSupplier> => {
  const res = await fetch(url)
  const data: iSupplier | any = await res.json()

  if (res.status !== 200) {
    throw new Error(data.message)
  }

  //console.log(data)
  return data;
}

export default Home;
