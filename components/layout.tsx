import Head from 'next/head'
import Link from 'next/link'
import styles from './layout.module.scss'
import utilStyles from '../styles/utils.module.scss'

const name = 'Your Name'
export const siteTitle = 'Next.js Sample Website'
export default function Layout({ children, home }: any) {
  return (
    <div>
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
      <header className={`bg-light ${styles.header}`}>
        {home ? (
          <h1 className={utilStyles.heading2Xl}>{name}</h1>
        ) : (
          <h2 className={utilStyles.headingLg}>
            <Link href="/">
              <a className={utilStyles.colorInherit}>{name}</a>
            </Link>
          </h2>

        )}
      </header>
      <section className={'border-bottom'}>
        <div className={'text-dark container p-2 my-menu'}><Link href="/customer">
          <a><img src={'/images/customer.svg'} width={24} />{' '}Pelanggan</a>
        </Link>
        </div>
      </section>

      <main className={'bg-white pt-4 mb-5'}>
        <div className={'container bg-light mb-0 p-0'}>{children}</div>
      </main>
      {!home && (
        <div className={styles.backToHome}>
          <Link href="/">
            <a>← Back to home</a>
          </Link>
        </div>
      )}
    </div>
  )
}
