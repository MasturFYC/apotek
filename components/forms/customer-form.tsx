import React, { useState } from 'react';
import Select from 'react-select';
import { customerTypes, iCustomer } from '../interfaces';

export interface iSelectOptions {
  value: number;
  label: string
}

export const initCustomer: iCustomer = {
  id: 0,
  name: '',
  street: '',
  city: '',
  phone: '',
  cell: '',
  rayonId: 0,
  createdAt: new Date,
  updatedAt: new Date,
  creditLimit: 0,
  customerType: 1,
  descriptions: '',
  zip: ''
}

type CustomerFormType = {
  data: iCustomer;
  options: iSelectOptions[];
  reload: (e: { method: string; data: iCustomer; }) => void;
};

export const CustomerForm: React.FunctionComponent<CustomerFormType> = ({
  data, options, reload
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

  const submitForm = (e: React.FormEvent) => {
    e.preventDefault();
    reload && reload({ method: customer.id === 0 ? 'POST' : 'PUT', data: customer });
  };
  const deleteCustomer = (e: React.MouseEvent) => {
    e.preventDefault();
    reload && reload({ method: 'DELETE', data: customer });
  };

  return (
    <form className={'form-floating'} onSubmit={submitForm}>
      <div className={'row gx-3'}>
        <div className={'col-md-6'}>
          <div className={'row g-2'}>
            <div className={'col-md-12 form-floating'}>
              <input id={'txt-name'} className={'form-control'}
                type={'text'} value={customer.name} autoFocus={true}
                onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                placeholder={'Enter Name'} />
              <label htmlFor={'txt-name'} className={'mx-0 col-form-label'}>Nama Pelanggan</label>
            </div>

            <div className={'col-md-12 form-floating'}>
              <input id={'txt-credit'} type={'text'}
                placeholder={'Batas kridit'}
                className={'form-control'} value={customer.creditLimit}
                onChange={(e) => setCustomer({ ...customer, creditLimit: +e.target.value })} />
              <label htmlFor={'txt-credit'} className={'mx-0 col-form-label'}>Limit Credit</label>
            </div>

            <div className={'col-md-6 mb-2'}>
              <div className={'row p-0'}>
                <label htmlFor={'txt-rayon'} className={'col-2 pt-2 col-form-label-md'}>Rayon</label>
                <Select id={'txt-rayon'} className={'col mt-0 py-0'}
                  value={options.filter(x => x.value === customer.rayonId)}
                  onChange={(e) => setCustomer({ ...customer, rayonId: e?.value || 0 })}
                  options={options}
                  placeholder={'Pilih Rayon'} />
              </div>
            </div>
            <div className={'col-md-6 mb-2'}>
              <div className={'row p-0'}>
                <label htmlFor={'txt-type'} className={'col-2 pt-2 col-form-label-md'}>Tipe</label>
                <Select id={'txt-type'} className={'col mt-0 py-0'}
                  value={customerTypes.filter(x => x.value === customer.customerType)}
                  onChange={(e) => setCustomer((state) => ({ ...state, customerType: e?.value || 1 }))}
                  options={customerTypes}
                  placeholder={'Pilih tipe pelanggan...'} />
              </div>
            </div>

          </div>
        </div>

        <div className={'col-md-6'}>
          <div className={'row g-2 mb-2'}>
            <div className={'form-floating'}>
              <input id={'txt-address'} className={'form-control'}
                type={'text'} value={customer.street} placeholder="Nama jalan, blok, rt/rw"
                onChange={(e) => setCustomer({ ...customer, street: e.target.value })} />
              <label htmlFor={'txt-address'} className={'col-form-label'}>Alamat</label>
            </div>
          </div>

          <div className={'row gx-2'}>
            <div className={'col-md-8 col-lg-8 form-floating mb-2'}>
              <input id={'txt-city'} className={'form-control'}
                type={'text'} value={customer.city} placeholder={'Kota / kecamatan / kabupaten'}
                onChange={(e) => setCustomer({ ...customer, city: e.target.value })} />
              <label htmlFor={'txt-city'} className={'col-form-label'}>Kota</label>
            </div>

            <div className={'col-md-4 col-lg-4 form-floating mb-2'}>
              <input className={'form-control'}
                id={'txt-zip'}
                placeholder={'Kode Pos'}
                type={'text'} value={customer.zip || ''}
                onChange={(e) => setCustomer({ ...customer, zip: e.target.value })} />
              <label htmlFor={'txt-zip'} className={'col-form-label'}>Kode Pos</label>
            </div>
          </div>

          <div className={'row g-2'}>
            <div className={'col-md-6 form-floating'}>
              <input id={"txt-phone"} type={'text'}
                placeholder={'Nomor contact'} className={'form-control'} value={customer.phone}
                onChange={(e) => setCustomer({ ...customer, phone: e.target.value })} />
              <label htmlFor={'txt-phone'} className={'col-form-label'}>Telephone</label>
            </div>

            <div className={'col-md-6 form-floating'}>
              <input id={"txt-cell"} type={'text'}
                placeholder={'Nomor handphone / cellular'}
                className={'form-control'} value={customer.cell || ''}
                onChange={(e) => setCustomer({ ...customer, cell: e.target.value })} />
              <label htmlFor={'txt-cell'} className={'form-floating form-label'}>Cellular</label>
            </div>
          </div>
        </div>
      </div>
      <div className={'row g-3 mt-0 d-flex align-items-center'}>
        <div className={'col-md-8 form-floating'}>
          <textarea style={{ height: '90px' }} id={'txt-desc'}
            placeholder={'Keterangan'} className={'form-control'}
            value={customer.descriptions || ''}
            onChange={(e) => setCustomer({ ...customer, descriptions: e.target.value })} />
          <label htmlFor={'txt-desc'} className={'mx-2 col-form-label'}>Keterangan</label>
        </div>

        <div className="col-md-4 col-lg-4">
          <div className={'row'}>
            <div className={'col-md-6'}>
              <button type="submit" className={'btn align-middle no-border no-shadow w-100 btn-primary mb-2'}>
                Save</button>
            </div>

            <div className={'col-md-6'}>
              <button type="button" className={'btn no-shadow w-100 btn-danger mb-2'}
                onClick={(e) => deleteCustomer(e)}
                disabled={customer.id === 0}>
                Delete</button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};
