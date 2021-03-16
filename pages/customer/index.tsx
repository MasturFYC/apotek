import Head from 'next/head'
import React, { useState } from 'react'
import useSWR from 'swr'
import Layout, { siteTitle } from '../../components/layout'
import utilStyles from '../../styles/utils.module.css'
import { iCustomer } from '../../components/interfaces'

const fetcher = async (url: string) => {
  const res = await fetch(url)
  const data: any = await res.json()

  if (res.status !== 200) {
    throw new Error(data.message)
  }

  return data
}

const backColors: string[] = ['#cecece', '#dedede']

export default function Home() {
  const { data: customers, error } = useSWR(`/api/customer`, fetcher);
  const [currentIndex, setCurrentIndex] = useState(-1);

  if (error) return <div>{error.message}</div>
  if (!customers) return <div>Loading...</div>

  const selectCustomer = (i: number) => {
    setCurrentIndex(i)
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
            property={{ backColor: backColors[i % 2], onClick: selectCustomer }}
          >
            {(currentIndex === i) && <CustomerForm key={`cust-sel-${i}`} customer={item} />}
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
    <div style={{border: '1px solid #9e9e9e'}} key={index}>
      <div key={`div-cust-sel-${index}`}
        style={CustomerStyle(property?.backColor!)}>
        <span onClick={(e) => property?.onClick(index)} style={{ cursor: 'pointer' }}>
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
  customer: iCustomer
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

const CustomerForm = ({ customer: cust }: CustomerFormType) => {
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
    <form style={{ fontSize: '10pt', padding: '10px', display: 'inline-block', width: '100%' }}>
    <div style={{display: 'inline-block', minWidth: '100%'}}>
        <div style={{ width: '50%', float: 'left', display: 'block' }}>
          <div>
            <div>Nama:</div>
            <div><input type={'text'} value={customer.name}
              onChange={(e) => setCustomer({ ...customer, name: e.target.value })} />
            </div>
          </div>
          <div>
            <div>Alamat:</div>
            <div><textarea value={customer.street}
              onChange={(e) => setCustomer({ ...customer, street: e.target.value })} />
            </div>
          </div>
          <div>
            <div>Kota:</div>
            <div><input type={'text'} value={customer.city}
              onChange={(e) => setCustomer({ ...customer, city: e.target.value })} />
            </div>
          </div>
          <div>
            <div>Kode Pos:</div>
            <div><input type={'text'} value={customer.zip || ''}
              onChange={(e) => setCustomer({ ...customer, zip: e.target.value })} />
            </div>
          </div>
        </div>
        <div style={{ width: '50%', float: 'left' }}>
          <div>
            <div>Telp:</div>
            <div style={{marginBottom: '25px'}}>
              <div>
                <div>Contact:</div>
                <div><input type={'text'} value={customer.phone}
                  onChange={(e) => setCustomer({ ...customer, phone: e.target.value })} /></div>
              </div>
              <div>
                <div>Cellular:</div>
                <div><input type={'text'} value={customer.cell || ''}
                  onChange={(e) => setCustomer({ ...customer, cell: e.target.value })} />
                </div>
              </div>
            </div>
          </div>
          <div>
            <div>Rayon:</div>
            <div><input type={'text'} value={customer.rayon_id}
              onChange={(e) => setCustomer({ ...customer, rayon_id: +e.target.value })} />
            </div>
          </div>
          <div>
            <div>Limit Credit:</div>
            <div><input type={'text'} value={customer.credit_limit}
              onChange={(e) => setCustomer({ ...customer, credit_limit: +e.target.value })} />
            </div>
          </div>
        </div>
    </div>
    </form>
  )
}
