import { AppProps } from 'next/app'
//import 'bootstrap/scss/bootstrap.scss'
import '../styles/global.css'
//import 'bootstrap/dist/css/bootstrap.min.css'

function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
export default App;
