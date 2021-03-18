import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import useSWR, { mutate } from 'swr'
import Layout, { siteTitle } from '../../components/layout'
import { iProduct, iCategory } from '../../components/interfaces'
import Unit from '../../components/unit'

type productType = {
  products: iProduct[] | undefined,
  updateCommand: Function,
  categories: iCategory[]
}

type editParam = {
  productId: number
}

type updateProductParam = {
  data: iProduct,
  updateCommand: Function,
  categories: iCategory[],
  index: number,
}

const fetchCategories = async (url: string): Promise<iCategory[]> => {
  //console.log(url)
  const res = await fetch(url);
  const data: iCategory[] | any = await res.json();

  if (res.status !== 200) {
    throw new Error(data.message)
  }

  //console.log(data)
  return data;
}

export async function getServerSideProps() {
  const data = await fetchCategories('http://localhost:3000/api/category/')
  return { props: { data } }
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
/*
const fetchProduct = async (url: string): Promise<iProduct> => {
  const res = await fetch(url)
  const data: iProduct | any = await res.json()

  if (res.status !== 200) {
    throw new Error(data.message)
  }

  //console.log(data)
  return { ...data };
}
*/


const useCategory = (id: number) => {
  const baseUrl: any = () => id && `/api/category/${id}`;
  const revalidationOptions = {
    //revalidateOnMount: true, //!cache.has(baseUrl), //here we refer to the SWR cache
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  };
  const { data, error, mutate } = useSWR<iCategory, Error>(baseUrl, fetcher, revalidationOptions);
  // const [product, setProduct] = useState({});
  //console.log(data)

  const newProduct: iProduct = {
    id: 0, name: '', code: '', spec: '',
    base_unit: 'kg',
    base_price: 2500.0,
    base_weight: 0.5,
    is_active: true,
    first_stock: 0,
    unit_in_stock: 0,
    supplier_id: 3,
    category_id: data && data.id || 0,
    warehouse_id: 2
  }


  return {
    category: { id: data?.id as number, name: data?.name as string },
    products: data && [...data.products, newProduct],
    isLoading: !error && !data,
    isError: error,
    reload: (p: iProduct) => {
      const newData: iProduct[] = data && [...data?.products] || [];//data && [...data?.products];
      const start: number = findElements(newData, p.id);

      if (start === -1) {
        newData.push(p)
      } else {
        newData.splice(start, 1, p)
      }
      /*

      data?.products.map(item => {
        if (item.id === p.id) {
          newData.push(p)
        } else {
          newData.push(item)
        }
      })

      if (start === -1) {
        newData.push(p)
      }

      */

      //newData && newData[start] = p; //.splice(start, 0, p);
      //console.log(start, 'L - ', p.id, ' Data: ', newData)
      data && mutate({ ...data, products: newData }, false); //{ ...data, products: newData && [...newData] || [p] }, false)
    }
  }
}

function findElements(arr: iProduct[] | undefined, id: number) {
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

const ProductInfo = (product: iProduct) => {
  return (
    <div className={'px-3 py-2'}>
      <strong style={{ cursor: 'pointer' }}>{product.name || 'New Product'}</strong><br />
      Kode: {product.code}, Spec: {product.spec}
    </div>
  )
}


const ShowProducts = ({ products, updateCommand, categories }: productType) => {
  const [currentId, setCurrentId] = useState<number>(-1);
  const refreshData = (p: iProduct) => {
    //  setLastIndex(isNew === true ? index : -1)
    //setSelectedIndex(index);
    const i = currentId;
    //setIndex(-1)
    //console.log(i)
    //setSelected(false)
    //setIndex(-1)
    const timeout = setTimeout(() => {
      //console.log(index)
      //const n = currentProduct && currentProduct.id
      //const p = products?.filter(x => x.id === n)[0]
      //console.log(n, ' => ', p)
      setCurrentId(currentId)
      //      setIndex(selectedIndex)
    }, 1000);

    updateCommand(p);
    return () => {
      clearTimeout(timeout)
      //setIndex(products && products?.length - 1 || -1)
    };
    //setIndex(i)
    //setSelected(true);
  }

  const updateSelectedIndex = (i: number) => {
    //setSelectedIndex(i)
    //setIndex(i)
    setCurrentId(i)
  }

  return (
    <React.Fragment>
      {products && products.map((item: iProduct, i: number) => (
        <div key={i}
          className={`${item.id !== 0 && 'border-bottom'} ${(i % 2 === 0 && 'bg-white rounded-top')}`}
          onClick={() => { updateSelectedIndex(products[i].id) }}
        >{currentId === (products && products[i].id || 0) ?
          <EditProduct data={item} updateCommand={refreshData} categories={categories} index={i} /> :
          <ProductInfo {...item} />}
        </div>
      ))}
    </React.Fragment>
  )
}

type TPageParam = {
  props: any
}

export default function categoryPage({ data: categories }: any) {
  const { query } = useRouter();
  const { category, products, isLoading, isError, reload } = useCategory(parseInt('' + query.id));

  //const refreshProduct = () => {
  //const newArr = data?.products?.filter(o => o.id !== id);
  //const test = [{ ...newArr, p }];
  //data?.products = newArr;
  //reload();
  //}

  if (isError) return <div>{isError.message}</div>
  if (isLoading) return <div>Loading...</div>

  return (
    <Layout home menuActive={1}>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={'bg-white'}>
        <h1 className={'m7-3 py-3'}>{category.name}</h1>
        <section className={'container bg-light border rounded-3 m-0 p-0'}>
          <ShowProducts products={products} updateCommand={reload} categories={categories} />
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

const EditProduct = ({ data, updateCommand, categories, index }: updateProductParam) => {
  const [product, setProduct] = useState(data);
  /*
  const baseUrl: any = () => `/api/product/${productId}`;
  const { data, error } = useSWR<iProduct, Error>(
    baseUrl,
    fetcher
  );
    */
  //if (error) return <div>{error.message}</div>
  //if (!data) return <div>Loading...</div>

  const updateData = async (url: string, p: iProduct) => {
    //console.log('before update: ', p)
    const res = await fetch(url, {
      method: p.id === 0 ? 'POST' : 'PUT',
      body: JSON.stringify(p)
    })

    const data: any = await res.json()
    //console.log('after update: ', data)

    if (res.status !== 200) {
      throw new Error(data.message)
    } else {
      //updateIndex(false)
      updateCommand(data)
      //updateIndex(true)
    }

    return data
  }

  const sendData = async () => {
    const baseUrl = `/api/product/${product.id}`;
    const newData = await updateData(baseUrl, product);
    //setProduct(newData)
    //console.log(newData);
  }

  return (
    <div className={`${index % 2 === 0 && 'rounded-top '}bg-white p-3 m-0`}>
      <table style={{ width: '100%' }}>
        <tbody>
          <tr>
            <td>Nama:</td>
            <td><input type="text" autoFocus value={product.name}
              onChange={e => setProduct({ ...product, name: e.target.value })} /></td>
          </tr>
          <tr>
            <td>Kode:</td>
            <td><input type="text" value={product.code}
              onChange={e => setProduct({ ...product, code: e.target.value })} /></td>
          </tr>
          <tr>
            <td>Spec:</td>
            <td><input type="text" value={product.spec}
              onChange={e => setProduct({ ...product, spec: e.target.value })}
            /></td>
          </tr>
          <tr>
            <td>Harga:</td>
            <td><input type="text" value={product.base_price}
              onChange={e => setProduct({ ...product, base_price: parseFloat(e.target.value) })}
            /></td>
          </tr>
          <tr>
            <td>Kategori:</td>
            <td><select value={product.category_id}
              onChange={e => {
                //console.log(e.target.value)
                const i: number = parseInt(e.target.value)
                setProduct({ ...product, category_id: i })
              }
              }
            >
              {categories && categories.map((item, index) => <option key={index} value={item.id}>{item.name}</option>)
              }
            </select></td>
          </tr>
          <tr>
            <td colSpan={2}>
              <Unit product={product} />
            </td>
          </tr>
        </tbody>
      </table>
      <button onClick={(e) => sendData()} className='btn btn-outline-dark mt-3'>
        Save Data
      </button>
    </div>
  )
}
