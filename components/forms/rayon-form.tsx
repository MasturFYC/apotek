import React, { useState } from 'react';
import { iRayon } from '../interfaces';

type RayonFormType = {
  data: iRayon;
  reload?: (method: string, data: iRayon) => void;
};

export const initRayon: iRayon = {
  id: 0,
  name: ''
};

export const RayonForm: React.FunctionComponent<RayonFormType> = ({
  data, reload
}) => {
  const [rayon, setRayon] = useState<iRayon>(initRayon);

  React.useEffect(() => {
    let isLoaded: boolean = false;

    const attachRayon = () => {
      if (!isLoaded) {
        setRayon(data);
      }
    };

    attachRayon();

    return () => {
      isLoaded = true;
    };
  }, [data]);

  const submitForm = (e: React.FormEvent) => {
    e.preventDefault();
    const method = rayon.id === 0 ? 'POST' : 'PUT';
    reload && reload(method, rayon);
  };
  const deleteRayon = (e: React.MouseEvent) => {
    e.preventDefault();
    const method = 'DELETE';
    reload && reload(method, data);
  };

  return (
    <form className={'form-floating'} onSubmit={submitForm}>
      <div className={'row'}>
        <div className={'col-md-6 form-floating mb-2'}>
          <input id={'txt-name'} className={'form-control'}
            type={'text'} value={rayon.name} autoFocus
            onChange={(e) => setRayon((state) => ({ ...state, name: e.target.value }))}
            placeholder={'Enter Name'} />
          <label htmlFor={'txt-name'} className={'mx-2 col-form-label'}>Nama Rayon</label>
        </div>

        <div className={'col-md-6 form-floating mb-2'}>
          <input id={'txt-contact-name'} className={'form-control'}
            type={'text'} value={rayon.descriptions || ''}
            onChange={(e) => setRayon((state) => ({ ...state, descriptions: e.target.value }))}
            placeholder={'Keterangan'} />
          <label htmlFor={'txt-contact-name'} className={'mx-2 col-form-label'}>Keterangan</label>
        </div>
      </div>
      <div className={'row g-2 mt-3'}>
        <div className={'col'}>
          <button style={{ width: '90px' }} type="submit" className={'btn no-shadow btn-primary me-2 mb-2'}>
            Save</button>
          <button style={{ width: '90px' }} type="button" className={'btn no-shadow btn-danger mb-2'}
            onClick={(e) => deleteRayon(e)}
            disabled={rayon.id === 0}>
            Delete</button>
        </div>
      </div>
    </form>
  );
};
