import React, { useState } from 'react';
import { iCustomer } from '../interfaces';
import { CustomerName, DivRow } from '../styles';
import { initCustomer, CustomerForm } from '../forms/customer-form';
import { CustomerListType } from '../../pages/customer/index';

export const CustomerList: React.FunctionComponent<CustomerListType> = ({
  data, index, property, isSelected, selOptions, refreshData
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
            }} onClick={(e) => property?.onClick(index)}
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
            options={selOptions}
            data={customer}
            reload={e => reloadData(e)} />
        </DivRow>}
    </>
  );
};
