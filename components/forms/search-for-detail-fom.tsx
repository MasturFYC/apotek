import React, { useContext, useState } from 'react';
import OrderContext, { OrderContextType } from 'components/context/order-context';
import { iProduct } from 'components/interfaces';
import { DivRow } from 'components/styles';
import styled from 'styled-components';

const SearchProductForDetail: React.FunctionComponent = () => {
  const ctx: OrderContextType = useContext(OrderContext);
  const [products, setProducts] = useState<iProduct[]>([]);
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

    console.log(data)
    if (res.status !== 200) {
      alert(data.message);
    } else {
      setProducts(data);
    }

  }

  return (
    <React.Fragment>
      <div className={'container d-flex justify-content-center mb-3'}>
        <form onSubmit={e => submitForm(e)}>
          <div className={'input-group'}>
            <input style={{ minWidth: '200px' }}
              value={text} onChange={(e) => {
                setText(e.target.value);
                doSearch(e.target.value)}
              }              
              type={'search'} id={'txt-search'}
              autoFocus className={'form-control'} />
            <button type={'submit'} className={'btn btn-primary'}>
              <i className={'fas fa-search'}></i> Search
            </button>
          </div>
        </form>
      </div>
      <div className={'container'}>
        {products && products.length > 0 && products.map((item, index) => {
          return (
            <DivRow key={`prod-key-${index}`}>
              <div className={'col-md-6'}>
                {item.name}
              </div>
            </DivRow>
          )
        })}
      </div>
    </React.Fragment>
  )
}

export default SearchProductForDetail;