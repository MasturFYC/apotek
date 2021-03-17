import Head from 'next/head'
import React, { useState } from 'react'
import Select from 'react-select'
import useSWR, { useSWRInfinite } from 'swr'
import Layout, { siteTitle } from '../../components/layout'
import utilStyles from '../../styles/utils.module.css'
import { iCustomer, iRayon } from '../../components/interfaces'

interface iSelectOptions {
  value: number;
  label: string
}

export default function Home() {
  const { data: customers, error } = useSWR(`/api/customer`, fetcher);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isSelected, setIsSelected] = useState(false);
  //const [rayons, setRayons] = useState<iRayon[]>([])
  const [selOptions, setSelOptions] = useState<iSelectOptions[]>([])
  //  const [selectedColor, dispatchSelectedColor] = React.useReducer(colorReducer, initSelected)
  React.useEffect(() => {
    let isLoaded = false;
    const loadRayon = async () => {
      const res = await fetch('/api/rayon')
      const data: any = await res.json() as iRayon[];

      if (res.status !== 200) {
        throw new Error(data.message)
      }
      if (data) {
        setSelOptions(data.map((item: iRayon, i: number) => ({
          value: item.id,
          label: item.name
        }
        )))
      }
    }

    if (!isLoaded) {
      loadRayon()
    }

    return () => {
      isLoaded = true
    }
  }, [])


  if (error) return <div>{error.message}</div>
  if (!customers) return <div>Loading...</div>

  const selectCustomer = (i: number) => {
    setIsSelected((i === currentIndex) ? !isSelected : true)
    setCurrentIndex(i)
    // dispatchSelectedColor({
    //   index: i,
    //   currentIndex: i,
    //   isSelected: (i === currentIndex) ? !isSelected : true
    // })
  }

  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        {customers && customers.map((item: iCustomer, i: number) => {
          return <CustomerList
            key={`cust-key-${i}`}
            customer={item}
            index={i}
            property={{ backColor: backColors[(isSelected && currentIndex === i) ? 2 : i % 2], onClick: selectCustomer }}
          >
            {(currentIndex === i) && isSelected &&
              <CustomerForm key={`cust-sel-${i}`} options={selOptions} customer={item} />
            }
          </CustomerList>
        })
        }
      </section>
    </Layout>
  )
}

type CustomerProperty = {
  backColor: string;
  onClick: (i: number) => void;
}

type CustomerListType = {
  customer: iCustomer;
  index: number;
  property?: CustomerProperty;
  children: any;
}

const CustomerStyle = (backColor: string) => ({
  fontSize: 14,
  backgroundColor: backColor,
  padding: '6px 10px'
})

const CustomerList = ({ customer, index, property, children }: CustomerListType) => {
  return (
    <div key={index}>
      <div key={`div-cust-sel-${index}`}
        style={CustomerStyle(property?.backColor!)}>
        <span onMouseDown={(e) => {
          e.preventDefault()
          return false
        }} onClick={(e) => property?.onClick(index)} style={{ cursor: 'pointer' }}>
          <strong>{customer.name}</strong>
        </span><br />
        <span>{customer.street} - {customer.city}</span><br />
        <span>{customer.phone} {customer.cell && ` - ${customer.cell}` || ''}</span>
      </div>
      {children}
    </div>
  )
}

type CustomerFormType = {
  customer: iCustomer,
  options: iSelectOptions[]
}

const customerInit: iCustomer = {
  id: 0,
  name: '',
  street: '',
  city: '',
  phone: '',
  rayon_id: 0,
  created_at: new Date(),
  updated_at: new Date(),
  credit_limit: 0
}

