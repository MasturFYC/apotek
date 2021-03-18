import Head from 'next/head'
import Link from 'next/link'
import React from 'react'
import styles from './layout.module.scss'
import utilStyles from '../styles/utils.module.scss'

const name = 'Apotek SR-II'
export const siteTitle = 'Apotek SR-II'
export default function Layout({ children, home, menuActive = 0 }: any) {
  return (
    <React.Fragment>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="Learn how to build a personal website using Next.js"
        />
        <meta
          property="og:image"
          content={`https://og-image.now.sh/${encodeURI(
            siteTitle
          )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
        />
        <meta name="og:title" content={siteTitle} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <header className={`bg-light text-start ${styles.header}`}>
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
      </header>
      <section className={'border-bottom pb-2'}>
      <div className={`text-dark container p-2 my-menu`}>
        <Link href="/customer">
          <a className={`${menuActive === 0 && 'an-active'}`}><img src={'/images/customer.svg'} width={24} />{' '}Pelanggan</a>
        </Link>
        <Link href="/category/24">
          <a className={`${menuActive === 1 && 'an-active'}`}><img src={'/images/product.svg'} width={24} />{' '}Product</a>
        </Link>
        </div>
      </section>

      <main className={'bg-white pt-4 mb-5 pb-5'}>
        <div className={'container bg-light p-0'}>{children}</div>
      </main>
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
