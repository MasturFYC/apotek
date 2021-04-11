import Head from 'next/head'
import dynamic from 'next/dynamic'
// import { useRouter } from 'next/router'
import useSWR from 'swr'
import Category from '../components/category'
import { siteTitle } from '../components/layout'
//import Layout, { siteTitle } from '../components/layout'

const Layout = dynamic(import('../components/layout'))

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

//  console.log('Data: ', data)

  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section>
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
    : typeof ArrayBuffer === 'function' ? new ArrayBuffer(profilingStateSize * Int32Array.BYTES_PER_ELEMENT) : null

*/


/**
 * INERCEPTOR
 * export {default as createFieldNameTransformationInterceptor} from './factories';
 */

/*


USE LOCAL STORAGE
  const [name, setName] = useLocalStorage('name', 'Bob');


FUNCTION () {
  return (

    <div>

      <input

        type="text"

        placeholder="Enter your name"

        value={name}

        onChange={e => setName(e.target.value)}

      />

    </div>

  );
}

function useLocalStorage(key, initialValue) {

  // State to store our value

  // Pass initial state function to useState so logic is only executed once

  const [storedValue, setStoredValue] = useState(() => {

    try {

      // Get from local storage by key

      const item = window.localStorage.getItem(key);

      // Parse stored json or if none return initialValue

      return item ? JSON.parse(item) : initialValue;

    } catch (error) {

      // If error also return initialValue

      console.log(error);

      return initialValue;

    }

  });



  // Return a wrapped version of useState's setter function that ...

  // ... persists the new value to localStorage.

  const setValue = value => {

    try {

      // Allow value to be a function so we have same API as useState

      const valueToStore =

        value instanceof Function ? value(storedValue) : value;

      // Save state

      setStoredValue(valueToStore);

      // Save to local storage

      window.localStorage.setItem(key, JSON.stringify(valueToStore));

    } catch (error) {

      // A more advanced implementation would handle the error case

      console.log(error);

    }

  };



  return [storedValue, setValue];

}
*/
