import Head from 'next/head'
import React, { useState } from 'react'
import Select from 'react-select'
import useSWR, { useSWRInfinite } from 'swr'
import Layout, { siteTitle } from '../../components/layout'
import utilStyles from '../../styles/utils.module.scss'
import { iCustomer, iRayon } from '../../components/interfaces'
import { isOptionDisabled } from 'react-select/src/builtins'

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

const initCustomer: iCustomer = {
  id: 0,
  name: '',
  street: '',
  city: '',
  phone: '',
  cell: '',
  rayon_id: 0,
  created_at: new Date,
  updated_at: new Date,
  credit_limit: 0,
  descriptions: '',
  zip: ''
}

export default function Home() {
  const { data: customers, error, mutate } = useSWR(`/api/customer`, fetcher, revalidationOptions);
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

  const refreshCustomer = async (e: iCustomer, opt: number) => {
    const url = `/api/customer/${e.id}`
    const fetchOptions = {
      method: opt === -1 ? 'DELETE' : e.id === 0 ? 'POST' : 'PUT',
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      },
      body: JSON.stringify(e)
    }

    const res = await fetch(url, fetchOptions);
    const data: iCustomer | any = await res.json();

    if (res.status === 200) {
      if (opt === -1) {
        mutate(customers.filter(item => item.id !== e.id), false);
        setCurrentIndex(-1);
      } else {
        customers.splice(currentIndex, 1, data);
        if (e.id === 0) {
          mutate([...customers, initCustomer], false)
          setCurrentIndex(customers && customers?.length || -1)
        } else {
          //customers.splice(currentIndex, 1, data);
          mutate(customers, false)
        }
      }
    } else {
      alert(data.message)
    }

  }

  return (
    <Layout home menuActive={0}>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={'border border-1 rounded-3'}>
        {customers && customers.map((item: iCustomer, i: number) => {
          return <CustomerList
            key={`cust-key-${i}`}
            customer={item}
            index={i}
            property={{ backColor: backColors[(isSelected && currentIndex === i) ? 2 : i % 2], onClick: selectCustomer }}
          >
            {(currentIndex === i) && isSelected &&

              <div style={{ margin: '0px -15px -11px -15px', padding: '0px 13px 6px 13px' }}>
                <CustomerForm
                  key={`cust-sel-${i}`}
                  options={selOptions}
                  customer={item}
                  reload={(e, opt) => refreshCustomer(e, opt)}
                />
              </div>
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

    <div key={`div-cust-sel-${index}`}
      style={CustomerStyle(property?.backColor!)}
      className={`border-bottom ${index === 0 && " rounded-top"} ${customer.id === 0 && "border-bottom-0 rounded-bottom"}`}>
      <span
        className={'cust-name'}
        onMouseDown={(e) => {
          e.preventDefault()
          return false
        }} onClick={(e) => property?.onClick(index)}
      >
        {customer.id === 0 ? 'New Customer' : customer.name}
      </span>
      <br /><span>{customer.street && `${customer.street} - `}{customer.city}</span>
      <br /><span>{customer.phone} {customer.cell && ` - ${customer.cell}` || ''}</span>
      {children}
    </div>
  )
}

type CustomerFormType = {
  customer: iCustomer,
  options: iSelectOptions[],
  reload?: (cust: iCustomer, opt: number) => void
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

const CustomerForm = ({ customer: cust, options, reload }: CustomerFormType) => {
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

  const submitForm = (e: React.FormEvent) => {
    e.preventDefault();
    reload && reload(customer, 0);
  }
  const deleteCustomer = (e: React.MouseEvent) => {
    e.preventDefault();
    reload && reload(customer, -1);
  }
  return (
    <form className={'form-floating p-3 pt-0 mt-3 row g-3 bg-light'}
      onSubmit={submitForm}
    >

      <div className={'col-md-6'}>

        <div className={'col-md-12 form-floating mb-2'}>
          <input id={'txt-name'} className={'form-control'}
            type={'text'} value={customer.name} autoFocus={true}
            onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
            placeholder={'Enter Name'} />
          <label htmlFor={'txt-name'} className={'mx-0 col-form-label'}>Nama Pelanggan</label>
        </div>

        <div className={'col-md-12 form-floating mb-2'}>
          <input id={'txt-credit'} type={'text'}
            placeholder={'Batas kridit'}
            className={'form-control'} value={customer.credit_limit}
            onChange={(e) => setCustomer({ ...customer, credit_limit: +e.target.value })} />
          <label htmlFor={'txt-credit'} className={'mx-0 col-form-label'}>Limit Credit</label>
        </div>

        <div className={'col-md-12'}>
          <div className={'row p-0'}>
            <label htmlFor={'txt-rayon'} className={'col-2 pt-2 col-form-label-md'}>Rayon</label>
            <Select id={'txt-rayon'} className={'col mt-0 py-0'}
              value={options.filter(x => x.value === customer.rayon_id)}
              onChange={(e) => setCustomer({ ...customer, rayon_id: e?.value || 0 })}
              options={options}
              placeholder={'Pilih Rayon'} />
          </div>
        </div>

      </div>


      <div className={'col-md-6 col-lg-6'}>

        <div className={'row form-floating'}>

          <div className={'col-md-12 col-lg-12 form-floating mb-2'}>
            <input id={'txt-address'} className={'form-control'}
              value={customer.street} placeholder="Nama jalan, blok, rt/rw"
              onChange={(e) => setCustomer({ ...customer, street: e.target.value })} />
            <label htmlFor={'txt-address'} className={'mx-2 col-form-label'}>Alamat</label>
          </div>

          <div className={'col-md-8 col-lg-8 form-floating mb-2'}>
            <input id={'txt-city'} className={'form-control'}
              type={'text'} value={customer.city} placeholder={'Kota / kecamatan / kabupaten'}
              onChange={(e) => setCustomer({ ...customer, city: e.target.value })} />
            <label htmlFor={'txt-city'} className={'mx-2 col-form-label'}>Kota</label>
          </div>

          <div className={'col-md-4 col-lg-4 form-floating mb-2'}>
            <input className={'form-control'}
              id={'txt-zip'}
              placeholder={'Kode Pos'}
              type={'text'} value={customer.zip || ''}
              onChange={(e) => setCustomer({ ...customer, zip: e.target.value })} />
            <label htmlFor={'txt-zip'} className={'mx-2 col-form-label'}>Kode Pos</label>
          </div>


          <div className={'col-md-6 form-floating mb-2'}>
            <input id={"txt-phone"} type={'text'}
              placeholder={'Nomor contact'} className={'form-control'} value={customer.phone}
              onChange={(e) => setCustomer({ ...customer, phone: e.target.value })} />
            <label htmlFor={'txt-phone'} className={'mx-2 col-form-label'}>Telephone</label>
          </div>

          <div className={'col-md-6 form-floating mb-2'}>
            <input id={"txt-cell"} type={'text'}
              placeholder={'Nomor handphone / cellular'}
              className={'form-control'} value={customer.cell || ''}
              onChange={(e) => setCustomer({ ...customer, cell: e.target.value })} />
            <label htmlFor={'txt-cell'} className={'mx-2 col-form-label'}>Cellular</label>
          </div>

        </div>

      </div>

      <div className={'col-md-8 col-lg-8 form-floating m-0 mb-2'}>
        <textarea style={{ height: '90px' }} id={'txt-desc'}
          placeholder={'Keterangan'} className={'form-control'}
          value={customer.descriptions || ''}
          onChange={(e) => setCustomer({ ...customer, descriptions: e.target.value })} />
        <label htmlFor={'txt-desc'} className={'mx-2 col-form-label'}>Keterangan</label>
      </div>

      <div className="col-md-4 col-lg-4 form-floating">
        <div className={'row g-2'}>
          <div className={'col-md-6'}>
            <button type="submit" className={'btn w-100 btn-primary mb-2'}>
              Save</button>
          </div>

          <div className={'col-md-6'}>
            <button type="button" className={'btn w-100 btn-danger mb-2'}
              onClick={(e) => deleteCustomer(e)}
              disabled={customer.id === 0}>
              Delete</button>
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

  return [...data, initCustomer];
}


type colorReducerType = {
  color: string;
  index: number;
  currentIndex: number;
  isSelected: boolean;
}

const backColors: string[] = ['#f8f9fa', '#e9ecef', '#ffc107']
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
