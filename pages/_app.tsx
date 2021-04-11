import React from 'react';
import { AppProps } from 'next/app'
import { ThemeProvider } from 'styled-components';
import theme from '../src/theme';
import { GlobalStyles } from '../src/globalStyle';
//import styled from "styled-components";

// const Container = styled.div`
//   width: 100%;
//   border: ${props => `1px solid ${props.theme.colors.onyx}`};
//   background-color: ${props => props.theme.colors.lightBlue};
//   font-family: ${props => props.theme.fonts[0]};
// `;

// const Heading = styled.h1<{ isHeading?: boolean }>`
//   font-size: ${({ isHeading, theme: { fontSizes } }) =>
//     isHeading ? fontSizes.large : fontSizes.small};
//   color: ${({ theme: { colors } }) => colors.persianGreen};
// `;

function App(props: AppProps) {
  const { Component, pageProps } = props;

  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement?.removeChild(jssStyles);
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
        <Component {...pageProps} />
    </ThemeProvider>
  )
}
export default App;
