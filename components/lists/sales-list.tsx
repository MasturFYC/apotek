import Link from 'next/link';
import React from 'react';
import { iSalesman } from '../interfaces';
import { SalesForm, salesInit, SalesMethodType } from 'components/forms/sales-form';
import css from '../../styles/my-style.module.scss'

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
      <div key={`row-${index}`} className={`${isSelected && '' || ''} ${css.divRow}`}>
          <div className={'col col-md-8'}>
            <span className={css.focusEl}
              onMouseDown={(e) => {
                e.preventDefault();
                return false;
              }} onClick={() => property?.onClick(index)}
            role={'button'}>
              {sales.id === 0 ? 'New Sales' : sales.name}
            </span><br />
            <span>{sales.street && `${sales.street} - `}{sales.city}{sales.zip && `, ${sales.zip}`}</span>
            <br /><span>{sales.phone} {sales.cell && ` - ${sales.cell}` || ''}</span>
          </div>
        <div className={'col col-md-4'}>
          {sales.id !== 0 &&
            <div>
              <Link href={`/salesman/orders/${sales.id}`}>
                <a className={'see-child'}><img src={'/images/product.svg'} />Lihat Order</a>
              </Link>
            </div>}
        </div>
      </div>
      {isSelected &&
        <div key={`row-form-${sales.id}`} className={css.divRow}>
          <div>
          <div>
          <SalesForm
            key={`cust-sel-${index}`}
            data={sales}
            reload={e => reloadData(e)}
          />
          </div>
          </div>
        </div>
      }
    </React.Fragment>

  );
};
