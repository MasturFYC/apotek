import Link from 'next/link';
import React, { useState } from 'react';
import { iSupplier } from '../interfaces';
import { CustomerName, DivRow } from '../styles';
import { SupplierForm } from '../forms/supplier-form';

const initSupplier: iSupplier = {
  id: 0,
  name: '',
  contactName: '',
  street: '',
  city: '',
  phone: ''
};

type SupplierProperty = {
  backColor?: string;
  borderColor?: string;
  onClick: (i: number) => void;
}

export type SupplierListType = {
  data: iSupplier;
  index: number;
  property?: SupplierProperty;
  isSelected: boolean;
  refreshData: Function
}

export const SupplierList: React.FunctionComponent<SupplierListType> = ({
  data, index, property, isSelected, refreshData
}) => {
  const [supplier, setSupplier] = useState<iSupplier>(initSupplier);

  React.useEffect(() => {
    let isLoaded = false;

    const attachSupplier = () => {
      if (!isLoaded) {
        setSupplier(data);
      }
    };
    attachSupplier();

    return () => { isLoaded = true; };
  }, [data]);

  const reloadData = (method: string, s: iSupplier) => {
    refreshData(method, s, (ret: iSupplier) => {
      if (ret)
        [
          setSupplier(s)
        ];
    });
  };

  return (
    <React.Fragment>
      <DivRow key={`row-${index}`} isActive={isSelected}>
        <div className={'col-sm-8 col-md-8'}>
          <CustomerName
            onMouseDown={(e) => {
              e.preventDefault();
              return false;
            }} onClick={(e) => property?.onClick(index)}
          >
            {supplier.id === 0 ? 'New Supplier' : supplier.name}
          </CustomerName><br />
          <span>{supplier.street && `${supplier.street} - `}{supplier.city}{supplier.zip && `, ${supplier.zip}`}</span>
          <br /><strong>{supplier.contactName}</strong> <span>{supplier.phone} {supplier.cell && ` - ${supplier.cell}` || ''}</span>
        </div>
        <div className={'col-sm-4 col-md-4 text-nowrap'}>
          {supplier.id !== 0 &&
            <div className={'d-flex flex-row-reverse'}>
              <Link href={`/supplier/orders/${supplier.id}`}>
                <a className={'see-child overflow-hidden'}><img src={'/images/supplier.svg'} crossOrigin={'anonymous'} />
                Lihat Stock
                </a>
              </Link>
              <Link href={`/product/supplier/${supplier.id}`}>
                <a className={'see-child overflow-hidden'}><img src={'/images/product.svg'} crossOrigin={'anonymous'} />
                Data Produk
                </a>
              </Link>
            </div>}
        </div>
      </DivRow>
      {isSelected &&
        <DivRow key={`row-form-${data.id}`}>
          <SupplierForm
            key={`sup-sel-${index}`}
            supplier={data}
            reload={(method, data) => reloadData(method, data)} />
        </DivRow>}
    </React.Fragment>
  );
};
