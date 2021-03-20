import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import useSWR, { mutate } from 'swr'
import Layout, { siteTitle } from '../../components/layout'
import { iProduct, iCategory, iSupplier, iWarehouse } from '../../components/interfaces'
import Unit from '../../components/unit'
import apiCategory from '../api/models/category.model'
import apiWarehouse from '../api/models/warehouse.model'
import apiSupplier from '../api/models/supplier.model'

type productType = {
  products: iProduct[] | undefined,
  updateCommand: (e: reloadParam) => void,
  categories: iCategory[],
  suppliers: iSupplier[],
  warehouses: iWarehouse[]
}

type editParam = {
  productId: number
}

type reloadParam = {
  data: iProduct,
  method: string
}

type updateProductParam = {
  data: iProduct,
  updateCommand: (e: reloadParam) => void,
  categories: iCategory[],
  suppliers: iSupplier[],
  warehouses: iWarehouse[],
  index: number,
}

type TPageParam = {
  props: any
}

const initProduct = (categoryId: number): iProduct => ({
  id: 0,
  name: '',
  code: '',
  spec: '',
  base_unit: '',
  base_price: 0,
  base_weight: 0,
  is_active: true,
  first_stock: 0,
  unit_in_stock: 0,
  supplier_id: 0,
  category_id: 0,
  warehouse_id: 0
})


export default function categoryPage({ categories, suppliers, warehouses }: any) {
  const { query } = useRouter();
  const { category, isLoading, isError, mutate } = useCategory(parseInt('' + query.id));

  if (isError) return <div>{isError.message}</div>
  if (isLoading) return <div>Loading...</div>

  const refreshData = (e: reloadParam) => {
    //    reload(e)
    if (category && category.products) {
      let newData: iProduct[] | undefined;
      switch (e.method) {
        case 'insert':
          {
            newData = category.products;
            newData.push(e.data);
          }
          break;
        case 'update':
          {
            const index: number = findElements(category.products, e.data.id);
            newData = category.products.filter(x => x.id !== e.data.id)
            newData.splice(index, 0, e.data)
          }
          break;
        case 'delete':
          {
            newData = category.products.filter(x => x.id !== e.data.id)
          }
          break;
      }
      newData && mutate({ ...category, products: newData }, false);
    }
  }

  return (
    <Layout home menuActive={1} heading={category && category.name}>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={'bg-white'}>
        <section className={'container bg-light border rounded-3 m-0 p-0'}>
          <ShowProducts
            products={category && ([...category.products, initProduct(category.id)] || [initProduct(category.id)])}
            updateCommand={(e) => refreshData(e)}
            categories={categories}
            suppliers={suppliers}
            warehouses={warehouses} />
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


const ShowProducts = ({ products, updateCommand, categories, suppliers, warehouses }: productType) => {
  const [currentId, setCurrentId] = useState<number>(-1);

  const refreshData = (p: iProduct, method: string) => {

    const i = currentId;
    const timeout = setTimeout(() => {
      setCurrentId(currentId)
    }, 1000);

    updateCommand({ data: p, method: method });

    return () => {
      clearTimeout(timeout)
    };
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
        >{currentId === (products && products[i].id || 0) ?
          <EditProduct data={item} updateCommand={(e) => refreshData(e.data, e.method)}
            suppliers={suppliers}
            categories={categories}
            warehouses={warehouses}
            index={i} /> :
          <ProductInfo product={item} onSelect={() => updateSelectedIndex(products[i].id)} />}
        </div>
      ))}
    </React.Fragment>
  )
}

