import React, { useState } from 'react';
import { iWarehouse } from '../interfaces';

type WarehouseFormType = {
  data: iWarehouse;
  reload?: (method: string, data: iWarehouse) => void;
};

export const initWarehouse: iWarehouse = {
  id: 0,
  name: '',
  location: ''
};

export const WarehouseForm: React.FunctionComponent<WarehouseFormType> = ({
  data, reload
}) => {
  const [warehouse, setWarehouse] = useState<iWarehouse>(initWarehouse);

  React.useEffect(() => {
    let isLoaded: boolean = false;

    const attachWarehouse = () => {
      if (!isLoaded) {
        setWarehouse(data);
      }
    };

    attachWarehouse();

    return () => {
      isLoaded = true;
    };
  }, [data]);

  const submitForm = (e: React.FormEvent) => {
    e.preventDefault();
    const method = warehouse.id === 0 ? 'POST' : 'PUT';
    reload && reload(method, warehouse);
  };
  const deleteWarehouse = (e: React.MouseEvent) => {
    e.preventDefault();
    const method = 'DELETE';
    reload && reload(method, data);
  };

  return (
    <form className={'form-floating'} onSubmit={submitForm}>
      <div className={'row'}>
        <div className={'col-md-6 form-floating mb-2'}>
          <input id={'txt-name'} className={'form-control'}
            type={'text'} value={warehouse.name} autoFocus
            onChange={(e) => setWarehouse((state) => ({ ...state, name: e.target.value }))}
            placeholder={'Enter Name'} />
          <label htmlFor={'txt-name'} className={'mx-2 col-form-label'}>Nama Gudang</label>
        </div>

        <div className={'col-md-6 form-floating mb-2'}>
          <input id={'txt-contact-name'} className={'form-control'}
            type={'text'} value={warehouse.location}
            onChange={(e) => setWarehouse((state) => ({ ...state, location: e.target.value }))}
            placeholder={'Enter Name kontak'} />
          <label htmlFor={'txt-contact-name'} className={'mx-2 col-form-label'}>Lokasi</label>
        </div>
      </div>
      <div className={'row g-2 mt-3'}>
        <div className={'col'}>
          <button style={{ width: '90px' }} type="submit" className={'btn no-shadow btn-primary me-2 mb-2'}>
            Save</button>
          <button style={{ width: '90px' }} type="button" className={'btn no-shadow btn-danger mb-2'}
            onClick={(e) => deleteWarehouse(e)}
            disabled={warehouse.id === 0}>
            Delete</button>
        </div>
      </div>
    </form>
  );
};
