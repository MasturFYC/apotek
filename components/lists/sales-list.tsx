import Link from 'next/link';
import React from 'react';
import { iSalesman } from '../interfaces';
import { CustomerName, DivRow } from '../styles';
import { SalesForm, salesInit, SalesMethodType } from 'components/forms/sales-form';

type SalesProperty = {
  backColor?: string;
  borderColor?: string;
  onClick: (i: number) => void;
}

type SalesListType = {
  data: iSalesman;
  index: number;
  property?: SalesProperty;
  isSelected: boolean;
  refreshData: (e: SalesMethodType, callback: Function) => void;
};
export const SalesList: React.FunctionComponent<SalesListType> = ({
  data, index, property, isSelected, refreshData
}) => {

  const [sales, setSales] = React.useState<iSalesman>(salesInit);
  React.useEffect(() => {
    let isLoaded = false;

    const attachSales = () => {
      if (!isLoaded) {
        setSales(data);
      }
    };
    attachSales();

    return () => { isLoaded = true; };
  }, [data]);

  const reloadData = (e: { method: string, data: iSalesman }) => {
    refreshData(e, (ret: iSalesman) => {
      if (ret) {
        setSales(ret)
      }
    });
  };

  return (
    <React.Fragment>
      <DivRow key={`row-${index}`} isActive={isSelected}>
        <div className={'col-7 col-md-7'}>
          <CustomerName
            onMouseDown={(e) => {
              e.preventDefault();
              return false;
            }} onClick={() => property?.onClick(index)}
          >
            {sales.id === 0 ? 'New Sales' : sales.name}
          </CustomerName><br />
          <span>{sales.street && `${sales.street} - `}{sales.city}{sales.zip && `, ${sales.zip}`}</span>
          <br /><span>{sales.phone} {sales.cell && ` - ${sales.cell}` || ''}</span>
        </div>
        <div className={'col-5 col-md-5'}>
          {sales.id !== 0 &&
            <div className={'d-flex flex-row-reverse'}>
              <Link href={`/salesman/orders/${sales.id}`}>
                <a className={'see-child'}><img src={'/images/product.svg'} crossOrigin={'anonymous'} />Lihat Order</a>
              </Link>
            </div>}
        </div>
      </DivRow>
      {isSelected &&
        <DivRow key={`row-form-${sales.id}`} className={'row'}>
          <SalesForm
            key={`cust-sel-${index}`}
            data={sales}
            reload={e => reloadData(e)}
          />
        </DivRow>
      }
    </React.Fragment>

  );
};