const CustomerForm = ({ customer: cust, options }: CustomerFormType) => {
  const [customer, setCustomer] = useState<iCustomer>(cust);
  // React.useEffect(() => {
  //   let isLoaded: boolean = false;
  //   if (!isLoaded) {
  //     setCustomer({ ...cust });
  //   }
  //   return () => {
  //     isLoaded = true;
  //   }
  // }, [cust])
  return (
    <form className={'form-floating border p-3 row g-2 m-0 pb-3'} >

      <div className={'col-md-6'}>

        <div className={'col-md-12 form-floating mb-1'}>
          <input id={'txt-name'} className={'form-control form-control-sm'}
            type={'text'} value={customer.name}
            onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
            placeholder={'Enter Name'} />
          <label htmlFor={'txt-name'} className={'mx-0 col-form-label-sm'}>Nama Pelanggan</label>
        </div>

        <div className={'col-md-12 form-floating mb-1'}>
          <input id={'txt-credit'} type={'text'}
            placeholder={'Batas kridit'}
            className={'form-control form-control-sm'} value={customer.credit_limit}
            onChange={(e) => setCustomer({ ...customer, credit_limit: +e.target.value })} />
          <label htmlFor={'txt-credit'} className={'mx-0 col-form-label-sm'}>Limit Credit</label>

        </div>

        <div className={'col-md-12 mb-1'}>
          <div className={'row p-0 px-1'}>
            <label htmlFor={'txt-rayon'} className={'col-2 py-2 col-form-label-sm'}>Rayon</label>
            <Select id={'txt-rayon'} className={'col form-control-sm'}
              value={options.filter(x => x.value === customer.rayon_id)}
              onChange={(e) => setCustomer({ ...customer, rayon_id: e?.value || 0 })}
              options={options}
              placeholder={'Pilih Rayon'} />
          </div>
        </div>

      </div>


      <div className={'col-md-6'}>

        <div className={'col-md-12 form-floating mb-1'}>
          <input id={'txt-address'} className={'form-control form-control-sm'}
            value={customer.street} placeholder="Nama jalan, blok, rt/rw"
            onChange={(e) => setCustomer({ ...customer, street: e.target.value })} />
          <label htmlFor={'txt-address'} className={'mx-0 col-form-label-sm'}>Alamat</label>
        </div>

        <div className={'col-md-12 form-floating mb-1'}>
          <input id={'txt-city'} className={'form-control form-control-sm'}
            type={'text'} value={customer.city} placeholder={'Kota / kecamatan / kabupaten'}
            onChange={(e) => setCustomer({ ...customer, city: e.target.value })} />
          <label htmlFor={'txt-city'} className={'mx-0 col-form-label-sm'}>Kota</label>
        </div>

        <div className={'col-md-12 form-floating mb-1'}>
          <input className={'form-control form-control-sm'}
            id={'txt-zip'}
            placeholder={'Kode Pos'}
            type={'text'} value={customer.zip || ''}
            onChange={(e) => setCustomer({ ...customer, zip: e.target.value })} />
          <label htmlFor={'txt-zip'} className={'mx-0 col-form-label-sm'}>Kode Pos</label>
        </div>

      </div>

      <div className={'col-md-6 form-floating form-floating mb-1'}>
        <input id={"txt-phone"} type={'text'}
          placeholder={'Nomor contact'} className={'form-control form-control-sm'} value={customer.phone}
          onChange={(e) => setCustomer({ ...customer, phone: e.target.value })} />
        <label htmlFor={'txt-phone'} className={'mx-1 col-form-label-sm'}>Telephone</label>
      </div>

      <div className={'col-md-6 form-floating mb-1'}>
        <input id={"txt-cell"} type={'text'}
          placeholder={'Nomor handphone / cellular'}
          className={'form-control form-control-sm'} value={customer.cell || ''}
          onChange={(e) => setCustomer({ ...customer, cell: e.target.value })} />
        <label htmlFor={'txt-cell'} className={'mx-1 col-form-label-sm'}>Cellular</label>
      </div>

      <div className={'col-md-10 form-floating mb-1'}>
        <textarea rows={5} style={{ height: '72px' }} id={'txt-desc'}
          placeholder={'Keterangan'} className={'form-control form-control-sm'}
          value={customer.descriptions || ''}
          onChange={(e) => setCustomer({ ...customer, descriptions: e.target.value })} />
        <label htmlFor={'txt-desc'} className={'mx-1 col-form-label-sm'}>Keterangan</label>
      </div>

      <div className="col-md-2">
        <div className="d-grid gap-2">
          <button type="button" className={'btn btn-sm btn-primary'}>
            Save
          </button>

          <button type="button" className={'btn btn-sm btn-danger'}>
            Delete
          </button>
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

  return data
}


type colorReducerType = {
  color: string;
  index: number;
  currentIndex: number;
  isSelected: boolean;
}

const backColors: string[] = ['#cecece', '#dedede', '#7eca9c']
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
