import Link from 'next/link';
import React, { useState } from 'react';
import { iWarehouse } from '../interfaces';
import { CustomerName, DivRow } from '../styles';
import { initWarehouse, WarehouseForm } from '../forms/warehouse-form';

type SupplierProperty = {
  backColor?: string;
  borderColor?: string;
  onClick: (i: number) => void;
}

export type SupplierListType = {
  data: iWarehouse;
  index: number;
  property?: SupplierProperty;
  isSelected: boolean;
  refreshData: Function
}

export const WarehouseList: React.FunctionComponent<SupplierListType> = ({
  data, index, property, isSelected, refreshData
}) => {
  const [warehouse, setWarehouse] = useState<iWarehouse>(initWarehouse);

  React.useEffect(() => {
    let isLoaded = false;

    const attachSupplier = () => {
      if (!isLoaded) {
        setWarehouse(data);
      }
    };
    attachSupplier();

    return () => { isLoaded = true; };
  }, [data]);

  const reloadData = (method: string, s: iWarehouse) => {
    refreshData(method, s, (ret: iWarehouse) => {
      if (ret) {
        setWarehouse(s)
      };
    });
  };

  return (
    <React.Fragment>
      <DivRow key={`row-${index}`} isActive={isSelected}>
        <div className="row row-cols-2">
          <div className={'col'}>
            <CustomerName
              onMouseDown={(e) => {
                e.preventDefault();
                return false;
              }} onClick={() => property?.onClick(index)}
            >
              {warehouse.id === 0 ? 'Gudang Baru...' : warehouse.name}
            </CustomerName>
            {warehouse.location && <span><br />{warehouse.location}</span>}
          </div>
          <div className={'col'}>
            {warehouse.id !== 0 &&
              <div className={'overflow-hidden d-flex flex-row-reverse'}>
                <Link href={`/warehouse/orders/${warehouse.id}`}>
                  <a className={'see-child text-center overflow-hidden'}><img src={'/images/warehouse.png'} crossOrigin={'anonymous'} />
                  <span className={'overflow-hidden'}>Lihat Stock</span>
                </a>
                </Link>
                <Link href={`/product/warehouse/${warehouse.id}`}>
                  <a className={'see-child text-center overflow-hidden'}><img src={'/images/product.svg'} crossOrigin={'anonymous'} />
                <span className={'overflow-hidden'}>Data Produk</span>
                </a>
                </Link>
              </div>}
          </div>
        </div>
      </DivRow>
      {isSelected &&
        <DivRow key={`row-form-${data.id}`}>
          <WarehouseForm
            key={`sup-sel-${index}`}
            data={data}
            reload={(method, data) => reloadData(method, data)} />
        </DivRow>}
    </React.Fragment>
  );
};
