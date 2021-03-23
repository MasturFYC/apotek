import styled from 'styled-components';

export const CustomerName = styled.span`
  cursor: pointer;
  display: inline-block;
  font-weight: 700;
  font-size: 1rem;
  padding: 3px 6px 5px 6px;
  margin-left: -6px;
  border-radius: 0.25rem;
  &:hover {
    background-color: #0d6efd;
    color: #fff;

  };
  &:active {
    color: #fff;
    background-color: #0856ca;
  };
`;

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

interface iRowIndex {
  index: number;
  length: number;
}

//background-color: '#f7f9fb';

export const DivRow = styled.div`
border: 1px solid #e1e4e8;
border-radius: 0;
border-top: none;
&:first-child {
  border-top: 1px solid #e1e4e8;
  border-top-left-radius:  06px;
  border-top-right-radius:  6px;
};
&:last-child {
  border-bottom-left-radius:  6px;
  border-bottom-right-radius:  6px;
};

&:hover {
  background-color: #f1f7fc;
};
> form {
  padding: 12px 12px 6px 12px;
  background-color: #f1f7fc;
}
`

export const DivHead = styled.div`
background-color: #f1f7fc;
margin: 0;
padding: 6px 12px;
border: 1px solid #cbe0f4;
border-bottom: 0;
border-radius: 6px;
`