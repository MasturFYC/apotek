import Head from 'next/head'
import Link from 'next/link'
import React, { useState } from 'react'
import useSWR, { mutate } from 'swr'
import Layout, { siteTitle } from '../../components/layout'
import { iSales } from '../../components/interfaces'
import { CustomerFormDiv, CustomerName, SelectedDiv } from '../../components/styles'

interface iSelectOptions {
  value: number;
  label: string
}

const revalidationOptions = {
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  refreshWhenOffline: false,
  refreshWhenHidden: false,
  refreshInterval: 0
};

const initSales: iSales = {
  id: 0,
  name: '',
  street: '',
  city: '',
  phone: '',
  cell: '',
  createdAt: new Date,
  updatedAt: new Date,
  zip: ''
}

export default function Home() {
  const { data: sales, error, mutate } = useSWR(`/api/sales`, fetcher, revalidationOptions);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isSelected, setIsSelected] = useState(false);
  const [selOptions, setSelOptions] = useState<iSelectOptions[]>([])


  if (error) return <div>{error.message}</div>
  if (!sales) return <div>{'Loading...'}</div>

  const selectSales = (i: number) => {
    setIsSelected((i === currentIndex) ? !isSelected : true)
    setCurrentIndex(i)
  }

  const refreshSales = async (e: iSales, opt: number) => {
    const url = `/api/sales/${e.id}`
    const fetchOptions = {
      method: opt === -1 ? 'DELETE' : e.id === 0 ? 'POST' : 'PUT',
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      },
      body: JSON.stringify(e)
    }

    const res = await fetch(url, fetchOptions);
    const data: iSales | any = await res.json();

    if (res.status === 200) {
      if (opt === -1) {
        mutate(sales.filter(item => item.id !== e.id), false);
        setCurrentIndex(-1);
      } else {
        sales.splice(currentIndex, 1, data);
        if (e.id === 0) {
          mutate([...sales, initSales], false)
          setCurrentIndex(sales && sales?.length || -1)
        } else {
          //sales.splice(currentIndex, 1, data);
          mutate(sales, false)
        }
      }
    } else {
      alert(data.message)
    }

  }

  return (
    <Layout home menuActive={3} heading={'Data Sales'}>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={'border border-1 rounded-3 m-0'}>
        {sales && sales.map((item: iSales, i: number) => {
          return <SalesList
            key={`cust-key-${i}`}
            sales={item}
            index={i}
            isSelected={isSelected && currentIndex === i}
            property={{
              onClick: selectSales
            }}
          >
            {(currentIndex === i) && isSelected &&

              <CustomerFormDiv>
                <SalesForm
                  key={`cust-sel-${i}`}
                  options={selOptions}
                  sales={item}
                  reload={(e, opt) => refreshSales(e, opt)}
                />
              </CustomerFormDiv>
            }
          </SalesList>
        })
        }
      </section>
    </Layout>
  )
}

type SalesProperty = {
  backColor?: string;
  borderColor?: string;
  onClick: (i: number) => void;
}

type SalesListType = {
  sales: iSales;
  index: number;
  property?: SalesProperty;
  children: any;
  isSelected: boolean;
}

const SalesList: React.FunctionComponent<SalesListType> = ({
  sales, index, property, children, isSelected
}) => {
  return (
    <SelectedDiv key={`div-cust-sel-${index}`}
      index={index}
      isSelected={isSelected}
      refId={sales.id}>
      <div className={'row mb-2'}>
        <div className={'col-md-7'}>
          <CustomerName
            onMouseDown={(e) => {
              e.preventDefault()
              return false
            }} onClick={(e) => property?.onClick(index)}
          >
            {sales.id === 0 ? 'New Sales' : sales.name}
          </CustomerName>
          <br /><span>{sales.street && `${sales.street} - `}{sales.city} {sales.zip && ` - (${sales.zip})`}</span>
          <br /><span>{sales.phone} {sales.cell && ` - ${sales.cell}` || ''}</span>
        </div>
        <div className={'col-md-5'}>
          {sales.id !== 0 &&
            <div className={'div-child d-flex flex-row-reverse'}>
              <Link href={`/sales/orders/${sales.id}`}>
                <a className={'see-child'}><img src={'/images/product.svg'} crossOrigin={'anonymous'} />Lihat Order</a>
              </Link>
            </div>
          }

        </div>
      </div>
      {children}
    </SelectedDiv>
  )
}

type SalesFormType = {
  sales: iSales,
  options: iSelectOptions[],
  reload?: (cust: iSales, opt: number) => void
}

const salesInit: iSales = {
  id: 0,
  name: '',
  street: '',
  city: '',
  phone: ''
}

