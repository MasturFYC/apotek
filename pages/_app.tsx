import React from 'react';
import { AppProps } from 'next/app'
import '../styles/global.scss'

function App(props: AppProps) {
  const { Component, pageProps } = props;

  // React.useEffect(() => {
  //   // Remove the server-side injected CSS.
  //   const jssStyles = document.querySelector('#jss-server-side');
  //   if (jssStyles) {
  //     jssStyles.parentElement?.removeChild(jssStyles);
  //   }
  // }, []);

  return (
        <Component {...pageProps} />
  )
}
export default App;
