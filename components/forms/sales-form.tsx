import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

import { iSalesman } from '../interfaces';

export type SalesMethodType = {
  method: string;
  data: iSalesman;
}
type SalesFormType = {
  data: iSalesman;
  reload?: (e: SalesMethodType) => void;
};

export const salesInit: iSalesman = {
  id: 0,
  name: '',
  street: '',
  city: '',
  phone: ''
};

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },

  btn: {
    marginRight: 6
  }
}));

export const SalesForm: React.FunctionComponent<SalesFormType> = ({
  data, reload
}) => {
  const css = useStyles();
  const [sales, setSales] = useState<iSalesman>(salesInit);

  React.useEffect(() => {
    let isLoaded: boolean = false;

    const attachSales = () => {
      if (!isLoaded) {
        setSales(data);
      }
    };

    attachSales();

    return () => {
      isLoaded = true;
    };
  }, [data]);

  const submitForm = (e: React.FormEvent) => {
    e.preventDefault();
    const method = sales.id === 0 ? 'POST' : 'PUT';
    reload && reload({ method: method, data: sales });
  };

  const deleteSales = (e: React.MouseEvent) => {
    e.preventDefault();
    reload && reload({ method: 'DELETE', data: sales });
  };

  return (
    <form className={'form-floating'} onSubmit={submitForm}>
      <div className={'row'}>
        <div className={'col-md-12 form-floating mb-2'}>
          <input id={'txt-name'} className={'form-control'}
            type={'text'} value={sales.name} autoFocus={true}
            onChange={(e) => setSales({ ...sales, name: e.target.value })}
            placeholder={'Enter Name'} />
          <label htmlFor={'txt-name'} className={'mx-0 col-form-label'}>Nama Sales</label>
        </div>

        <div className={'col-md-12'}>
          <div className={'row g-2 mb-2'}>
            <div className={'form-floating'}>
              <input id={'txt-address'} className={'form-control'}
                type={'text'} value={sales.street} placeholder="Nama jalan, blok, rt/rw"
                onChange={(e) => setSales({ ...sales, street: e.target.value })} />
              <label htmlFor={'txt-address'} className={'col-form-label'}>Alamat</label>
            </div>
          </div>

          <div className={'row gx-2'}>
            <div className={'col-md-8 col-lg-8 form-floating mb-2'}>
              <input id={'txt-city'} className={'form-control'}
                type={'text'} value={sales.city} placeholder={'Kota / kecamatan / kabupaten'}
                onChange={(e) => setSales({ ...sales, city: e.target.value })} />
              <label htmlFor={'txt-city'} className={'col-form-label'}>Kota</label>
            </div>

            <div className={'col-md-4 col-lg-4 form-floating mb-2'}>
              <input className={'form-control'}
                id={'txt-zip'}
                placeholder={'Kode Pos'}
                type={'text'} value={sales.zip || ''}
                onChange={(e) => setSales({ ...sales, zip: e.target.value })} />
              <label htmlFor={'txt-zip'} className={'col-form-label'}>Kode Pos</label>
            </div>
          </div>

          <div className={'row g-2'}>
            <div className={'col-md-6 form-floating'}>
              <input id={"txt-phone"} type={'text'}
                placeholder={'Nomor contact'} className={'form-control'} value={sales.phone}
                onChange={(e) => setSales({ ...sales, phone: e.target.value })} />
              <label htmlFor={'txt-phone'} className={'col-form-label'}>Telephone</label>
            </div>

            <div className={'col-md-6 form-floating'}>
              <input id={"txt-cell"} type={'text'}
                placeholder={'Nomor handphone / cellular'}
                className={'form-control'} value={sales.cell || ''}
                onChange={(e) => setSales({ ...sales, cell: e.target.value })} />
              <label htmlFor={'txt-cell'} className={'form-floating form-label'}>Cellular</label>
            </div>
          </div>
        </div>
      </div>
      <Grid container spacing={2} className={css.root}>
        <Grid item xs={12}>
          <Paper>
          <Button variant={'contained'} color={'primary'} type={'submit'}
          className={css.btn}>Save</Button>

          <Button type={'button'} variant={'contained'} color={'secondary'}
            onClick={(e) => deleteSales(e)}
            disabled={sales.id === 0}>Delete</Button>
            </Paper>
        </Grid>
      </Grid>
    </form>
  );
};
