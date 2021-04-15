import Head from 'next/head'
import { useRouter } from 'next/router'
import React from 'react'
import useSWR from 'swr'
import Layout, { siteTitle } from '../../../components/layout'
import { iProduct, iCategory, iSupplier, iWarehouse } from '../../../components/interfaces'
import apiCategory from '../../api/models/category.model'
import apiWarehouse from '../../api/models/warehouse.model'
import apiSupplier from '../../api/models/supplier.model'
import { ShowProducts } from '../../../components/forms/product-fom'
import { PropertyContextType, PropertyProvider } from '../../../components/context/propery-context'
import { revalidationOptions } from '../../../components/fetcher'

type CategoryPageParam = {
  category: iCategory;
  categories: iCategory[];
  suppliers: iSupplier[];
  warehouses: iWarehouse[];
}

const categoryPage: React.FunctionComponent<CategoryPageParam> = 
({ categories, suppliers, warehouses }) => {
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
  
  const childParam: PropertyContextType = {
    products: category && category.products || undefined,
    categories: categories,
    suppliers: suppliers,
    warehouses: warehouses,
    updateValue: refreshData
  };

  return (
    <Layout home menuActive={1} heading={category && category.name}>
      <Head>
        <title>Poduct by category - {siteTitle}</title>
      </Head>
      <PropertyProvider value={childParam}>
        <ShowProducts />
      </PropertyProvider>
    </Layout>
  )
}


const useCategory = (id: number) => {
  const baseUrl: any = () => id && `/api/category/${id}`;
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


export async function getServerSideProps({ res }: any) {
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=1, stale-while-revalidate=59'
  );

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
    return error;
  }

  const loadSuppliers = async () => {
    const [data, error] = await apiSupplier.getListSuppliers();
    if (data) {
      return data;
    }
    return error;
  }

  const loadWarehouses = async () => {
    const [data, error] = await apiWarehouse.getListWarehouses();
    if (data) {
      return data;
    }
    return error;
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