const EditProduct = ({ data, updateCommand, categories, suppliers, warehouses, index }: updateProductParam) => {
  const [product, setProduct] = useState<iProduct>(initProduct(0));
  const [defaultPriceChanged, setDefaultPriceChanged] = useState(0)
  const [defaultWeightChanged, setDefaultWeightChanged] = useState(0)

  React.useEffect(() => {
    let isLoaded = false;

    if (!isLoaded) {
      setProduct(data)
    }

    return () => {
      isLoaded = true;
    }
  }, [data])

  const formSubmit = async (e: React.FormEvent) => {
    const baseUrl = `/api/product/${product.id}`;

    e.preventDefault();

    console.log(product.id)

    const res = await fetch(baseUrl, {
      method: product.id === 0 ? 'POST' : 'PUT',
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      },
      body: JSON.stringify(product)
    })

    const data: any = await res.json()

    if (res.status !== 200) {
      alert(data.message)
    } else {
      updateCommand({ data: data, method: product.id === 0 ? 'insert' : 'update' })
      setProduct(data)
    }

    return false;
  }

  const deleteData = async (e: React.MouseEvent) => {
    const baseUrl = `/api/product/${product.id}`;

    e.preventDefault();

    const res = await fetch(baseUrl, {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      }
    })

    const data: any = await res.json()

    if (res.status !== 200) {
      alert(data.message)
    } else {
      updateCommand({ data: product, method: 'delete' })
    }

    return false;
  }


  return (
    <form onSubmit={(e) => formSubmit(e)}>
      <div className={`${index % 2 === 0 && 'rounded-top'} container ps-3 pt-2 border-bottom mb-3`}
        style={{ backgroundColor: '#f1f8ff' }}>
        <h3>{product.name}</h3>
      </div>
      <div className={`form-floating container g-3 my-3`}>
        <div className={'row'}>
          <div className={'col-md-6 form-floating mb-3'}>
            <input autoFocus type="text" className={'form-control'}
              id={ids[0]}
              placeholder={labels[0]}
              value={product.name}
              onChange={e => setProduct({ ...product, name: e.target.value })} />
            <label htmlFor={ids[0]} className={'col-form-label mx-2'}>{labels[0]}</label>
          </div>

          <div className={'col-md-6 form-floating mb-3'}>
            <input className={'form-control'} type="text"
              id={ids[1]}
              placeholder={labels[1]}
              value={product.code}
              onChange={e => setProduct({ ...product, code: e.target.value })} />
            <label htmlFor={ids[1]} className={'col-form-label mx-2'}>{labels[1]}</label>
          </div>

          <div className={'col-md-6 form-floating mb-3'}>
            <input className={'form-control'} type="text"
              id={ids[2]}
              placeholder={labels[2]}
              value={product.spec}
              onChange={e => setProduct({ ...product, spec: e.target.value })} />
            <label htmlFor={ids[2]} className={'col-form-label mx-2'}>{labels[2]}</label>
          </div>

          <div className={'col-md-6 form-floating mb-3'}>
            <input className={'form-control'} type="text"
              id={ids[3]}
              placeholder={labels[3]}
              value={product.base_unit}
              onChange={e => setProduct({ ...product, base_unit: e.target.value })}
            />
            <label htmlFor={ids[3]} className={'col-form-label mx-2'}>{labels[3]}</label>
          </div>

          <div className={'col-md-6 form-floating mb-3'}>
            <input className={'form-control'} type="text"
              id={ids[4]}
              placeholder={labels[4]}
              value={product.base_price === 0 ? '' : product.base_price}
              onChange={e => {
                setDefaultPriceChanged(+e.target.value)
                setProduct({ ...product, base_price: +e.target.value });
              }}
            />
            <label htmlFor={ids[4]} className={'col-form-label mx-2'}>{labels[4]}</label>
          </div>

          <div className={'col-md-6 form-floating mb-3'}>
            <input className={'form-control'} type="text"
              id={ids[5]}
              placeholder={labels[5]}
              value={product.base_weight === 0 ? '' : product.base_weight}
              onChange={e => {
                setDefaultWeightChanged(+e.target.value);
                setProduct({ ...product, base_weight: +e.target.value });
              }}
            />
            <label htmlFor={ids[5]} className={'col-form-label mx-2'}>{labels[5]}</label>
          </div>

          <div className={'col-md-6 form-floating mb-3'}>
            <select className={'form-control'}
              aria-label="Floating label select example"
              id={ids[7]}
              placeholder={labels[7]}
              value={product.category_id}
              style={{ marginBottom: 2 }}
              onChange={e => {
                const i: number = parseInt(e.target.value)
                setProduct({ ...product, category_id: i })
              }}>{
                categories && categories.map((item, index) => <option key={index} value={item.id}>{item.name}</option>)
              }</select>
            <label htmlFor={ids[7]} className={'col-form-label mx-2'}>{labels[7]}</label>
          </div>

          <div className={'col-md-6 form-floating mb-3'}>
            <select className={'form-control'}
              aria-label="Floating label select example"
              id={ids[8]}
              placeholder={labels[8]}
              value={product.supplier_id}
              style={{ marginBottom: 2 }}
              onChange={e => {
                setProduct({ ...product, supplier_id: +e.target.value })
              }}>{
                suppliers && suppliers.map((item, index) => <option key={index} value={item.id}>{item.name}</option>)
              }</select>
            <label htmlFor={ids[8]} className={'col-form-label mx-2'}>{labels[8]}</label>
          </div>

          <div className={'col-md-6 form-floating mb-3'}>
            <select className={'form-control'}
              aria-label="Floating label select example"
              id={ids[9]}
              placeholder={labels[9]}
              value={product.warehouse_id}
              style={{ marginBottom: 2 }}
              onChange={e => {
                setProduct({ ...product, warehouse_id: +e.target.value })
              }}>{
                warehouses && warehouses.map((item, index) => <option key={index} value={item.id}>{item.name}</option>)
              }</select>
            <label htmlFor={ids[9]} className={'col-form-label mx-2'}>{labels[9]}</label>
          </div>

          <div className="col-md-6 form-check">
            <input className="form-check-input"
              type="checkbox"
              checked={product.is_active}
              onChange={e => {
                setProduct({ ...product, is_active: !product.is_active })
              }}
              value={product.is_active ? 1 : 0} id={ids[6]} />
            <label className="form-check-label" htmlFor={ids[6]}>{labels[6]}</label>
          </div>

          <div className={'container'}>
            <Unit product={product} />
          </div>

          <div className={'container mt-3'}>
            <button type={'submit'} className='btn w85 me-3 btn-primary'>
              Save Data
              </button>
            <button type={'submit'}
              disabled={product.id === 0}
              style={{ width: '85px' }}
              onClick={(e) => deleteData(e)} className='btn w85 btn-danger'>
              Delete
              </button>
          </div>
        </div>
      </div>
    </form >

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
  /*

    ({data: p, method }: reloadParam) => {
    if (data) {
      switch (method) {
        case 'insert':
          {
            const products = data.products;
            products.push(p);
            mutate({...data, products: [...products] }, false);
          }
          break;
        case 'update':
          {
            const products = data.products;
            const index: number = findElements(products, p.id);
            products.splice(index, 1, p)
            mutate({...data, products: [...products] }, false);
          }
          break;
        case 'delete':
          {
            const products = data.products.filter(x => x.id !== p.id)
            mutate({...data, products: [...products] }, false);
          }
          break;
      }
    }
  }
}
  */
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


type ProductInfoParam = {
  product: iProduct;
  onSelect: Function
}
const ProductInfo = ({ product, onSelect }: ProductInfoParam): JSX.Element => {
  return (
    <div className={'px-3 py-2'}>
      <span className={'cust-name'} onClick={(e) => onSelect()} role={'button'}>{product.name || 'New Product'}</span><br />
      Kode: {product.code}, Spec: {product.spec}
    </div>
  )
}

type startType = {
  categories?: iCategory[];
  suppliers?: iSupplier[],
  warehouses?: iWarehouse[]
}

export async function getServerSideProps() {

  const loadCategories = async () => {
    const [data, error] = await apiCategory.getCategories();
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
    const [data, error] = await apiWarehouse.getWarehouses();
    if (data) {
      return data;
    }
    return [];
  }

  const suppliers = await loadSuppliers();
  const categories = await loadCategories();
  const warehouses = await loadWarehouses();
  return { props: { suppliers: suppliers, categories: categories, warehouses: warehouses } }
}

/**
 * @param values index of label control
 * @returns 0: Nama Produk, 1: Kode, 2: Spek, 3: Unit (Terkecil), 4: Harga (Terkecil), 5: Berat (Terkecil),
6: Masih Aktif?, 7: Kategori, 8: Supplier, 9: Gudang
 */
const labels: string[] = ['Nama Produk', 'Kode', 'Spek',
  'Unit (Terkecil)', 'Harga (Terkecil)', 'Berat (Terkecil)',
  'Masih Aktif?',
  'Kategori', 'Supplier', 'Gudang']

/**
* @param values index of id control
* @returns 0: prod-name, 1: prod-code, 2: prod-spec, 3: prod-unit, 4: prod-price, 5: prod-price,
* 6: prod-acive, 7: prod-categori, 8: prod-supplier, 9: prod-warehouse
*/
const ids: string[] = [
  'prod-name', 'prod-code', 'prod-spec',
  'prod-unit', 'prod-price', 'prod-price',
  'prod-active',
  'prod-categori', 'prod-supplier', 'prod-warehouse'
]

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
  return {...data};
}
*/
