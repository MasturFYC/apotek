import React, { useState } from 'react';
import { iCustomer, iRayon } from '../interfaces';
import { CustomerName, DivRow } from '../styles';
import { initCustomer, CustomerForm } from '../forms/customer-form';


type CustomerProperty = {
  backColor?: string;
  borderColor?: string;
  onClick: (i: number) => void;
}
export type CustomerListType = {
  data: iCustomer;
  index: number;
  property?: CustomerProperty;
  isSelected: boolean;
  rayons: iRayon[];
  refreshData: (e: { method: string, data: iCustomer }, callback: Function) => void
}


export const CustomerList: React.FunctionComponent<CustomerListType> = ({
  data, index, property, isSelected, rayons, refreshData
}) => {

  const [customer, setCustomer] = useState<iCustomer>(initCustomer);

  React.useEffect(() => {
    let isLoaded: boolean = false;

    const attachCustomer = () => {
      if (!isLoaded) {
        setCustomer(data);
      }
    };

    attachCustomer();

    return () => {
      isLoaded = true;
    };
  }, [data]);


  const reloadData = (e: { method: string; data: iCustomer; }) => {
    refreshData({ method: e.method, data: e.data }, (ret: iCustomer) => {
      if (ret) {
        setCustomer(ret);
      };
    });
  };


  return (
    <>
      <DivRow key={`div-cust-sel-${index}`}
        className={'row'}
        isActive={isSelected}>
        <div className={'col'}>
          <CustomerName
            onMouseDown={(e) => {
              e.preventDefault();
              return false;
            }} onClick={() => property?.onClick(index)}
          >
            {customer.id === 0 ? 'New Customer' : customer.name}
          </CustomerName>
          <br /><span>{customer.street && `${customer.street} - `}{customer.city}{customer.zip && `, ${customer.zip}`}</span>
          <br /><span>{customer.phone} {customer.cell && ` - ${customer.cell}` || ''}</span>
        </div>
      </DivRow>
      {isSelected &&
        <DivRow className={'row'}>
          <CustomerForm
            key={`cust-sel-${index}`}
            rayons={rayons}
            data={customer}
            reload={e => reloadData(e)} />
        </DivRow>}
    </>
  );
};
