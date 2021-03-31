import React, { FormEvent, useContext, useRef, useState } from 'react';
import { iOrderDetail, iUnit } from 'components/interfaces';
import OrderContext, { OrderContextType } from 'components/context/order-context';
import { DivRow, FLabel } from 'components/styles';
import NumberFormat from 'react-number-format';

const initDetail = (id: number): iOrderDetail => {
  return {
    id: 0,
    orderId: id,
    productId: 0,
    unitId: 0,
    qty: 1,
    realQty: 0,
    profit: 0,
    price: 0,
    weight: 0,
    barcode: '',
    productName: '',
    spec: '',
    unitName: '',
    discount: 0,
    subtotal: 0
  }
}

export const OrderDetailList = () => {
  const qtyRef = useRef<HTMLInputElement>(null);
  const discountRef = useRef<HTMLInputElement>(null);
  const barcodeRef = useRef<HTMLInputElement>(null);
  const submitRef = useRef<HTMLButtonElement>(null);
  const ctx: OrderContextType = useContext(OrderContext);
  const [selectedRow, setSelectedRow] = useState(-1);
  const [detail, setDetail] = useState<iOrderDetail>(initDetail(ctx.order && ctx.order.id || 0))
  //  const [detailId, setDetailId] = useState<number>(1);

  const formSubmit = () => {

    //    console.log('submit')

    if (ctx.order && ctx.order.details && ctx.updateValue) {
      const currentIndex = selectedRow;
      const isNew = detail.id === 0;
      const len = ctx.order.details.length - (isNew ? 0 : 1);
      //console.log(detail)

      ctx.updateValue(detail, isNew ? 'POST' : 'PUT', (data) => {
        const curIndex = currentIndex + 1;
        //if (isNew && data) {
        //setDetail(initDetail(data.orderId)) //(state) => ({...state, id: data.id}));
        // isNew && data && setDetail(initDetail(data.orderId))
        //console.log(len, currentIndex);
        setSelectedRow(curIndex);
        len === currentIndex
          ? setDetail(initDetail(ctx?.order?.id || 0))
          : ctx.order && ctx.order.details && setDetail(ctx.order.details[curIndex]);
        //setSelectedRow(curIndex);
        //}
        // else {
        //   console.log({ 'local': detail, 'updated': data })
        //   //setDetail(data);
        //   //setSelectedRow(currentIndex);
        // }
      });
    }
  }

  const getProductByBarcode = async () => {
    const baseUrl = `/api/unit/barcode`;

    const res = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      },
      body: JSON.stringify({ barcode: detail.barcode.trim() })
    });

    const data: iUnit | any = await res.json();

    if (res.status !== 200) {
      alert(data.message);
    } else {
      //const row = selectedRow;
      //setSelectedRow(-1)
      setDetail((state) => ({
        ...state,
        barcode: data.barcode,
        productId: data.productId,
        unitId: data.id,
        productName: data.product.name,
        weight: data.weight,
        spec: data.product.spec,
        unitName: data.name,
        price: data.salePrice,
        subtotal: ((+data.salePrice) - (+detail.discount)) * (+detail.qty),
        realQty: (+data.content) * (+detail.qty)
      }))

      const objRef = qtyRef.current;
      if (objRef) {
        objRef.focus();
        objRef.setSelectionRange(0, objRef.value.length)
      }
    }
  }

  const deleteDetail = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    if (ctx.order && ctx.order.details && ctx.updateValue) {
      ctx.updateValue(detail, 'DELETE', (data) => {
        if (data) {
          const curIndex = selectedRow - 1;
          setSelectedRow(curIndex);
          ctx.order && ctx.order.details && setDetail(ctx.order.details[curIndex]);
        }
      });
    }
  }

  //console.log(ctx.order)

  return (
    <React.Fragment>
      {ctx.order && ctx.order.details && [...ctx.order.details,
      initDetail(ctx.order.id)].map((d: iOrderDetail, i: number) => (
        <React.Fragment key={`fr-key-${i}`}>
          {selectedRow === i ?
            <DivRow key={`form-key-${i}`} isActive={true}>
              <form onSubmit={(e) => { e.preventDefault(); }} className={'container py-0'}>
                <div className={'row'}>
                  <div className={'col-sm-5 col-md-4 form-inline g-2'}>
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <div className="input-group-text"><label htmlFor={'barcode'} className="sr-only">Barcode</label></div>
                      </div>
                      <input type={'text'} ref={barcodeRef} value={detail.barcode} placeholder={'barcode'} id={'barcode'}
                        onChange={(e) => setDetail((state) => ({ ...state, barcode: e.target.value }))}
                        onFocus={e => e.target.setSelectionRange(0, e.target.value.length)}
                        onKeyUp={(e) => {
                          if (e.key === 'Enter') {
                            getProductByBarcode();
                          }
                        }}
                        maxLength={25} autoFocus className={'form-control form-control'} />
                    </div>
                  </div>

                  <div className={'col-sm-7 col-md-8 form-inline g-2'}>
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <div className="input-group-text"><label htmlFor={'prod-name'} className="sr-only">Nama Barang</label></div>
                      </div>
                      <input value={`${detail.productName} ${detail.spec}`} placeholder={'Nama Barang'} id={'prod-name'} className={'form-control'} readOnly />
                    </div>
                  </div>

                  <div className={'col-md-2 col-sm-3 form-inline g-2'}>
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <div className="input-group-text"><label htmlFor={'det-qty'} className={'sr-only'}>Qty</label></div>
                      </div>
                      <NumberFormat getInputRef={qtyRef} value={detail.qty} placeholder={'Quantity'} id={'det-qty'} onValueChange={(e) => {
                        const qty = e.floatValue || 0;
                        setDetail((state) => ({
                          ...state,
                          qty: qty,
                          subtotal: qty * ((+state.price) - (+state.discount))
                        }))
                      }}
                        onKeyUp={(e) => {
                          // Cancel the default action, if needed
                          if (e.key === 'Enter') {
                            const inputElement = discountRef.current;
                            if (inputElement) {
                              inputElement.focus();
                              inputElement.setSelectionRange(0, inputElement.value.length)
                            }
                            return false;
                          }
                        }}
                        className={'form-control'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={false} />
                    </div>
                  </div>

                  <div className={'col-md-2 col-sm-3 form-inline g-2'}>
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <div className="input-group-text"><label className={'sr-only'} htmlFor={'det-unit'}>Unit</label></div>
                      </div>
                      <input type={'text'} value={detail.unitName} placeholder={'Unit'} id={'det-unit'}
                        readOnly
                        className={'form-control'} />
                    </div>
                  </div>

                  <div className={'col-md-2 col-sm-6 form-inline g-2'}>
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <div className="input-group-text"><label className={'sr-only'} htmlFor={'det-price'}>Harga</label></div>
                      </div>
                      <NumberFormat value={detail.price} placeholder={'Harga'} id={'det-price'}
                        displayType={'text'} readOnly
                        className={'form-control'} thousandSeparator={true} decimalScale={0} fixedDecimalScale={false} />
                    </div>
                  </div>

                  <div className={'col-sm-3 col-md-2 form-inline g-2'}>
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <div className="input-group-text"><label className={'sr-only'} htmlFor={'det-discount'}>Disc.</label></div>
                      </div>
                      <NumberFormat getInputRef={discountRef} value={detail.discount} placeholder={'Discount'} id={'det-discount'}
                        onValueChange={(e) => {
                          const discount = e.floatValue || 0;
                          setDetail((state) => ({
                            ...state,
                            discount: discount,
                            subtotal: (+state.qty) * ((+state.price) - discount)
                          }))
                        }}
                        onKeyUp={(e) => {
                          // Cancel the default action, if needed
                          if (e.key === 'Enter') {
                            const btnElem = submitRef.current;
                            if (btnElem) {
                              btnElem.click();
                              //inputElement.setSelectionRange(0, inputElement.value.length)
                            }
                          }
                        }}
                        className={'form-control'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={false} />
                    </div>
                  </div>

                  <div className={'col-sm col-md form-inline g-2'}>
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <div className="input-group-text"><label className={'sr-only'} htmlFor={'det-subtotal'}>Subtotal</label></div>
                      </div>
                      <NumberFormat value={detail.subtotal} placeholder={'Subtotal'} id={'det-subtotal'}
                        readOnly displayType={'text'}
                        className={'form-control'} thousandSeparator={true} decimalScale={0} />
                    </div>
                  </div>
                  <div className={'col-auto form-inline g-2'}>
                    <button ref={submitRef} className='btn me-2 btn-primary mb-2' type={'button'}
                      onClick={e => {
                        e.preventDefault();
                        formSubmit();
                      }}>Save</button>
                    <button type={'button'} disabled={detail.id === 0} className='btn btn-danger mb-2' onClick={(e) => deleteDetail(e)}>Delete</button>
                  </div>
                </div>
              </form>
            </DivRow> :
            <DivRow key={`d-key-${i}`}
              isActive={i === selectedRow}
              onClick={() => {
                if (selectedRow !== i) {
                  setSelectedRow(i);
                  setDetail(d)
                } else {
                  setSelectedRow(-1);
                }
              }} role="button">
              {d.id === 0 ? <span>Add new details</span> :
                <React.Fragment>
                  <div className={'col-3 col-sm-3 col-md'}>#{d.id}</div>
                  <div className={'col-3 col-sm-3 col-md'}>{d.barcode}</div>
                  <div className={'col-6 col-sm-6 col-md-4'}>{d.productName}, {d.spec}</div>
                  <div className={'col-6 col-sm-6 col-md-4 fst-italic'}>
                  <span style={{display: 'inline-block', width: '30px', textAlign: 'right', paddingRight: '3px'}}>{d.qty}</span>
                  <span style={{display: 'inline-block', width: '20px', textAlign: 'left'}}>{d.unitName}</span><span style={{display: 'inline-block', width: '15px', textAlign: 'center'}}>{' x '}</span>(<NumberFormat value={d.price} displayType={'text'} thousandSeparator={true} decimalScale={0} renderText={e => <span>{e}</span>} />
                    {' - '} <NumberFormat value={d.discount} displayType={'text'} thousandSeparator={true} decimalScale={0} renderText={e => <span>{e}</span>} />)</div>
                  <div className={'col-6 col-sm-6 col-md-2 fw-bold text-end'}><NumberFormat value={d.subtotal} displayType={'text'} thousandSeparator={true} decimalScale={0} renderText={e => <span>{e}</span>} /></div>
                </React.Fragment>
              }
            </DivRow>

          }
        </React.Fragment>
      ))}
    </React.Fragment>
  )
}
