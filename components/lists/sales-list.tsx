import Link from 'next/link';
import React, { useContext } from 'react';
import { ThemeContext } from 'styled-components';
import { iSalesman } from '../interfaces';
import { SalesForm, salesInit, SalesMethodType } from 'components/forms/sales-form';
import { DivRow } from 'components/styles';

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

  const themeContext = useContext(ThemeContext);
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
      <DivRow>
        <div>
          <span
            role={'button'}
            onMouseDown={(e) => {
              e.preventDefault();
              return false;
            }} onClick={() => property?.onClick(index)}
          >
            {sales.id === 0 ? 'New Sales' : sales.name}
          </span><br />
          <span>{sales.street && `${sales.street} - `}{sales.city}{sales.zip && `, ${sales.zip}`}</span>
          <br /><span>{sales.phone} {sales.cell && ` - ${sales.cell}` || ''}</span>
        </div>
        <div>
          {sales.id !== 0 &&
            <Link href={`/salesman/orders/${sales.id}`}>
              <a className={'see-child'}><img src={'/images/product.svg'} />Lihat Order</a>
            </Link>
          }
        </div>
      </DivRow>
      {isSelected &&
        <DivRow key={`row-form-${sales.id}`}>
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
