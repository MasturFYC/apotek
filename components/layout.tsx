import Head from 'next/head'
import Link from 'next/link'
import React from 'react'
import { AppContent, AppHeader, AppTitle, DivMenu } from './styles';

const name = 'Apotek SR-II'
export const siteTitle = name;

const Layout = ({ children, home, menuActive = 0, heading }: any) => {

  return (
    <React.Fragment>
      <Head>
        <meta name="viewport" content="minimum-scale=1, width=device-width, initial-scale=1" />
        <meta name="og:title" content={siteTitle} />
        <meta property="og:image" content={`https://og-image.now.sh/${encodeURI(siteTitle)}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}/>
      </Head>
      <AppHeader>
        <nav className="navbar container-fluid navbar-light bg-dark">
          <div className="container-fluid">
            {home ? (
              <div className={'bg-dark text-white container'}>
                <h4 className={'text-start'}><img alt="Favicon" src={'/favicon-32x32.png'} style={{ display: 'inline', marginRight: '.5rem' }} /> {name}</h4>
              </div>
            ) : (
              <div className={'bg-dark text-white container'}>
                <h4 className={'text-start'}>
                  <Link href="/">
                    <a><img alt="Favicon" src={'/favicon-32x32.png'} style={{ display: 'inline', marginRight: '.5rem' }} />{name}</a>
                  </Link>
                </h4>
              </div>
            )}
          </div>
        </nav>
      </AppHeader>
      <AppTitle><div className={'container pt-3'}>{heading && heading}</div></AppTitle>
      <section className={'bg-light border-bottom pb-2'}>
        <DivMenu className={'text-dark container'}>
          <Link href="/customer">
            <a className={`${menuActive === 0 && 'an-active'}`}><img alt="Customer" src={'/images/customer.svg'} />Pelanggan</a>
          </Link>
          <Link href="/product">
            <a className={`${menuActive === 1 && 'an-active'}`}><img alt="Product" src={'/images/product.svg'} />Product</a>
          </Link>
          <Link href="/salesman">
            <a className={`${menuActive === 3 && 'an-active'}`}><img alt="Sales" src={'/images/sales.svg'} />Sales</a>
          </Link>
          <Link href="/category">
            <a className={`${menuActive === 2 && 'an-active'}`}><img alt="Category" src={'/images/category.svg'} />Kategori</a>
          </Link>
          <Link href="/supplier">
            <a className={`${menuActive === 4 && 'an-active'}`}><img alt="Supplier" src={'/images/supplier.svg'} />Supplier</a>
          </Link>
          <Link href="/warehouse">
            <a className={`${menuActive === 5 && 'an-active'}`}><img alt="Warehouse" src={'/images/warehouse.svg'} />Gudang</a>
          </Link>
          <Link href="/rayon">
            <a className={`${menuActive === 6 && 'an-active'}`}><img alt="Rayon" src={'/images/rayon.svg'} />Rayon</a>
          </Link>
          <Link href="/stock">
            <a className={`${menuActive === 7 && 'an-active'}`}><img alt="Rayon" src={'/images/rayon.svg'} />Stock</a>
          </Link>
        </DivMenu>
      </section>
      <AppContent>
        <div className={'container'}>
          {children}
        </div>
      </AppContent>
      {/* {!home && (
        <div>
          <Link href="/">
            <a>← Back to home</a>
          </Link>
        </div>
      )} */}
    </React.Fragment>)
}

export default Layout;
