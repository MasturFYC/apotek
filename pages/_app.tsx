import { AppProps } from 'next/app'
import '../styles/global.css'
import 'bootstrap/dist/css/bootstrap.css'

function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
export default App;
