//import React from 'react';
import styled from 'styled-components';

const getWidthString = (span?: any) => {
  if (!span) return;
  const width = +span / 12 * 100;
  return `width: ${width}%`;
}

export const Row = styled.div`
  &::after {
    content: '';
    clear: both;
    display: table;
  }
`;

export const Col = styled.div<{ xs?: any, sm?: any, md?: any, lg?: any }>`
  float: left;

  ${({ xs }) => (xs ? getWidthString(xs) : "width: 100%")};

  @media only screen and (min—width: 768px) {
    ${({ sm }) => (sm && getWidthString(sm))};
  }

  @media only screen and (min—width: 992px) {
    ${({ md }) => (md && getWidthString(md))};
  }

  @media only screen and (min—width: 1200px) {
    ${({ lg }) => (lg && getWidthString(lg))};
  }
`;
