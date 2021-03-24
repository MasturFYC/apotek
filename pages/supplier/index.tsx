import Head from 'next/head'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import useSWR, { mutate } from 'swr'
import Layout, { siteTitle } from '../../components/layout'
import { iSupplier, iProduct } from '../../components/interfaces'
import { CustomerFormDiv, CustomerName, DivRow, SelectedDiv } from '../../components/styles'
/*
interface iSelectOptions {
  value: number;
  label: string
}
*/
const revalidationOptions = {
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  refreshWhenOffline: false,
  refreshWhenHidden: false,
  refreshInterval: 0
};

const initSupplier: iSupplier = {
  id: 0,
  name: '',
  contactName: '',
  street: '',
  city: '',
  phone: '',
  createdAt: new Date,
  updatedAt: new Date,
}

export default function Home() {
  const { data: suppliers, error, mutate } = useSWR<iSupplier[]>(`/api/supplier`, fetcher, revalidationOptions);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isSelected, setIsSelected] = useState(false);
  //  const [selOptions, setSelOptions] = useState<iSelectOptions[]>([])


  if (error) return <div>{error.message}</div>
  if (!suppliers) return <div>{'Loading...'}</div>

  const selectSupplier = (i: number) => {
    setIsSelected((i === currentIndex) ? !isSelected : true)
    setCurrentIndex(i)
  }

  const refreshSupplier = async (method: string, sup: iSupplier, callback: Function) => {
    const url = `/api/supplier/${sup.id}`
    const fetchOptions = {
      method: method,
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      },
      body: JSON.stringify(sup)
    }

    const res = await fetch(url, fetchOptions);
    const data: iSupplier | any = await res.json();

    if (res.status === 200) {
      switch (method) {
        case 'DELETE':
          {
            mutate(suppliers.filter(item => item.id !== sup.id), false);
            setCurrentIndex(-1);
          }
          break;
        case 'POST':
          {
            mutate([...suppliers, data], false);
            setCurrentIndex(suppliers && suppliers?.length + 1 || -1)
          }
          break;
        case 'PUT':
          {
            suppliers.splice(currentIndex, 1, data);
            mutate(suppliers, false)
          }
          break;
      }
      callback(data)
    } else {
      callback(null)
      alert(data.message)
    }
  }

  return (
    <Layout home menuActive={4} heading={'Data Supplier'}>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      {suppliers && [...suppliers, initSupplier].map((item: iSupplier, i: number) => {
        return (
          <SupplierList
            key={`sup-key-${i}`}
            data={item}
            index={i}
            isSelected={isSelected && currentIndex === i}
            refreshData={refreshSupplier}
            property={{ onClick: selectSupplier }} />
        )
      })}
    </Layout>
  )
}

type SupplierProperty = {
  backColor?: string;
  borderColor?: string;
  onClick: (i: number) => void;
}

type SupplierListType = {
  data: iSupplier;
  index: number;
  property?: SupplierProperty;
  isSelected: boolean;
  refreshData: Function
}

const SupplierList: React.FunctionComponent<SupplierListType> = ({
  data, index, property, isSelected, refreshData
}) => {
  const [supplier, setSupplier] = useState<iSupplier>(initSupplier);

  React.useEffect(() => {
    let isLoaded = false;

    const attachSupplier = () => {
      if (!isLoaded) {
        setSupplier(data)
      }
    }
    attachSupplier();

    return () => { isLoaded = true }
  }, [data])

  const reloadData = (method: string, s: iSupplier) => {
    refreshData(method, s, (ret: iSupplier) => {
      if (ret) [
        setSupplier(s)
      ]
      });
  }

  return (
    <React.Fragment>
      <DivRow key={`row-${index}`} isActive={isSelected}>
        <div className={'col-sm-8 col-md-8'}>
          <CustomerName
            onMouseDown={(e) => {
              e.preventDefault()
              return false
            }} onClick={(e) => property?.onClick(index)}
          >
            {supplier.id === 0 ? 'New Supplier' : supplier.name}
          </CustomerName><br />
          <span>{supplier.street && `${supplier.street} - `}{supplier.city}{supplier.zip && `, ${supplier.zip}`}</span>
          <br /><strong>{supplier.contactName}</strong> <span>{supplier.phone} {supplier.cell && ` - ${supplier.cell}` || ''}</span>
        </div>
        <div className={'col-sm-4 col-md-4 text-nowrap'}>
          {supplier.id !== 0 &&
            <div className={'d-flex flex-row-reverse'}>
              <Link href={`/supplier/orders/${supplier.id}`}>
                <a className={'see-child overflow-hidden'}><img src={'/images/supplier.svg'} crossOrigin={'anonymous'} />
                Lihat Stock
                </a>
              </Link>
              <Link href={`/product/supplier/${supplier.id}`}>
                <a className={'see-child overflow-hidden'}><img src={'/images/product.svg'} crossOrigin={'anonymous'} />
                Data Produk
                </a>
              </Link>
            </div>
          }
        </div>
      </DivRow>
      {isSelected &&
        <DivRow key={`row-form-${data.id}`}>
          <SupplierForm
            key={`sup-sel-${index}`}
            supplier={data}
            reload={(method, data) => reloadData(method, data)}
          />
        </DivRow>}
    </React.Fragment>
  )
}