const SalesForm: React.FunctionComponent<SalesFormType> = ({
  sales: cust, reload
}) => {
  const [sales, setSales] = useState<iSales>(salesInit);

  React.useEffect(() => {
    let isLoaded: boolean = false;

    const attachSales = () => {
      if (!isLoaded) {
        setSales(cust);
      }
    }

    attachSales();

    return () => {
      isLoaded = true;
    }
  }, [cust])

  const submitForm = (e: React.FormEvent) => {
    e.preventDefault();
    reload && reload(sales, 0);
  }
  const deleteSales = (e: React.MouseEvent) => {
    e.preventDefault();
    reload && reload(sales, -1);
  }
  return (
    <form className={'form-floating ps-3 pb-3 pt-3 mt-2 row bg-light border-top'}
      onSubmit={submitForm}
    >
      <div className={'row gx-3'}>
        <div className={'col-md-12 form-floating mb-2'}>
          <input id={'txt-name'} className={'form-control'}
            type={'text'} value={sales.name} autoFocus={true}
            onChange={(e) => setSales({ ...sales, name: e.target.value })}
            placeholder={'Enter Name'} />
          <label htmlFor={'txt-name'} className={'mx-0 col-form-label'}>Nama Sales</label>
        </div>

        <div className={'col-md-12'}>
          <div className={'row g-2 mb-2'}>
            <div className={'form-floating'}>
              <input id={'txt-address'} className={'form-control'}
                type={'text'} value={sales.street} placeholder="Nama jalan, blok, rt/rw"
                onChange={(e) => setSales({ ...sales, street: e.target.value })} />
              <label htmlFor={'txt-address'} className={'col-form-label'}>Alamat</label>
            </div>
          </div>

          <div className={'row gx-2'}>
            <div className={'col-md-8 col-lg-8 form-floating mb-2'}>
              <input id={'txt-city'} className={'form-control'}
                type={'text'} value={sales.city} placeholder={'Kota / kecamatan / kabupaten'}
                onChange={(e) => setSales({ ...sales, city: e.target.value })} />
              <label htmlFor={'txt-city'} className={'col-form-label'}>Kota</label>
            </div>

            <div className={'col-md-4 col-lg-4 form-floating mb-2'}>
              <input className={'form-control'}
                id={'txt-zip'}
                placeholder={'Kode Pos'}
                type={'text'} value={sales.zip || ''}
                onChange={(e) => setSales({ ...sales, zip: e.target.value })} />
              <label htmlFor={'txt-zip'} className={'col-form-label'}>Kode Pos</label>
            </div>
          </div>

          <div className={'row g-2'}>
            <div className={'col-md-6 form-floating'}>
              <input id={"txt-phone"} type={'text'}
                placeholder={'Nomor contact'} className={'form-control'} value={sales.phone}
                onChange={(e) => setSales({ ...sales, phone: e.target.value })} />
              <label htmlFor={'txt-phone'} className={'col-form-label'}>Telephone</label>
            </div>

            <div className={'col-md-6 form-floating'}>
              <input id={"txt-cell"} type={'text'}
                placeholder={'Nomor handphone / cellular'}
                className={'form-control'} value={sales.cell || ''}
                onChange={(e) => setSales({ ...sales, cell: e.target.value })} />
              <label htmlFor={'txt-cell'} className={'form-floating form-label'}>Cellular</label>
            </div>
          </div>
        </div>
      </div>
      <div className={'row g-3 mt-0 d-flex align-items-center'}>
        <div className="col-md-4 col-lg-4">
          <div className={'row'}>
            <div className={'col-md-6'}>
              <button type="submit" className={'btn align-middle no-border no-shadow w-100 btn-primary mb-2'}>
                Save</button>
            </div>

            <div className={'col-md-6'}>
              <button type="button" className={'btn no-shadow w-100 btn-danger mb-2'}
                onClick={(e) => deleteSales(e)}
                disabled={sales.id === 0}>
                Delete</button>
            </div>
          </div>
        </div>
      </div>
    </form >
  )
}

const fetcher = async (url: string) => {
  const res = await fetch(url)
  const data: any = await res.json()

  if (res.status !== 200) {
    throw new Error(data.message)
  }

  return [...data, initSales];
}


type colorReducerType = {
  color: string;
  index: number;
  currentIndex: number;
  isSelected: boolean;
}

const backColors: string[] = ['#f8f9fa', '#e9ecef', '#f1f8ff']
const initSelected: colorReducerType = {
  color: backColors[0],
  index: 0,
  currentIndex: -1,
  isSelected: false
}

type colorReducerAction = {
  index: number;
  currentIndex: number;
  isSelected: boolean;
}

const colorReducer = (state: colorReducerType, action: colorReducerAction) => {
  if (action.isSelected) {
    return { ...state, color: backColors[2] }
  }
  return state;
}
