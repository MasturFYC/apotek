import React, { useContext, useState } from 'react';
import OrderContext, { OrderContextType } from 'components/context/order-context';
import { iOrderDetail, iProduct } from 'components/interfaces';
import { DivRow } from 'components/styles';
import styled from 'styled-components';
import Select from 'react-select';
import { initProduct } from './product-fom';
import NumberFormat from 'react-number-format';

interface iProductUnit {
  index: number;
  show: boolean;
  product: iProduct;
  qty: number;
  unitId: number;
  detail?: iOrderDetail;
}

const SearchProductForDetail: React.FunctionComponent = () => {
  const ctx = useContext<OrderContextType>(OrderContext);
  const [products, setProducts] = useState<iProductUnit[]>([]);
  const [text, setText] = React.useState<string>('');
  /*
  React.useEffect(()=> {
    let isLoaded = false;

    const loadContext = () => {
      if(!isLoaded) {

      }
    }

  }, [ctx.order])
*/

  const submitForm = (e: React.FormEvent) => {
    e.preventDefault();
    doSearch(text);
  }

  const doSearch = async (txt: string) => {

    if (txt.trim().length <= 2) return;

    const baseUrl = `/api/product/search/${txt}`;

    const res = await fetch(baseUrl, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      }
    });

    const data: iProduct[] | any = await res.json();

    //console.log(data)
    if (res.status !== 200) {
      alert(data.message);
    } else {
      setProducts([]);
      for (let c = 0; c < data.length; c++) {
        setProducts(state => ([...state, { unitId: 0, qty: 0, index: c, show: false, product: data[c] }]))
      }
    }
  }

  const addQty = (item: iProductUnit) => {
    if (ctx.order && ctx.order.details && ctx.mutate) {
      let i = -1;
      for (let c = 0; c < ctx.order.details.length; c++) {
        if (ctx.order.details[c].unitId === item.unitId) {
          i = c;
          break;
        }
      }

      if (i !== -1) {
        const detail = { ...ctx.order.details[i],
          qty: (+item.qty),
          subtotal: (+item.qty) * ((+ctx.order.details[i].price) - (+ctx.order.details[i].discount)),
          unitId: item.unitId
        }

        console.log(detail)
        ctx.order.details.splice(i, 1, detail);
        ctx.mutate(ctx.order, false)
      }
    }
  }

  const removeQty = (item: iProductUnit) => {

  }

  return (
    <React.Fragment>
      <div className={'container d-flex justify-content-center mb-3'}>
        <form onSubmit={e => submitForm(e)}>
          <div className={'input-group'}>
            <input style={{ minWidth: '200px' }}
              value={text} onChange={(e) => {
                setText(e.target.value);
                doSearch(e.target.value)
              }
              }
              type={'search'} id={'txt-search'}
              autoFocus className={'form-control'} />
            <button type={'submit'} className={'btn btn-primary'}>
              <i className={'fas fa-search'}></i>{' Search'}</button>
          </div>
        </form>
      </div>
      <div className={'container'}>
        {products && products.length > 0 && products.map((item, index) => {
          return (
            <ShowProduct key={`prod-key-${index}`} index={index} product={item} addQty={addQty} removeQty={removeQty}
              loadCurrentItem={(e, callback) => {
                const details = ctx.order && ctx.order.details;
                if (details) {
                  //const test = details.map(x => (x.id))
                  //console.log(test)
                  //console.log(e)
                  callback(details.filter(x => x.productId === e.product.id)[0])
                }
              }} />
          )
        })}
      </div>
    </React.Fragment>
  )
}

const selectStyles = {
  control: (styles: any) => ({
    ...styles,
    border: 0,
    borderRadius: 0,
    marginLeft: -1,
  }),
  singleValue: (provided: any, state: any) => {
    const maxHeight = 22;
    const border = 0;
    const padding = 0;
    const margin = 0;
    return { ...provided, border, maxHeight, padding, margin }
  }
}

export default SearchProductForDetail;

const ShowProduct: React.FunctionComponent<{
  index: number,
  product: iProductUnit,
  addQty: (item: iProductUnit) => void,
  removeQty: (item: iProductUnit) => void,
  loadCurrentItem: (item: iProductUnit, fnDetail: (detail: iOrderDetail) => void) => void
}> = ({ index, product, addQty, removeQty, loadCurrentItem }) => {
  const [pItem, setPItem] = React.useState<iProductUnit>({ qty: 0, unitId: 0, index: 0, show: false, product: initProduct(0) });

  React.useEffect(() => {
    let isLoaded = false;

    const loadData = () => {
      if (!isLoaded) {
        setPItem(product)
      }
    }

    loadData();
    return () => { isLoaded = true }
  }, [product])

  const add_Qty = (e: iProductUnit) => {
    const qty = (+e.qty) + 1;
    setPItem(state => ({ ...state, qty: qty }))
    addQty(pItem)
  }

  const remove_Qty = (e: iProductUnit) => {
    const qty = (+e.qty) <= 1 ? 1 : (+e.qty) - 1;
    setPItem(state => ({ ...state, qty: qty }))
  }

  return <DivRow>
    <div className={'col-md-6 my-2'}
      onClick={() => {
        if (!pItem.show) {
          loadCurrentItem(pItem, e => {
            if (e) {
              setPItem(state => ({
                ...state,
                unitId: e.unitId,
                detail: e,
                qty: e.qty,
                show: !state.show
              }));
            } else {
              setPItem(state => ({ ...state, qty: 0, show: !state.show }))
            }
          })
        }
        else {
          setPItem(state => ({ ...state, show: !state.show }))
        }
      }} role={'button'}>{pItem.product.name}{pItem.product.spec && `, ${pItem.product.spec}`}</div>
    {
      pItem.show &&
      <div className={'col-md-12'}>
        <div className={'row form-inline g-2'}>
          <div className="input-group">
            <label htmlFor={'prod-qty'} className="input-group-text">Qty:</label>
            <NumberFormat id={'prod-qty'} value={pItem.qty} className={'form-control'}
              onValueChange={e => setPItem(state => ({ ...state, qty: e.floatValue || 0 }))}
            />
            <label htmlFor={'prod-unit'} className="input-group-text">Unit:</label>
            <Select id={'prod-unit'}
              className={'form-control m-0 p-0 w-25'}
              placeholder={'Pilih unit...'}
              styles={selectStyles}
              value={pItem.product.units?.filter(x => x.id === pItem.unitId)}
              onChange={e => setPItem(state => ({ ...state, unitId: e?.id || 0 }))}
              options={pItem.product.units}
              getOptionLabel={x => x.name}
              getOptionValue={x => `${x.id}`} />
            <button className="input-group-button btn btn-primary" onClick={e => add_Qty(pItem)}>+</button>
            <button className="input-group-button btn btn-primary" onClick={e => remove_Qty(pItem)}>{' - '}</button>
          </div>
        </div>
      </div>
    }
  </DivRow >
}