type SupplierFormType = {
  supplier: iSupplier;
  reload?: (method: string, data: iSupplier) => void;
}

const supplierInit: iSupplier = {
  id: 0,
  name: '',
  contactName: '',
  street: '',
  city: '',
  phone: ''
}

const SupplierForm: React.FunctionComponent<SupplierFormType> = ({
  supplier: sup, reload
}) => {
  const [supplier, setSupplier] = useState<iSupplier>(supplierInit);

  React.useEffect(() => {
    let isLoaded: boolean = false;

    const attachSupplier = () => {
      if (!isLoaded) {
        setSupplier(sup);
      }
    }

    attachSupplier();

    return () => {
      isLoaded = true;
    }
  }, [sup])

  const submitForm = (e: React.FormEvent) => {
    e.preventDefault();
    const method = supplier.id === 0 ? 'POST' : 'PUT';
    reload && reload(method, supplier);
  }
  const deleteSupplier = (e: React.MouseEvent) => {
    e.preventDefault();
    const method = 'DELETE';
    reload && reload(method, sup);
  }

  return (
    <form className={'form-floating'} onSubmit={submitForm}>
      <div className={'row'}>
        <div className={'col-md-12 form-floating mb-2'}>
          <input id={'txt-name'} className={'form-control'}
            type={'text'} value={supplier.name} autoFocus
            onChange={(e) => setSupplier({ ...supplier, name: e.target.value })}
            placeholder={'Enter Name'} />
          <label htmlFor={'txt-name'} className={'mx-2 col-form-label'}>Nama Supplier</label>
        </div>

        <div className={'col-md-12 form-floating mb-2'}>
          <input id={'txt-contact-name'} className={'form-control'}
            type={'text'} value={supplier.contactName}
            onChange={(e) => setSupplier({ ...supplier, contactName: e.target.value })}
            placeholder={'Enter Name kontak'} />
          <label htmlFor={'txt-contact-name'} className={'mx-2 col-form-label'}>Nama Kontak</label>
        </div>

        <div className={'col-md-12'}>
          <div className={'row g-2 mb-2'}>
            <div className={'form-floating'}>
              <input id={'txt-address'} className={'form-control'}
                type={'text'} value={supplier.street} placeholder="Nama jalan, blok, rt/rw"
                onChange={(e) => setSupplier({ ...supplier, street: e.target.value })} />
              <label htmlFor={'txt-address'} className={'col-form-label'}>Alamat</label>
            </div>
          </div>

          <div className={'row gx-2'}>
            <div className={'col-md-8 col-lg-8 form-floating mb-2'}>
              <input id={'txt-city'} className={'form-control'}
                type={'text'} value={supplier.city} placeholder={'Kota / kecamatan / kabupaten'}
                onChange={(e) => setSupplier({ ...supplier, city: e.target.value })} />
              <label htmlFor={'txt-city'} className={'col-form-label'}>Kota</label>
            </div>

            <div className={'col-md-4 col-lg-4 form-floating mb-2'}>
              <input className={'form-control'}
                id={'txt-zip'}
                placeholder={'Kode Pos'}
                type={'text'} value={supplier.zip || ''}
                onChange={(e) => setSupplier({ ...supplier, zip: e.target.value })} />
              <label htmlFor={'txt-zip'} className={'col-form-label'}>Kode Pos</label>
            </div>
          </div>

          <div className={'row g-2'}>
            <div className={'col-md-6 form-floating'}>
              <input id={"txt-phone"} type={'text'}
                placeholder={'Nomor contact'} className={'form-control'} value={supplier.phone}
                onChange={(e) => setSupplier({ ...supplier, phone: e.target.value })} />
              <label htmlFor={'txt-phone'} className={'col-form-label'}>Telephone</label>
            </div>

            <div className={'col-md-6 form-floating'}>
              <input id={"txt-cell"} type={'text'}
                placeholder={'Nomor handphone / cellular'}
                className={'form-control'} value={supplier.cell || ''}
                onChange={(e) => setSupplier({ ...supplier, cell: e.target.value })} />
              <label htmlFor={'txt-cell'} className={'form-floating form-label'}>Cellular</label>
            </div>
          </div>
        </div>
      </div>
      <div className={'row g-2 mt-3'}>
        <div className={'col'}>
          <button style={{ width: '90px' }} type="submit" className={'btn no-shadow btn-primary me-2 mb-2'}>
            Save</button>
          <button style={{ width: '90px' }} type="button" className={'btn no-shadow btn-danger mb-2'}
            onClick={(e) => deleteSupplier(e)}
            disabled={supplier.id === 0}>
            Delete</button>
        </div>
      </div>
    </form >
  )
}

const fetcher = async (url: string) => {
  const res = await fetch(url)
  const data: any = await res.json()

  if (res.status !== 200) {
    return alert(data.message)
  }

  return data;
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
