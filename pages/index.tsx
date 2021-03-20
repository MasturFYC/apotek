import Head from 'next/head'
// import { useRouter } from 'next/router'
import useSWR from 'swr'
import Category from '../components/category'
import utilStyles from '../styles/utils.module.css'
import Layout, { siteTitle } from '../components/layout'

const fetcher = async (url: string) => {

  const res = await fetch(url, {
    method: 'GET'
  })
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


/*

var isEnabledSharedArrayBuffer = typeof SharedArrayBuffer === 'function' && typeof window !== 'undefined' && window.crossOriginIsolated === true

var profilingStateSize = 4;
// var sharedProfilingBuffer =  // $FlowFixMe Flow doesn't know about SharedArrayBuffer
// typeof SharedArrayBuffer === 'function' ? new SharedArrayBuffer(profilingStateSize * Int32Array.BYTES_PER_ELEMENT) : // $FlowFixMe Flow doesn't know about ArrayBuffer
// typeof ArrayBuffer === 'function' ? new ArrayBuffer(profilingStateSize * Int32Array.BYTES_PER_ELEMENT) : null // Don't crash the init path on IE9
// ;
var sharedProfilingBuffer = isEnabledSharedArrayBuffer ?
new SharedArrayBuffer(profilingStateSize * Int32Array.BYTES_PER_ELEMENT)
    : // $FlowFixMe Flow doesn't know about ArrayBuffer
    typeof ArrayBuffer === 'function' ? new ArrayBuffer(profilingStateSize * Int32Array.BYTES_PER_ELEMENT) : null
    
*/