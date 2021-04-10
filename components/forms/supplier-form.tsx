import React, { useState } from 'react';
import { iSupplier } from '../interfaces';

type SupplierFormType = {
  supplier: iSupplier;
  reload?: (method: string, data: iSupplier) => void;
};

const supplierInit: iSupplier = {
  id: 0,
  name: '',
  contactName: '',
  street: '',
  city: '',
  phone: ''
};

export const SupplierForm: React.FunctionComponent<SupplierFormType> = ({
  supplier: sup, reload
}) => {
  const [supplier, setSupplier] = useState<iSupplier>(supplierInit);

  React.useEffect(() => {
    let isLoaded: boolean = false;

    const attachSupplier = () => {
      if (!isLoaded) {
        setSupplier(sup);
      }
    };

    attachSupplier();

    return () => {
      isLoaded = true;
    };
  }, [sup]);

  const submitForm = (e: React.FormEvent) => {
    e.preventDefault();
    const method = supplier.id === 0 ? 'POST' : 'PUT';
    reload && reload(method, supplier);
  };
  const deleteSupplier = (e: React.MouseEvent) => {
    e.preventDefault();
    const method = 'DELETE';
    reload && reload(method, sup);
  };

  return (
    <form className={'form-floating'} onSubmit={submitForm}>
      <div className={'row'}>
        <div className={'col-md-12 form-floating mb-2'}>
          <input id={'txt-name'} className={'form-control'}
            type={'text'} value={supplier.name} autoFocus
            onChange={(e) => setSupplier({ ...supplier, name: e.target.value })}
            placeholder={'Enter Name'} />
          <label htmlFor={'txt-name'} className={'mx-2 col-form-label'}>Nama Supplier</label>
        </div>

        <div className={'col-md-12 form-floating mb-2'}>
          <input id={'txt-contact-name'} className={'form-control'}
            type={'text'} value={supplier.contactName}
            onChange={(e) => setSupplier({ ...supplier, contactName: e.target.value })}
            placeholder={'Enter Name kontak'} />
          <label htmlFor={'txt-contact-name'} className={'mx-2 col-form-label'}>Nama Kontak</label>
        </div>

        <div className={'col-md-12'}>
          <div className={'row g-2 mb-2'}>
            <div className={'form-floating'}>
              <input id={'txt-address'} className={'form-control'}
                type={'text'} value={supplier.street} placeholder="Nama jalan, blok, rt/rw"
                onChange={(e) => setSupplier({ ...supplier, street: e.target.value })} />
              <label htmlFor={'txt-address'} className={'col-form-label'}>Alamat</label>
            </div>
          </div>

          <div className={'row gx-2'}>
            <div className={'col-md-8 col-lg-8 form-floating mb-2'}>
              <input id={'txt-city'} className={'form-control'}
                type={'text'} value={supplier.city} placeholder={'Kota / kecamatan / kabupaten'}
                onChange={(e) => setSupplier({ ...supplier, city: e.target.value })} />
              <label htmlFor={'txt-city'} className={'col-form-label'}>Kota</label>
            </div>

            <div className={'col-md-4 col-lg-4 form-floating mb-2'}>
              <input className={'form-control'}
                id={'txt-zip'}
                placeholder={'Kode Pos'}
                type={'text'} value={supplier.zip || ''}
                onChange={(e) => setSupplier({ ...supplier, zip: e.target.value })} />
              <label htmlFor={'txt-zip'} className={'col-form-label'}>Kode Pos</label>
            </div>
          </div>

          <div className={'row g-2'}>
            <div className={'col-md-6 form-floating'}>
              <input id={"txt-phone"} type={'text'}
                placeholder={'Nomor contact'} className={'form-control'} value={supplier.phone}
                onChange={(e) => setSupplier({ ...supplier, phone: e.target.value })} />
              <label htmlFor={'txt-phone'} className={'col-form-label'}>Telephone</label>
            </div>

            <div className={'col-md-6 form-floating'}>
              <input id={"txt-cell"} type={'text'}
                placeholder={'Nomor handphone / cellular'}
                className={'form-control'} value={supplier.cell || ''}
                onChange={(e) => setSupplier({ ...supplier, cell: e.target.value })} />
              <label htmlFor={'txt-cell'} className={'form-floating form-label'}>Cellular</label>
            </div>
          </div>
        </div>
      </div>
      <div className={'row g-2 mt-3'}>
        <div className={'col'}>
          <button style={{ width: '90px' }} type="submit" className={'btn no-shadow btn-primary me-2 mb-2'}>
            Save</button>
          <button style={{ width: '90px' }} type="button" className={'btn no-shadow btn-danger mb-2'}
            onClick={(e) => deleteSupplier(e)}
            disabled={supplier.id === 0}>
            Delete</button>
        </div>
      </div>
    </form>
  );
};
