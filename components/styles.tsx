import styled from 'styled-components';

export const CustomerName = styled.span`
  cursor: pointer;
  display: inline-block;
  font-weight: 700;
  padding: 1px 6px 3px 6px;
  margin-left: -6px;
  border-radius: 0.25rem;
  &:hover {
    background-color: #0d6efd;
    color: #ffffff;

  };
  &:active {
    color: #ffffff;
    background-color: #0856ca;
  };
  > a:hover {
    color: #ffffff;
    text-decoration: none;
  }
`;

export const FocusSpan = styled(CustomerName)`
`

export const QtyLabel = styled.span`
  display: inline-block;
  min-width: 30px;
  text-align: right;
  padding-right: 3px;
`

export const UnitLabel = styled.span`
  display: inline-block;
  min-width: 20px;
  text-align: left;
`

interface iDivActive {
  index: number;
  refId: number;
  isSelected: boolean
}

export const SelectedDiv = styled.div<iDivActive>`
  background-color: ${props => {
    if (props.isSelected) {
      return '#f1f8ff';
    }
    return props.index % 2 === 0 ? '#f8f9fa' : '#e9ecef'
  }};
  border-bottom-left-radius: ${props => props.refId === 0 && '3px'};
  border-bottom-right-radius: ${props => props.refId === 0 && '3px'};
  border-top-left-radius: ${props => props.index === 0 && '3px'};
  border-top-right-radius: ${props => props.index === 0 && '3px'};
  border-bottom: ${props => props.refId === 0 ? 'none' : '1px solid'};
  border-color: #ced4da;
  font-size: 14px;
  padding: 6px 10px;
  &:hover {
    background-color: #f1f8ff;
  }
`;

export const CustomerFormDiv = styled.div`
margin: 0px -13px -11px -13px;
padding: 0px 13px 6px 13px;
`;

// interface iRowIndex {
//   index: number;
//   length: number;
// }

//background-color: '#f7f9fb';

// interface iDivRow {
//   isActive?: boolean;
//   class?: string;
// }

const divRow = styled.div<{ isActive?: boolean }>`
  padding-top: 0.25rem;
  padding-bottom: 0.5rem;
  border: 1px solid #e1e4e8;
  border-radius: 0;
  border-top: none;

  &:first-child {
    border-top: 1px solid #e1e4e8;
    border-top-left-radius:  06px;
    border-top-right-radius:  6px;
  }

  &:last-child {
    border-bottom-left-radius:  6px;
    border-bottom-right-radius:  6px;
    margin-bottom: 50px;
  }

  &:hover {
    background-color: #f1f7fc;
  }

  a {
    text-decoration: none;
  }

  form {
    margin-top: -0.25rem;
    margin-bottom: -0.5rem;
    padding: 1.5rem;
    background-color: #f1f7fc;
    border: 0;
  }

  img {
    width: 16px;
    margin-top: -2px;
    vertical-align: middle;
    margin-right: 3px;
  }
  ${props => props.isActive && 'background-color: #e9f1fa;'}
`
export const DivRow = styled(divRow).attrs({
  className: 'row'
})``


export const DivHead = styled.div`
  background-color: #f1f7fc;
  margin: 0px;
  padding: 6px 12px;
  border: 1px solid #cbe0f4;
  border-bottom: 0px;
  border-radius: 6px;
`

export const AppMain = styled.main.attrs({
  className: 'section'
})`
//  padding-top: 2.0rem;
//  padding-bottom: 1.0rem;
  background-color: #ffffff;
`
export const AppTitle = styled.div.attrs({ className: 'container-fluid bg-light' })` &&& {
  font-weight: 400;
  text-align: left;
  font-size: 1.5rem;
  color: #0856ca;
  padding-top: 6px;
  padding-bottom: 0;
  margin-bottom: 0rem;
}
`
export const AppContent = styled.section.attrs({
  className: 'container'
})` &&& {
  margin-top: 2.0rem;
  margin-bottom: 2.0rem;
//  background-color: #cecece;
}
`

export const AppHeader = styled.header.attrs({
  className: ' bg-light '
})` &&& {
  display: flex;
  white-space: nowrap;
  flex-direction: column;
  align-items: center;
  > img {
    display: inline;
    width: 24px;
    margin-right: 0.5rem
  }
}
`
export const AppMenu = styled.section.attrs({
  className: 'border-bottom bg-light pb-2'
})` &&& {
}
`
export const DivMenu = styled.div.attrs({
  className: 'text-dark container sticky-top'
})` &&& {
  margin-bottom: 4px;
  padding-top: 1.5rem;
  white-space: nowrap;
  a {
    color: #212529;
    text-decoration: none;
    padding: 6px 12px 13px 12px;
    &:hover {
      border-bottom: 2px solid #adb5bd;
      background-color: #edeffe;
      border-top-left-radius: 0.5rem;
      border-top-right-radius: 0.5rem;
    }
    &:active {
      border-bottom: 2px solid #fd7e14;
      background-color: #e1e8fe;
      border-top-left-radius: 0.5rem;
      border-top-right-radius: 0.5rem;
    }
    img {
      display: inline;
      margin-right: 6px;
      margin-top: -3px;
      width: 16px;
      vertical-align: middle;
    }
  }
  > .an-active {
    border-bottom: 2px solid #fd7e14;
  }
}
`

const formLabel = styled.label.attrs({
  className: 'col-form-label'
})``

export const FLabel = styled(formLabel)`
`

interface iTabStyle {
  isSelected?: boolean
}

export const TabStyle = styled.div<iTabStyle>`
  cursor: pointer;
  margin-bottom: -1px;
  margin-left: -1px;
  padding-top: 5px;
  padding-bottom: 5px;
  border: 1px solid #dedede;
  border-bottom: ${props => props.isSelected ? 'none' : '1px solid #dedede'};
  background-color: ${props => props.isSelected ? '#ffffff' : '#f8f9fa'};
`;
