import Head from 'next/head'
import Link from 'next/link'
import React from 'react'
import styles from './layout.module.css'
import utilStyles from '../styles/utils.module.css'
import { AppContent, AppMain, AppTitle, AppHeader, AppMenu, DivMenu } from './styles'

const name = 'Apotek SR-II'
export const siteTitle = 'Apotek SR-II'
export default function Layout({ children, home, menuActive = 0, heading}: any) {
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
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-BmbxuPwQa2lc/FVzBcNJ7UAyJxM6wuqIj61tLrc4wSX0szH/Ev+nYRRuWlolflfl" crossOrigin="anonymous" />
        <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.6.0/dist/umd/popper.min.js" integrity="sha384-KsvD1yqQ1/1+IA7gi3P0tyJcT3vR+NdBTt13hSJ2lnve8agRGXTTyNaBYmCR/Nwi" crossOrigin="anonymous"></script>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/js/bootstrap.min.js" integrity="sha384-nsg8ua9HAw1y0W1btsyWgBklPnCUAFLuTMS2G72MMONqmOymq585AcH49TLBQObG" crossOrigin="anonymous"></script>
      </Head>
      <AppHeader>
        {home ? (
          <div className={'bg-dark text-white container-fluid py-2 mb-3'}>
            <h3 className={'mt-3 text-start container'}>{name}</h3>
          </div>
        ) : (
          <h2 className={utilStyles.headingLg}>
            <Link href="/">
              <a className={utilStyles.colorInherit}>{name}</a>
            </Link>
          </h2>

        )}
      </AppHeader>
      <AppMenu>
        <DivMenu>
          <Link href="/customer">
            <a className={`${menuActive === 0 && 'an-active'}`}><img src={'/images/customer.svg'} width={16} crossOrigin={'anonymous'}/>Pelanggan</a>
          </Link>
          <Link href="/category/24">
            <a className={`${menuActive === 1 && 'an-active'}`}><img src={'/images/product.svg'} width={16} crossOrigin={'anonymous'}/>Product</a>
          </Link>
          <Link href="/category">
            <a className={`${menuActive === 2 && 'an-active'}`}><img src={'/images/category.svg'} width={16} crossOrigin={'anonymous'}/>Kategori</a>
          </Link>
          <Link href="/salesman">
            <a className={`${menuActive === 3 && 'an-active'}`}><img src={'/images/sales.svg'} width={16} crossOrigin={'anonymous'}/>Sales</a>
          </Link>
        </DivMenu>
      </AppMenu>
      <AppMain>
        <AppTitle>{heading && heading}</AppTitle>
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
