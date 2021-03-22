import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import useSWR, { mutate } from 'swr'
import Layout, { siteTitle } from '../../components/layout'
import { iProduct, iCategory, iSupplier, iWarehouse } from '../../components/interfaces'
import apiCategory from '../api/models/category.model'
import apiWarehouse from '../api/models/warehouse.model'
import apiSupplier from '../api/models/supplier.model'
import { ShowProducts } from '../../components/forms/product'
import { PropertyContextType, PropertyProvider } from '../../components/context/propery-context'

type CategoryPageParam = {
  category: iCategory;
  categories: iCategory[];
  suppliers: iSupplier[];
  warehouses: iWarehouse[];
}

const categoryPage: React.FunctionComponent<CategoryPageParam> = ({categories, suppliers, warehouses }) => {
  const { query } = useRouter();
  const { category, isLoading, isError, mutate } = useCategory(parseInt('' + query.id));

  if (isError) return <div>{isError.message}</div>
  if (isLoading) return <div>Loading...</div>

  const refreshData = (data: iProduct, method: string) => {
    if (category && category.products) {
      let newData: iProduct[] | undefined;
      switch (method) {
        case 'insert':
          {
            newData = [...category.products, data];
          }
          break;
        case 'update':
          {
            const index: number = findElements(category.products, data.id);
            newData = category.products.filter(x => x.id !== data.id)
            newData.splice(index, 0, data)
          }
          break;
        case 'delete':
          {
            newData = category.products.filter(x => x.id !== data.id)
          }
          break;
      }
      newData && mutate({ ...category, products: newData }, false);
    }
  }
  const childParam: PropertyContextType =  {
    products: category && category.products || undefined,
    categories: categories,
    suppliers: suppliers,
    warehouses: warehouses,
    updateValue: refreshData
  };

  return (
    <Layout home menuActive={1} heading={category && category.name}>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={'bg-white'}>
        <section className={'container bg-light border rounded-3 m-0 p-0'}>
          <PropertyProvider value={childParam}>
            <ShowProducts />
          </PropertyProvider>
        </section>
        <div className={'mt-3'}>
          <Link href="/">
            Go Back
        </Link>
        </div>
      </section>
    </Layout>
  )
}


const useCategory = (id: number) => {
  const baseUrl: any = () => id && `/api/category/${id}`;
  const revalidationOptions = {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshWhenOffline: false,
    refreshWhenHidden: false,
    refreshInterval: 0
  };
  const { data, error, mutate } = useSWR<iCategory, Error>(baseUrl, fetcher, revalidationOptions);

  return {
    category: data, //{id: data?.id as number, name: data?.name as string },
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
  const loadCategory = async () => {
    const [data,error] = await apiCategory.getCategory(+query.id)
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

 // const category = await loadCategory()
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

const fetcher = async (url: string): Promise<iCategory> => {
  const res = await fetch(url)
  const data: iCategory | any = await res.json()

  if (res.status !== 200) {
    throw new Error(data.message)
  }

  //console.log(data)
  return data;
}

export default categoryPage;
