import Head from 'next/head'
import React from 'react'
import Layout, { siteTitle } from '../../components/layout'
import { iProduct } from '../../components/interfaces'
import { DivRow } from '../../components/styles'

export default function ProductHome() {
  const [isVisible, objRef] = useVisibility<HTMLDivElement>()
  const [limit, setLimit] = React.useState(5);
  const [offset, setOffset] = React.useState(0);
  const [products, setProducts] = React.useState<iProduct[]>([]);
  const [pos, setPos] = React.useState(0);

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
      <ShowAllProducts productLists={products} />
      <div ref={objRef} className={'container'}></div >
    </Layout>
  )
}


function useVisibility<HTMLDivElement>(
  offset = 0, throttleMilliseconds = 100
): [boolean, React.RefObject<HTMLDivElement>] {
  const [isVisible, setIsVisible] = React.useState(true);
  const currentElement = React.useRef<HTMLDivElement | null>(null); //(null);

  const onScroll = () => {

    const el: HTMLDivElement | null = currentElement && currentElement.current || null;

    if (!el) {
      setIsVisible(false)
      return
    }

    const top = el.getBoundingClientRect().top;
    setIsVisible(((top + offset) >= 0) && ((top - offset) <= window.innerHeight));
    console.log(isVisible ? 'true' : 'false')
  }

  React.useEffect(() => {
    document.addEventListener('scroll', onScroll, true)
    return () => document.removeEventListener('scroll', onScroll, true)
  })

  return [isVisible, currentElement]
}

const ShowAllProducts: React.FunctionComponent<{ productLists: iProduct[] }> =
  ({ productLists }) => {
    return (
      <React.Fragment>
        {productLists && productLists.map((p: iProduct, i: number) => (
          <DivRow key={`p-${i}`}>
            <div className={'col'}>
              {p.name}<br />
              {p.spec}<br />
              {p.basePrice}<br />
              {p.baseUnit}<br />
              {p.baseWeight}
            </div>
          </DivRow>
        )
        )}
      </React.Fragment>
    )
  }
