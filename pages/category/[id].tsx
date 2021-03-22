import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import useSWR, { mutate } from 'swr'
import Layout, { siteTitle } from '../../components/layout'
import { iProduct, iCategory, iSupplier, iWarehouse, iUnit } from '../../components/interfaces'
import Unit, { useUnit } from '../../components/unit'
import apiCategory from '../api/models/category.model'
import apiWarehouse from '../api/models/warehouse.model'
import apiSupplier from '../api/models/supplier.model'
import NumberFormat from 'react-number-format'

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

type CategoryPageParam = {
  categories: iCategory[];
  suppliers: iSupplier[];
  warehouses: iWarehouse[];
}

const categoryPage: React.FunctionComponent<CategoryPageParam> = ({ categories, suppliers, warehouses }) => {
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
            newData = [...category.products, e.data];
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


const ShowProducts: React.FunctionComponent<productType> = ({ products, updateCommand, categories, suppliers, warehouses }) => {
  const [currentId, setCurrentId] = useState<number>(-1);

  const refreshData = (p: iProduct, method: string) => {

    const i = currentId;
    const timeout = setTimeout(() => {
      switch (method) {
        case 'update':
          setCurrentId(currentId)
          break;
        case 'insert':
          setCurrentId(0)
          break;
        case 'delete':
          setCurrentId(-1)
          break;
      }
    }, 1000);

    updateCommand({ data: p, method: method });

    return () => {
      clearTimeout(timeout)
    };
  }

  const updateSelectedIndex = (i: number) => {
    //setSelectedIndex(i)
    //setIndex(i)
    (currentId === i ? setCurrentId(-1) : setCurrentId(i))
  }

  return (
    <React.Fragment>
      {products && products.map((item: iProduct, i: number) => (
        <div key={i}
          className={`${item.id !== 0 && 'border-bottom'} ${(i % 2 === 0 && 'bg-white rounded-top')}`}
        >
          <ProductInfo product={item} onSelect={() => updateSelectedIndex(products[i].id)} />
          {currentId === (products && products[i].id || 0) &&
            <EditProduct data={item} updateCommand={(e) => refreshData(e.data, e.method)}
              suppliers={suppliers}
              categories={categories}
              warehouses={warehouses}
              index={i} />}
        </div>
      ))}
    </React.Fragment>
  )
}

const EditProduct: React.FunctionComponent<updateProductParam> = ({
  data, updateCommand, categories, suppliers, warehouses, index
}) => {
  const [product, setProduct] = useState<iProduct>(initProduct(0));
  const { units, isLoading, isError, reload, removeUnit } = useUnit(data);
  const [includeUnit, setIncludeUnit] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string>('');
  React.useEffect(() => {
    let isLoaded = false;

    if (!isLoaded) {
      setProduct(data)
    }

    return () => {
      isLoaded = true;
    }
  }, [data])

  if (isError) return <div>{isError.message}</div>
  //footerDispatch({ type: FooterActionEnum.reload, init: units?.length || 0})
  if (isLoading) return <div>Loading...</div>

  const formSubmit = async (e: React.FormEvent) => {
    const baseUrl = `/api/product/${product.id}`;

    e.preventDefault();

    const check = checkError(product);
    if (check) {
      setErrorText(check);
      return false;
    }
    //console.log(product.id)

    const res = await fetch(baseUrl, {
      method: product.id === 0 ? 'POST' : 'PUT',
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      },
      body: JSON.stringify({
        data: includeUnit ? { ...product, units: units } : product,
        includeUnit: includeUnit
      })
    })

    const data: any = await res.json()

    if (res.status !== 200) {
      alert(data.message)
    } else {
      updateCommand({ data: data, method: product.id === 0 ? 'insert' : 'update' })
      setProduct(data)
      setIncludeUnit(false)
    }

    return false;
  }

  const updateUnitPrices = (basePrice: number) => {
    if (units) {
      //console.log('Price Changed')
      units.map((item: iUnit, index: number) => {
        const price = item.content * basePrice;
        item.buy_price = price;
        item.sale_price = (item.margin * price) + price;
        item.member_price = (item.member_margin * price) + price;
        item.agent_price = (item.agent_margin * price) + price;
        return item;
      })
    }
  }

  const updateUnitWeights = (baseWeight: number) => {
    if (units) {
      units.map((item: iUnit, index: number) => {
        item.weight = item.content * baseWeight;
        return item;
      })
    }
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
              value={product.spec || ''}
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
            <NumberFormat
              id={ids[4]}
              className={'form-control'}
              thousandSeparator={true}
              value={product.base_price * 1.0}
              decimalScale={2}
              fixedDecimalScale={false}
              placeholder={labels[4]}
              onValueChange={(e) => {
                setIncludeUnit(true);
                updateUnitPrices(e.floatValue ?? 0)
                setProduct({ ...product, base_price: e.floatValue ?? 0 });
              }}
            />
            <label htmlFor={ids[4]} className={'col-form-label mx-2'}>{labels[4]}</label>
          </div>

          <div className={'col-md-6 form-floating mb-3'}>
            <NumberFormat
              id={ids[5]}
              className={'form-control'}
              value={product.base_weight * 1.0}
              decimalScale={2}
              fixedDecimalScale={false}
              placeholder={labels[5]}
              onValueChange={(e) => {
                setIncludeUnit(true);
                updateUnitWeights(e.floatValue ?? 0);
                setProduct({ ...product, base_weight: e.floatValue ?? 0 });
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
                categories && [{ id: 0, name: 'Pilih Kategori...' }, ...categories].map((item, index) => <option key={index} value={item.id}>{item.name}</option>)
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
                suppliers && [{ id: 0, name: 'Pilih Supplier...' }, ...suppliers].map((item, index) => <option key={index} value={item.id}>{item.name}</option>)
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
                warehouses && [{ id: 0, name: 'Pilih Gudang...' }, ...warehouses].map((item, index) => <option key={index} value={item.id}>{item.name}</option>)
              }</select>
            <label htmlFor={ids[9]} className={'col-form-label mx-2'}>{labels[9]}</label>
          </div>

          <div className={'col-md-6 form-check g-3'}>
            <input className={'form-check-input ms-0 me-3'}
              type={'checkbox'}
              checked={product.is_active}
              onChange={e => {
                setProduct({ ...product, is_active: !product.is_active })
              }}
              value={product.is_active ? 1 : 0} id={ids[6]} />
            <label className={'form-check-label'} htmlFor={ids[6]}>{labels[6]}</label>
          </div>

          {product.id !== 0 &&
            <div className={'container'}>
              <Unit
                reload={(unit, option) => {
                  if (option === 'delete') {
                    removeUnit(unit.id)
                  } else {
                    reload(unit)
                  }
                }}
                units={units}
                product={product}
              />
            </div>
          }
          {errorText &&
            <div className={'container text-white font-bold bg-danger p-3 m-0'}>{errorText}</div>
          }
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

const checkError = (p: iProduct) => {

  if (!p.name || p.name.trim() === '') {
    return 'Ketikkan nama barang!';
  }

  if (!p.code || p.code.trim() === '') {
    return 'Ketikkan kode barang!';
  }

  if (!p.base_unit || p.base_unit.trim() === '') {
    return 'Ketikkan satuan dasar!';
  }

  if (p.base_price === 0) {
    return 'Harga dasar todak boleh (0) NOL!';
  }

  if (p.category_id === 0) {
    return 'Pilih kategori...!';
  }

  if (p.supplier_id === 0) {
    return 'Pilih supplier...!';
    return false;
  }

  if (p.warehouse_id === 0) {
    return 'Pilih gudang...!';
  }

  return false;
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
  onSelect: Function;
}

const ProductInfo: React.FunctionComponent<ProductInfoParam> = ({
  product, onSelect
}): JSX.Element => {
  return (
    <>
      <div className={'px-3 py-2'}>
        <span className={'cust-name'} onClick={(e) => onSelect()} role={'button'}>{product.name || 'New Product'}</span>
      </div>
      <div className={'px-3 mb-2'}>
        Kode: {product.code}, Spec: {product.spec}
        {/*, Harga: {product.base_price} */}
      </div>
    </>
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

export default categoryPage;
