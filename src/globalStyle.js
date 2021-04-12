import { createGlobalStyle } from "styled-components"

export const GlobalStyles = createGlobalStyle`
  body {
    background: ${({ theme }) => theme.body};
    color: ${({ theme }) => theme.text};
    font-family: Roboto, Tahoma, Helvetica, Arial, Roboto, sans-serif;
    transition: all 0.50s linear;
    font-size: 0.9em;
  }
  `
