import Head from 'next/head'
import React from 'react'
import Layout, { siteTitle } from '../../components/layout'
import { iCategory, iProduct, iSupplier, iWarehouse } from '../../components/interfaces'
//import { DivRow } from '../../components/styles'
import { useVisibility } from '../../components/useVisibility'
import { ShowProducts } from '../../components/forms/product-fom'
import { PropertyProvider } from '../../components/context/propery-context'

export default function ProductHome() {
  const [isVisible, objRef] = useVisibility<HTMLDivElement>()
  const [limit, setLimit] = React.useState(10);
  const [offset, setOffset] = React.useState(0);
  const [products, setProducts] = React.useState<iProduct[]>([]);
  const [categories, setCategories] = React.useState<iCategory[]>([]);
  const [suppliers, setSuppliers] = React.useState<iSupplier[]>([]);
  const [warehouses, setWarehouses] = React.useState<iWarehouse[]>([]);

  React.useEffect(() => {
    let isLoaded = false;

    const loadCategories = async () => {
      if (!isLoaded) {
        const res = await fetch('/api/category/list');
        const data: iCategory[] | any = await res.json();
        if (res.status === 200 && data) {
          setCategories(data)
        }
      }
    }

    const loadSuppliers = async () => {
      const res = await fetch('/api/supplier/list');
      if (!isLoaded) {
        const data: iSupplier[] | any = await res.json();
        if (res.status === 200 && data) {
          setSuppliers(data)
        }
      }
    }

    const loadWarehouses = async () => {
      const res = await fetch('/api/warehouse/list');
      if (!isLoaded) {
        const data: iWarehouse[] | any = await res.json();
        if (res.status === 200 && data) {
          setWarehouses(data)
        }
      }
    }

    loadCategories();
    loadSuppliers();
    loadWarehouses();

    return () => {isLoaded = true;}
  }, [])

  React.useEffect(() => {
    let isLoaded = true;

    const loadData = async () => {
      if (isLoaded && isVisible) {
        const offs = offset;
        console.log(offs)
        const baseUrl = `/api/product/limit-offset/${offs}/${limit}`;
        const res = await fetch(baseUrl);
        const data: iProduct[] | any = await res.json();
        if (res.status === 200 && data) {
          setProducts((state) => ([...state, ...data]))
          setOffset(offs + limit);
        }
      }
    }

    loadData();

    return () => { isLoaded = false; }
  }, [isVisible])

  return (
    <Layout home menuActive={1} heading={'Data Barang'}>
      <Head>
        <title>Poducts - {siteTitle}</title>
      </Head>
      {/* <ShowAllProducts productLists={products} /> */}
      <PropertyProvider value={{
        products: products,
        categories: categories,
        suppliers: suppliers,
        warehouses: warehouses,
        // updateValue: null
      }}>
        <ShowProducts />
      </PropertyProvider>
      <div ref={objRef} />
    </Layout>
  )
}

// const ShowAllProducts: React.FunctionComponent<{ productLists: iProduct[] }> =
//   ({ productLists }) => {
//     return (
//       <React.Fragment>
//         {productLists && productLists.map((p: iProduct, i: number) => (
//           <DivRow key={`p-${i}`}>
//             <div className={'col'}>
//               {p.name}<br />
//               {p.spec}<br />
//               {p.basePrice}<br />
//               {p.baseUnit}<br />
//               {p.baseWeight}
//             </div>
//           </DivRow>
//         )
//         )}
//       </React.Fragment>
//     )
//   }
