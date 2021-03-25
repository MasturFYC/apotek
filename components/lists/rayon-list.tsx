import Link from 'next/link';
import React, { useState } from 'react';
import { iRayon } from '../interfaces';
import { CustomerName, DivRow } from '../styles';
import { initRayon, RayonForm } from '../forms/rayon-form';

type listProperty = {
  backColor?: string;
  borderColor?: string;
  onClick: (i: number) => void;
}

export type RayonListType = {
  data: iRayon;
  index: number;
  property?: listProperty;
  isSelected: boolean;
  refreshData: Function
}

export const RayonList: React.FunctionComponent<RayonListType> = ({
  data, index, property, isSelected, refreshData
}) => {
  const [rayon, setRayon] = useState<iRayon>(initRayon);

  React.useEffect(() => {
    let isLoaded = false;

    const attachRayon = () => {
      if (!isLoaded) {
        setRayon(data);
      }
    };
    attachRayon();

    return () => { isLoaded = true; };
  }, [data]);

  const reloadData = (method: string, s: iRayon) => {
    refreshData(method, s, (ret: iRayon) => {
      if (ret) {
        setRayon(s)
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
              }} onClick={(e) => property?.onClick(index)}
            >
              {rayon.id === 0 ? 'Rayon Baru...' : rayon.name}
            </CustomerName>
            {rayon.descriptions && <span><br />{rayon.descriptions}</span>}
          </div>
          <div className={'col'}>
            {rayon.id !== 0 &&
              <div className={'overflow-hidden d-flex flex-row-reverse'}>
                <Link href={`/customer/rayon/${rayon.id}`}>
                <a className={'see-child text-center overflow-hidden'}>
                  <img src={'/images/customer.svg'} />
                  <span className={'overflow-hidden'}>Pelanggan</span>
                </a>
                </Link>
              </div>}
          </div>
        </div>
      </DivRow>
      {isSelected &&
        <DivRow key={`row-form-${data.id}`}>
          <RayonForm
            key={`sup-sel-${index}`}
            data={data}
            reload={(method, data) => reloadData(method, data)} />
        </DivRow>}
    </React.Fragment>
  );
};
