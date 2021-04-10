import Link from 'next/link';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
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


const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(1),
  },
  paper: {
    padding: theme.spacing(1),
    textAlign: 'left',
    color: theme.palette.text.secondary
  },
  paperRight: {
    padding: theme.spacing(1),
    textAlign: 'center',
    border: 0
  },
  image: {
    width: 24,
    paddingRight: 4,
    verticalAlign: 'middle'
  },

  selected: {
    borderColor: theme.palette.text.primary
  }


}));


export const SalesList: React.FunctionComponent<SalesListType> = ({
  data, index, property, isSelected, refreshData
}) => {
  const css = useStyles();
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
    <div className={css.root}>
      <Grid key={`row-${index}`} container spacing={2} className={isSelected && css.selected || ''}>
        <Grid item xs={8}>
          <Paper className={css.paper}>
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
          </Paper>
        </Grid>
        <Grid item xs={4}>
          {sales.id !== 0 &&
            <Paper className={css.paperRight}>
              <Link href={`/salesman/orders/${sales.id}`}>
                <a className={'see-child'}><img src={'/images/product.svg'} className={css.image} />Lihat Order</a>
              </Link>
            </Paper>}
        </Grid>
      </Grid>
      {isSelected &&
        <Grid key={`row-form-${sales.id}`} container spacing={2}>
          <Grid item xs={12}>
          <Paper className={css.paper}>
          <SalesForm
            key={`cust-sel-${index}`}
            data={sales}
            reload={e => reloadData(e)}
          />
          </Paper>
          </Grid>
        </Grid>
      }
    </div>

  );
};
