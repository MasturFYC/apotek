import React, { FormEvent, useContext, useRef, useState } from 'react';
import { iOrderDetail, iUnit } from 'components/interfaces';
import OrderContext, { OrderContextType } from 'components/context/order-context';
import { DivRow, QtyLabel, UnitLabel } from 'components/styles';
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
  const refBottom = useRef<HTMLSpanElement>(null);
  const divForm = useRef<HTMLDivElement>(null);
  const qtyRef = useRef<HTMLInputElement>(null);
  const discountRef = useRef<HTMLInputElement>(null);
  const barcodeRef = useRef<HTMLInputElement>(null);
  const submitRef = useRef<HTMLButtonElement>(null);
  const [dirty, setDirty] = React.useState<boolean>(false)
  const [details, setDetails] = useState<iOrderDetail[]>([]);
  const ctx: OrderContextType = useContext(OrderContext);
  const [selectedRow, setSelectedRow] = useState(-1);
  const [detail, setDetail] = useState<iOrderDetail>(initDetail(ctx.order && ctx.order.id || 0))

  React.useEffect(() => {
    let isLoaded = false;

    const loadDetails = () => {
      if (!isLoaded) {
        setDetails(ctx.order?.details || [])
      }
    }

    loadDetails();

    return () => { isLoaded = true };

  }, [ctx.order?.details])

  const formSubmit = (e: FormEvent) => {

    e.preventDefault();
    //    console.log('submit')
    if (detail.productId === 0 || detail.productId === 0) return;


    if (details && ctx.updateValue) {
      const currentIndex = selectedRow;
      const isNew = detail.id === 0;
      const len = details.length - (isNew ? 0 : 1);
      //console.log(detail)

      ctx.updateValue(detail, isNew ? 'POST' : 'PUT', (data) => {
        const curIndex = currentIndex + 1;
        //if (isNew && data) {
        //setDetail(initDetail(data.orderId)) //(state) => ({...state, id: data.id}));
        // isNew && data && setDetail(initDetail(data.orderId))
        //console.log(len, currentIndex);
        data;
        setSelectedRow(curIndex);
        len === currentIndex
          ? setDetail(initDetail(ctx?.order?.id || 0))
          : details && setDetail(details[curIndex]);
        //setSelectedRow(curIndex);
        //}
        // else {
        //   console.log({ 'local': detail, 'updated': data })
        //   //setDetail(data);
        //   //setSelectedRow(currentIndex);
        // }
        executeScroll();
        setDirty(false);
      });
    }
  }

  const executeScroll = () => refBottom?.current?.scrollIntoView({ behavior: "smooth" })

  const getProductByBarcode = async (e: React.KeyboardEvent<HTMLInputElement>) => {

    if (e.key === 'Enter') {

      e.preventDefault();
      //e.stopPropagation();
      const baseUrl = `/api/unit/barcode`;

      const res = await fetch(baseUrl, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json; charset=UTF-8'
        },
        body: JSON.stringify({ barcode: detail.barcode.trim() })
      });

      const data: iUnit | any = await res.json();

      //console.log(res.status)
      if (res.status !== 200) {
        setDirty(false);
        alert(data.message);
        //e.stopPropagation();
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
        setDirty(true);
      }
    }
  }

  const deleteDetail = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    if (details && ctx.updateValue) {
      const len = details.length - 1;
      //let curRow = selectedRow;
      /*
            setDetails(state => ([
              ...state.filter(x => x.id !== detail.id)
            ]))
            */
      //const d = details[curRow]
      /*
      if (len >= selectedRow) {
        --curRow;
      }
      else if (len > 1 && (selectedRow-1) === 0) {
        console.log('--- ' + len)
        curRow++;
      }

      console.log(len)
      */
      let curDetail: iOrderDetail | null = null;
      if (len > selectedRow) {
        curDetail = details[selectedRow + 1];
      }
      else {
        curDetail = initDetail(ctx.order?.id || 0);
        console.log('text')
      }

      //if (len > 0 && selectedRow === 0) {
      //  ++curRow;
      //}

      //setSelectedRow(-1);

      ctx.updateValue(detail, 'DELETE', (data) => {
        if (data) {

          setDirty(false);
          //const curIndex = selectedRow - 1;
          //setSelectedRow(-1);
          /*
          let curRow = selectedRow;
          console.log(len, selectedRow)

          if (len === selectedRow) {
            --curRow;
          } else {
            if (len > 0) {
              ++curRow;
            } else {
              --curRow;
            }
          }

          if (curRow >= 0 && details) {
            setDetail(details[curRow])
          }
          */

          //if (len > 0) {

          curDetail && setDetail(curDetail)
          //}
          setSelectedRow(selectedRow);
          barcodeRef && barcodeRef.current && barcodeRef.current.focus();
        }
      })
    }
  }

  //console.log(ctx.order)

  return (
    <React.Fragment>
      <DivRow>
        <div className={'col-3 col-sm-3 col-md-1'}>#ID</div>
        <div className={'col-3 col-sm-3 col-md'}>BARCODE</div>
        <div className={'col-6 col-sm-6 col-md-4'}>Nama Barang</div>
        <div className={'col-3 col-sm-3 col-md'}><QtyLabel>QTY/</QtyLabel><UnitLabel>UNIT</UnitLabel></div>
        <div className={'col-3 col-sm-3 col-md text-end'}>HARGA</div>
        <div className={'col-3 col-sm-3 col-md-1 text-end'}>DISC.</div>
        <div className={'col-3 col-sm-3 col-md-2 text-end'}>Subtotal</div>
      </DivRow>
      {details && [...details, initDetail(ctx.order?.id || 0)].map((d: iOrderDetail, i: number) => (
        <React.Fragment key={`fr-key-${i}`}>
          {selectedRow === i ?
            <DivRow key={`form-key-${i}`} isActive={true}>
              <form onSubmit={(e) => { formSubmit(e); } } className={'container py-0'}>
                <div className={'row'}>
                  <div className={'col-sm-5 form-inline col-md-4 g-2'}>
                    <div className={'input-group input-group-sm'}>
                      <div className="input-group-text" id={'barcode'}><label htmlFor={'ctl-barcode'}>Barcode</label></div>
                      <input type={'text'} ref={barcodeRef} value={detail.barcode}
                        placeholder={'barcode'} aria-describedby={'barcode'}
                        id={'ctl-barcode'}
                        onChange={(e) => {
                          setDetail((state) => ({ ...state, barcode: e.target.value }));
                        } }
                        onFocus={e => e.target.setSelectionRange(0, e.target.value.length)}
                        onKeyPress={(e) => getProductByBarcode(e)}
                        maxLength={25} autoFocus className={'form-control'} />
                    </div>
                  </div>

                  <div className={'col-sm-7 col-md-8 form-inline g-2'}>
                    <div className="input-group input-group-sm">
                      <div className="input-group-text"><label htmlFor={'prod-name'} className="sr-only">Nama Barang</label></div>
                      <input tabIndex={-1} value={`${detail.productName}${detail.spec && `, ${detail.spec}`}`} placeholder={'Nama Barang'} id={'prod-name'} className={'form-control'} readOnly />
                    </div>
                  </div>

                  <div className={'col-3 col-sm-3 col-md-2 form-inline g-2'}>
                    <div className="input-group input-group-sm">
                      <div className="input-group-text">
                        <label htmlFor={'det-qty'} className={'sr-only form-label-sm'}>Qty</label></div>
                      <NumberFormat
                        getInputRef={qtyRef}
                        value={detail.qty}
                        placeholder={'Quantity'}
                        id={'det-qty'}
                        onValueChange={(e) => {
                          const qty = e.floatValue || 0;
                          setDetail((state) => ({
                            ...state,
                            qty: qty,
                            subtotal: qty * ((+state.price) - (+state.discount))
                          }));
                          setDirty(true);
                        } }
                        onKeyPress={(e) => {
                          // Cancel the default action, if needed
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const inputElement = discountRef.current;
                            if (inputElement) {
                              inputElement.focus();
                              inputElement.setSelectionRange(0, inputElement.value.length);
                            }
                          }
                        } }
                        className={'form-control'}
                        thousandSeparator={true}
                        decimalScale={2}
                        fixedDecimalScale={false} />
                    </div>
                  </div>

                  <div className={'col-3 col-md-2 col-sm-3 form-inline g-2'}>
                    <div className="input-group input-group-sm">
                      <div className="input-group-text"><label className={'sr-only'} htmlFor={'det-unit'}>Unit</label></div>
                      <input type={'text'} tabIndex={-1} value={detail.unitName} placeholder={'Unit'} id={'det-unit'}
                        readOnly
                        className={'form-control'} />
                    </div>
                  </div>

                  <div className={'col-6 col-md-2 col-sm-6 form-inline g-2'}>
                    <div className="input-group input-group-sm">
                      <div className="input-group-text"><label className={'sr-only'} htmlFor={'det-price'}>Harga</label></div>
                      <NumberFormat tabIndex={-1} value={detail.price} placeholder={'Harga'} id={'det-price'}
                        displayType={'text'} readOnly
                        className={'form-control'} thousandSeparator={true} decimalScale={0} fixedDecimalScale={false} />
                    </div>
                  </div>

                  <div className={'col-3 col-sm-3 col-md-2 form-inline g-2'}>
                    <div className="input-group input-group-sm">
                      <div className="input-group-text"><label className={'sr-only'} htmlFor={'det-discount'}>Disc.</label></div>
                      <NumberFormat getInputRef={discountRef} value={detail.discount} placeholder={'Discount'} id={'det-discount'}
                        onValueChange={(e) => {
                          const discount = e.floatValue || 0;
                          setDetail((state) => ({
                            ...state,
                            discount: discount,
                            subtotal: (+state.qty) * ((+state.price) - discount)
                          }));
                          setDirty(true);
                        } }

                        // onKeyUp={(e) => {
                        //   // Cancel the default action, if needed
                        //   if (e.key === 'Enter') {
                        //     const btnElem = submitRef.current;
                        //     if (btnElem) {
                        //       btnElem.click();
                        //       //inputElement.setSelectionRange(0, inputElement.value.length)
                        //     }
                        //   }
                        // }}
                        className={'form-control'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={false} />
                    </div>
                  </div>

                  <div className={'col col-sm col-md form-inline g-2'}>
                    <div className="input-group input-group-sm">
                      <div className="input-group-text"><label className={'sr-only'} htmlFor={'det-subtotal'}>Subtotal</label></div>
                      <NumberFormat value={detail.subtotal} placeholder={'Subtotal'} id={'det-subtotal'}
                        readOnly displayType={'text'}
                        className={'form-control'} thousandSeparator={true} decimalScale={0} />
                    </div>
                  </div>
                  <div ref={divForm} className={'col-auto form-inline g-2'}>
                    <button ref={submitRef} disabled={!dirty} className='btn btn-sm me-2 btn-primary mb-2' type={'submit'}
                    >Save</button>
                    <button type={'button'} disabled={detail.id === 0} className='btn btn-sm btn-danger mb-2' onClick={(e) => deleteDetail(e)}>Delete</button>
                  </div>
                </div>
              </form>
            </DivRow> :
            <DivRow key={`d-key-${i}`}
              isActive={i === selectedRow}
              onClick={() => {
                if (selectedRow !== i) {
                  setSelectedRow(i);
                  setDetail(d);
                } else {
                  setSelectedRow(-1);
                }
              } } role="button">
              {d.id === 0 ? <span>Add new details</span> :
                <React.Fragment>
                  <div className={'col-3 col-sm-3 col-md-1'}>#{d.id}</div>
                  <div className={'col-3 col-sm-3 col-md'}>{d.barcode}</div>
                  <div className={'col-6 col-sm-6 col-md-4'}>{d.productName}{d.spec && `, ${d.spec}`}</div>
                  <div className={'col-3 col-sm-3 col-md fst-italic'}>
                    <QtyLabel>{d.qty}</QtyLabel>
                    <UnitLabel>{d.unitName}</UnitLabel>
                    {/* <span style={{ display: 'inline-block', width: '15px', textAlign: 'center' }}>{' x '}
                              </span> */}
                  </div>
                  <div className={'col-3 col-sm-3 col-md fst-italic text-end'}>
                    <NumberFormat value={d.price} displayType={'text'} thousandSeparator={true} decimalScale={0} renderText={e => <span>{e}</span>} />
                  </div>
                  <div className={'col-3 col-sm-3 col-md-1 fst-italic text-end'}><NumberFormat value={d.discount} displayType={'text'} thousandSeparator={true} decimalScale={0} renderText={e => <span>{e}</span>} />
                  </div>
                  <div className={'col-3 col-sm-3 col-md-2 fw-bold text-end'}><NumberFormat value={d.subtotal} displayType={'text'} thousandSeparator={true} decimalScale={0} renderText={e => <span>{e}</span>} /></div>
                </React.Fragment>}
            </DivRow>}
          <span ref={refBottom}>{' '}</span>
        </React.Fragment>
      ))}
    </React.Fragment>
  )
}
