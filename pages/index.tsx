import Head from 'next/head'
// import { useRouter } from 'next/router'
import useSWR from 'swr'
import Layout, { siteTitle } from '../components/layout'
import Category from '../components/category'
import utilStyles from '../styles/utils.module.scss'

const fetcher = async (url: string) => {
  const res = await fetch(url)
  const data: any = await res.json()

  if (res.status !== 200) {
    throw new Error(data.message)
  }
  return data
}

export default function Home() {
//  const { query } = useRouter()
  const { data, error } = useSWR(`/api/category`, fetcher);

  if (error) return <div>{error.message}</div>
  if (!data) return <div>Loading...</div>

  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <p>Fine Young Canibals</p>
        <ul>
          {data.map((item: any, i: number) => (
            <Category key={i} category={item} />
          ))}
        </ul>
      </section>
    </Layout>
  )
}
