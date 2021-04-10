import Head from 'next/head'
import Link from 'next/link'
import React from 'react'
import styles from './layout.module.css'
import utilStyles from '../styles/utils.module.css'
import { AppContent, AppMain, AppTitle, AppHeader, AppMenu, DivMenu} from './styles'

const name = 'Apotek SR-II'
export const siteTitle = name
const Layout = ({ children, home, menuActive = 0, heading}: any) => {
  return (
    <React.Fragment>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="Learn how to build a personal website using Next.js"
        />

        <meta http-equiv="origin-trial" content="TOKEN_GOES_HERE" />

        <meta
          property="og:image"
          content={`https://og-image.now.sh/${encodeURI(
            siteTitle
          )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
        />
        <meta name="og:title" content={siteTitle} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <AppHeader>
        {home ? (
          <div className={'bg-dark text-white container-fluid py-2 mb-3'}>
            <h3 className={'mt-3 text-start container'}><img src={'/favicon-32x32.png'} style={{display: 'inline', marginRight: '.5rem'}} /> {name}</h3>
          </div>
        ) : (
          <h2 className={utilStyles.headingLg}>
            <Link href="/">
              <a className={utilStyles.colorInherit}><img src={'/favicon-32x32.png'}  style={{display: 'inline', marginRight: '.5rem'}}/>{name}</a>
            </Link>
          </h2>

        )}
      </AppHeader>
      <AppMenu>
        <AppTitle>{heading && heading}</AppTitle>
        <DivMenu>
          <Link href="/customer">
            <a className={`${menuActive === 0 && 'an-active'}`}><img src={'/images/customer.svg'} width={16}/>Pelanggan</a>
          </Link>
          <Link href="/category">
            <a className={`${menuActive === 1 && 'an-active'}`}><img src={'/images/product.svg'} width={16}/>Product</a>
          </Link>
          <Link href="/salesman">
            <a className={`${menuActive === 3 && 'an-active'}`}><img src={'/images/sales.svg'} width={16}/>Sales</a>
          </Link>
          <Link href="/category">
            <a className={`${menuActive === 2 && 'an-active'}`}><img src={'/images/category.svg'} width={16}/>Kategori</a>
          </Link>
          <Link href="/supplier">
            <a className={`${menuActive === 4 && 'an-active'}`}><img src={'/images/supplier.svg'} width={16}/>Supplier</a>
          </Link>
          <Link href="/warehouse">
            <a className={`${menuActive === 5 && 'an-active'}`}><img src={'/images/warehouse.svg'} width={16}/>Gudang</a>
          </Link>
          <Link href="/rayon">
            <a className={`${menuActive === 6 && 'an-active'}`}><img src={'/images/rayon.svg'} width={16}/>Rayon</a>
          </Link>
        </DivMenu>
      </AppMenu>
      <AppMain>
        <AppContent>{children}</AppContent>
      </AppMain>
      {!home && (
        <div className={styles.backToHome}>
          <Link href="/">
            <a>← Back to home</a>
          </Link>
        </div>
      )}
    </React.Fragment>
  )
}

export default Layout;
