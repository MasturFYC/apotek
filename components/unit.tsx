import React, { useState, useEffect, useRef } from 'react'
import useSWR, { mutate } from 'swr'
import NumberFormat from 'react-number-format';
import { iUnit, iProduct } from './interfaces'
import styles from './unit.module.css'
import EditSvg from '../public/images/edit.svg'
import DeleteSvg from '../public/images/delete.svg'
//import SaveSvg from '../public/images/save.svg'

export type UnitType = {
  product: iProduct
}

const Unit = ({ product }: UnitType) => {
  //const [controlName, setControlName] = useState('');
  const wrapperRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(-1)
  useOutsideAlerter(wrapperRef, setCurrentIndex);
  const [formDirty, setFormDirty] = useState(false);
  const { units, isLoading, isError, reload, removeUnit } = useUnit(product);
  const [currentUnit, setCurrentUnit] = useState<iUnit>(newUnit(product))
  //const [unit, setUnit] = useState<iSUnit>(newUnit(product))
  const [footer, footerDispatch] = React.useReducer(footerReducer, initialFooter);

  React.useEffect(() => {
    var start: boolean = false;

    const reloadFooter = () => {
      if (!start && units) {
        footerDispatch({ type: FooterActionEnum.reload, init: (units?.length - 1) || 0 })
      }
    }

    reloadFooter();

    return () => {
      start = true
    }
  }, [isLoading])


  if (isError) return <div>{isError.message}</div>
  //footerDispatch({ type: FooterActionEnum.reload, init: units?.length || 0})
  if (isLoading) return <div>Loading...</div>

  const handleTrClick = (index: number, item: iUnit): void => {

    if (index !== currentIndex) {
      //console.log(index , ': ', units && units?.length - 1)
      //setUnit(item.id === 0 ? newUnit(product) : ConvertToStringUnit(item))
      setCurrentUnit(item.id === 0 ? newUnit(product) : item)
      setFormDirty(false)
      setCurrentIndex(index)
    }
  }

  const contentChanged = (content: number) => { // (val: string) => {
    if (document.activeElement?.id === "unit_content") {
      //    const content: number = parseFloat(val) || 1;

      const price: number = (content * product.base_price)
      const weight: number = (content * product.base_weight)
      const sale_price: number = price + (currentUnit.margin * price)
      const member_price: number = price + (currentUnit.member_margin * price)
      const agent_price: number = price + (currentUnit.agent_margin * price)

      setCurrentUnit(prevState => {
        return {
          ...prevState,
          content: content,
          weight: weight,
          buy_price: price,
          sale_price: sale_price,
          member_price: member_price,
          agent_price: agent_price
        }

      })
      // const dataChanged = {
      //   ...currentUnit,
      //   agent_price: agent_price, member_price: member_price, sale_price: sale_price, weight: weight, content: content, buy_price: price
      // }

      // setUnit({
      //   ...unit,
      //   content: val,
      //   weight: dataChanged.weight.toString(),
      //   buy_price: dataChanged.buy_price.toString(),
      //   sale_price: dataChanged.sale_price.toString(),
      //   member_price: dataChanged.member_price.toString(),
      //   agent_price: dataChanged.agent_price.toString()
      // })
      // setCurrentUnit(dataChanged)
      //reload(currentUnit);
      setFormDirty(true)
    }
  }

  const updateUnit = async () => {
    /*
        const xData: iUnit = {
          id: currentUnit.id,
          barcode: unit.barcode,
          name: unit.name,
          content: +unit.content,
          weight: +unit.weight,
          buy_price: +unit.buy_price,
          margin: +unit.margin / 100.0,
          agent_margin: +unit.agent_margin / 100.0,
          member_margin: +unit.member_margin / 100.0,
          sale_price: +unit.sale_price,
          agent_price: +unit.agent_price,
          member_price: +unit.member_price,
          profit: +unit.profit,
          product_id: product.id
        }
    */
    const url = `/api/unit/${currentUnit.id}`
    const fetchOptions = {
      method: currentUnit.id === 0 ? 'POST' : 'PUT',
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      },
      body: JSON.stringify(currentUnit)
    }

    const res = await fetch(url, fetchOptions);
    const data: iUnit | any = await res.json();

    if (res.status !== 200) {
      alert(data.message)
      return; //throw new Error (data.message)
    }

    //console.log(data)

    reload(data)
    setFormDirty(false)

    if (currentUnit.id === 0) {
      footerDispatch({ type: FooterActionEnum.plus })
      //setUnit(newUnit(product))
      setCurrentUnit(newUnit(product));
      setCurrentIndex(units && units?.length || -1)
    }

  }

  const deleteUnit = async (id: number) => {
    const url = `/api/unit/${id}`
    const fetchOptions = { method: 'DELETE' }

    const res = await fetch(url, fetchOptions);
    const data = await res.json();

    if (res.status !== 200) {
      throw new Error(data.message)
    }

    removeUnit(id)
    setCurrentIndex(-1)
    setFormDirty(false)
    footerDispatch({ type: FooterActionEnum.minus })
  }

  const marginChanged = (margin: number) => {

    if (document.activeElement?.id === "margin") {
      //const margin: number = val / 100;
      const buy_price: number = +currentUnit.buy_price;
      const price: number = ((buy_price * margin) + buy_price);


      setCurrentUnit(prevState => {
        return {
          ...prevState,
          margin: margin,
          sale_price: price
        }

      })

      //console.log(sale_price)
      /*
      const dataChanged = {
        ...currentUnit,
        margin: margin,
        sale_price: roundToTwo(sale_price, 2)
      }

      setUnit({
        ...unit,
        margin: val,
        sale_price: dataChanged.sale_price.toString(),
      })
      setCurrentUnit(dataChanged)
      */
      setFormDirty(true)
      //reload(dataChanged);
    }
  }

  const memberMarginChanged = (margin: number) => {
    if (document.activeElement?.id === "member_margin") {
      //const margin: number = val / 100;
      const buy_price: number = +currentUnit.buy_price;
      const price: number = ((buy_price * margin) + buy_price);
      //console.log(sale_price)
      /*
      const dataChanged = {
        ...currentUnit,
        member_margin: margin,
        member_price: roundToTwo(sale_price, 2)
      }
      setUnit({
        ...unit,
        member_margin: val,
        member_price: dataChanged.member_price.toString(),
      })
      setCurrentUnit(dataChanged)
      */

      setCurrentUnit(prevState => {
        return {
          ...prevState,
          member_margin: margin,
          member_price: price
        }

      })
      setFormDirty(true)
    }
    //reload(dataChanged);
  }

  const agentMarginChanged = (margin: number) => {

    if (document.activeElement?.id === "agent_margin") {
      //const margin: number = val / 100;
      const buy_price: number = +currentUnit.buy_price;
      const price: number = ((buy_price * margin) + buy_price);

      /*
      const dataChanged = {
        ...currentUnit,
        agent_margin: margin,
        agent_price: roundToTwo(sale_price, 2)
      }
      setUnit({
        ...unit,
        agent_margin: val,
        agent_price: dataChanged.agent_price.toString(),
      })
      setCurrentUnit(dataChanged)
      */

      //console.log(margin, ' : ',  price)

      setCurrentUnit(prevState => {
        return {
          ...prevState,
          agent_margin: margin,
          agent_price: price
        }

      })

      setFormDirty(true)
    }
    //reload(dataChanged);
  }

  const priceChanged = (price: number) => {

    if (document.activeElement?.id === "sale_price") {
      const buy_price = +currentUnit.buy_price;
      const margin: number = (price - buy_price) / buy_price;

      setCurrentUnit(prevState => {
        return {
          ...prevState,
          margin: margin,
          sale_price: price
        }
      })
      //console.log(sale_price)
      /*
      const dataChanged = {
        ...currentUnit,
        margin: margin,
        sale_price: price
      }
      */
      /*
      setUnit({
        ...unit,
        margin: roundToTwo((dataChanged.margin * 100), 4).toString(),
        sale_price: val,
      })
      setCurrentUnit(dataChanged)
      */
      setFormDirty(true)
    }
    //reload(dataChanged);
  }

  const memberPriceChanged = (price: number) => {
    if (document.activeElement?.id === "member_price") {
      const buy_price: number = +currentUnit.buy_price;
      const margin: number = (price - buy_price) / buy_price;
      //console.log(sale_price)
      /*
      const dataChanged = {
        ...currentUnit,
        member_margin: margin,
        member_price: price
      }
      setUnit({
        ...unit,
        member_margin: roundToTwo((dataChanged.member_margin * 100), 4).toString(),
        member_price: val,
      })
      setCurrentUnit(dataChanged)
      */
      setCurrentUnit(prevState => {
        return {
          ...prevState,
          member_margin: margin,
          member_price: price
        }
      })
      setFormDirty(true)
    }
    //reload(dataChanged);
  }

  const agentPriceChanged = (price: number) => {

    if (document.activeElement?.id === "agent_price") {
      const buy_price: number = +currentUnit.buy_price;
      const margin: number = (price - buy_price) / buy_price;
      /*
      const dataChanged = {
        ...currentUnit,
        member_margin: margin,
        member_price: price
      }
      setUnit({
        ...unit,
        member_margin: roundToTwo((dataChanged.member_margin * 100), 4).toString(),
        member_price: val,
      })
      setCurrentUnit(dataChanged)
      */
      setCurrentUnit(prevState => {

        return {
          ...prevState,
          agent_margin: margin,
          agent_price: price
        }
      })

      setFormDirty(true)
    }
    //reload(dataChanged);
  }

  const handlerChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    //setUnit({ ...unit, [e.target.name]: e.target.value })
    setCurrentUnit(prevState => {
      return { ...prevState, [e.target.name]: e.target.value }
    })
    setFormDirty(true);
  }


  return (
    <table className={styles.unitTable}>
      <thead>
        <tr key={`tr_${1}`}>
          <th rowSpan={2}>ID</th>
          <th rowSpan={2}>BARCODE</th>
          <th rowSpan={2}>NAMA</th>
          <th rowSpan={2}>ISI ({product.base_unit})</th>
          <th rowSpan={2}>BERAT (kg)</th>
          <th rowSpan={2}>HARGA BELI</th>
          <th colSpan={3}>MARGIN</th>
          <th colSpan={3}>HARGA JUAL</th>
          <th rowSpan={2} style={{ width: '65px' }}>Cmd</th>
        </tr>
        <tr key={`tr_${2}`}>
          <th>UMUM</th>
          <th>MEMBER</th>
          <th>AGEN</th>
          <th>UMUM</th>
          <th>MEMBER</th>
          <th>AGEN</th>
        </tr>
      </thead>
      <tbody ref={wrapperRef}>
        {
          (units && product.id > 0) && units.map((item: iUnit, index: number) => (
            <tr key={index} onClick={() => {
              handleTrClick(index, item)
            }
            }>
              {currentIndex !== index ?
                <React.Fragment>
                  <td className={styles.tdOff2}>{item.id}</td>
                  <td className={styles.tdOff1}>{item.barcode}</td>
                  <td className={styles.tdOff1}>{item.name}</td>
                  <td className={styles.tdOff2}><NumberFormat displayType={'text'} thousandSeparator={false} decimalScale={2} value={item.content} renderText={(e => <span>{+e * 1}</span>)} /></td>
                  <td className={styles.tdOff2}><NumberFormat displayType={'text'} thousandSeparator={false} decimalScale={2} value={item.weight} renderText={(e => <span>{+e * 1}</span>)} /></td>
                  <td className={styles.tdOff2}><NumberFormat displayType={'text'} thousandSeparator={true} decimalScale={0} value={item.buy_price} /></td>
                  <td className={styles.tdOff2}><NumberFormat displayType={'text'} thousandSeparator={true} decimalScale={2} value={item.margin * 100} renderText={(e => <span>{+e * 1}%</span>)} /></td>
                  <td className={styles.tdOff2}><NumberFormat displayType={'text'} thousandSeparator={true} decimalScale={2} value={item.member_margin * 100} renderText={(e => <span>{+e * 1}%</span>)} /> </td>
                  <td className={styles.tdOff2}><NumberFormat displayType={'text'} thousandSeparator={true} decimalScale={2} value={item.agent_margin * 100} renderText={(e => <span>{+e * 1}%</span>)} /></td>
                  <td className={styles.tdOff2}><NumberFormat displayType={'text'} thousandSeparator={true} decimalScale={0} value={item.sale_price} /></td>
                  <td className={styles.tdOff2}><NumberFormat displayType={'text'} thousandSeparator={true} decimalScale={0} value={item.member_price} /></td>
                  <td className={styles.tdOff2}><NumberFormat displayType={'text'} thousandSeparator={true} decimalScale={0} value={item.agent_price} /></td>
                  <td className={styles.tdOff1}>
                    {item.id > 0 &&
                      <img title="Hapus" className={styles.imgControl} height="22px" src={DeleteSvg} onClick={(e) => deleteUnit(item.id)} />
                    }
                  </td>
                </React.Fragment> :
                <React.Fragment>
                  <td className={styles.tdOff2}>{currentUnit.id}</td>
                  <td className={styles.tdEdit}><input autoFocus type='text' value={currentUnit.barcode} name={'barcode'} onChange={(e) => handlerChanged(e)} /></td>
                  <td className={styles.tdEdit}><input type='text' value={currentUnit.name} name={'name'} onChange={(e) => handlerChanged(e)} /></td>
                  <td className={styles.tdEdit2}><NumberFormat id={"unit_content"}
                    displayType={'input'} value={currentUnit.content} onValueChange={(e) => contentChanged(e.floatValue || 0)} className={styles.tdInputNumber} /></td>
                  <td className={styles.tdOff2}><NumberFormat id={"unit_weight"}
                    displayType={'text'} thousandSeparator={false} decimalScale={2} value={currentUnit.weight} renderText={value => <span>{+value * 1}</span>} /></td>
                  <td className={styles.tdOff2}><NumberFormat id={"buy_price"}
                    displayType={'text'} thousandSeparator={true} decimalScale={0} value={currentUnit.buy_price} renderText={value => <span>{value}</span>} /></td>
                  <td className={styles.tdEdit2}><NumberFormat id={"margin"}
                    displayType={'input'} thousandSeparator={false} decimalScale={4} value={currentUnit.margin * 100} onValueChange={(e) => marginChanged(e.floatValue && (e.floatValue / 100) || 0)} className={styles.tdInputNumber} /></td>
                  <td className={styles.tdEdit2}><NumberFormat id={"member_margin"}
                    displayType={'input'} thousandSeparator={false} decimalScale={4} value={currentUnit.member_margin * 100} onValueChange={(e) => memberMarginChanged(e.floatValue && (e.floatValue / 100) || 0)} className={styles.tdInputNumber} /></td>
                  <td className={styles.tdEdit2}><NumberFormat id={"agent_margin"}
                    displayType={'input'} thousandSeparator={false} decimalScale={4} value={currentUnit.agent_margin * 100}
                    onValueChange={(e) => {
                      agentMarginChanged(e.floatValue && (e.floatValue / 100) || 0)
                    }} className={styles.tdInputNumber} /></td>
                  <td className={styles.tdEdit2}><NumberFormat displayType={'input'} id={"sale_price"}
                    thousandSeparator={false} decimalScale={0} value={currentUnit.sale_price} onValueChange={(e) => priceChanged(e.floatValue || 0)} className={styles.tdInputNumber} /></td>
                  <td className={styles.tdEdit2}><NumberFormat displayType={'input'} id={"member_price"}
                    thousandSeparator={false} decimalScale={0} value={currentUnit.member_price} onValueChange={(e) => memberPriceChanged(e.floatValue || 0)} className={styles.tdInputNumber} /></td>
                  <td className={styles.tdEdit2}><NumberFormat displayType={'input'} id={"agent_price"}
                    thousandSeparator={false} decimalScale={0} value={currentUnit.agent_price}
                    onValueChange={(e) => {
                      agentPriceChanged(e.floatValue || 0)
                    }} className={styles.tdInputNumber
                    } /></td>
                  {/*
                   <td className={styles.tdEdit2}><input type='text' value={unit.content} onChange={(e) => contentChanged(e.target.value)} className={styles.tdInputNumber} /></td>
                  <td className={styles.tdOff2}>{formatters.weight.format(+unit.weight)}{' kg'}</td>
                  <td className={styles.tdOff2}>{formatters.auto(0).format(+unit.buy_price)}</td>
                   */}
                  {/* <td className={styles.tdEdit2}><input type='text' value={unit.margin} onChange={(e) => marginChanged(e.target.value)} className={styles.tdInputNumber} /></td>
                  <td className={styles.tdEdit2}><input type='text' value={unit.member_margin} onChange={(e) => memberMarginChanged(e.target.value)} className={styles.tdInputNumber} /></td>
                  <td className={styles.tdEdit2}><input type='text' value={unit.agent_margin} onChange={(e) => agentMarginChanged(e.target.value)} className={styles.tdInputNumber} /></td>
                  <td className={styles.tdEdit2}><input type='text' value={unit.sale_price} onChange={(e) => priceChanged(e.target.value)} className={styles.tdInputNumber} /></td>
                  <td className={styles.tdEdit2}><input type='text' value={unit.member_price} onChange={(e) => memberPriceChanged(e.target.value)} className={styles.tdInputNumber} /></td>
                  <td className={styles.tdEdit2}><input type='text' value={unit.agent_price} onChange={(e) => agentPriceChanged(e.target.value)} className={styles.tdInputNumber} /></td> */}
                  <td className={styles.tdOff1}>
                    {formDirty && <img title="Simpan" className={styles.imgControl} height="22px" src={EditSvg} onClick={updateUnit} />}
                    {item.id > 0 &&
                      <img title="Hapus" className={styles.imgControl} height="22px" src={DeleteSvg} onClick={(e) => deleteUnit(item.id)} />
                    }
                  </td>
                </React.Fragment>}
            </tr>
          ))
        }
      </tbody>
      <tfoot>
        <tr>
          <td colSpan={13}>Total: {footer.total}{' '}{footer.message}</td>
        </tr>
      </tfoot>
    </table>
  )
}

/*
interface iSUnit {
  id: string,
  barcode: string,
  name: string,
  content: string,
  weight: string,
  buy_price: string,
  margin: string,
  agent_margin: string,
  member_margin: string,
  sale_price: string,
  agent_price: string,
  member_price: string,
  profit: string,
  product_id: string,
}
*/
const fetcher = async (url: string): Promise<iUnit[]> => {
  const res = await fetch(url);
  const data: iUnit[] | any = await res.json();

  if (res.status !== 200) {
    return [];
    // throw new Error('Produk ini tidak mempunyai units.')
  }

  //console.log(data)
  return data;
}
/*
const formatters = {
  default: new Intl.NumberFormat(),
  currency: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USR', minimumFractionDigits: 0, maximumFractionDigits: 0 }),
  auto: (dec: number) => (new Intl.NumberFormat('en-US', { style: 'decimal', minimumFractionDigits: 0, maximumFractionDigits: dec })),
  weight: new Intl.NumberFormat('en-US', { style: 'decimal', minimumFractionDigits: 0, maximumFractionDigits: 2 }),
  percent: new Intl.NumberFormat('en-US', { style: 'percent', minimumFractionDigits: 0, maximumFractionDigits: 4 }),
  remove: (dec: number) => (new Intl.NumberFormat('en-US', { style: 'decimal', useGrouping: false, minimumFractionDigits: 0, maximumFractionDigits: dec }))
  // oneDecimal: new Intl.NumberFormat('en-US', { style: 'decimal', minimumFractionDigits: 1, maximumFractionDigits: 1 }),
  // twoDecimal: new Intl.NumberFormat('en-US', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 })
};
*/
const fetchDelete = async (id: number) => {
  const res = await fetch(`/api/unit/${id}`, {
    method: 'DELETE'
  });

  if (res.status !== 200) {
    throw new Error(res.statusText)
  }

  //console.log(data)
  return true;
}

const initUnit: iUnit = {
  id: 0,
  barcode: '',
  name: '',
  content: 0,
  weight: 0.0,
  buy_price: 0.0,
  margin: 0.0,
  agent_margin: 0.0,
  member_margin: 0.0,
  sale_price: 0.0,
  agent_price: 0.0,
  member_price: 0.0,
  profit: 0.0,
  product_id: 0
}

const useUnit = (product: iProduct) => {
  const baseUrl: any = () => `/api/product/unit/${product.id}`;
  const revalidationOptions = {
    //revalidateOnMount: true, //!cache.has(baseUrl), //here we refer to the SWR cache
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    //revalidateOnMount: false,
    refreshWhenOffline: false,
    refreshWhenHidden: false,
    refreshInterval: 0
  };

  const { data, error, mutate } = useSWR<iUnit[], Error>(baseUrl, fetcher, revalidationOptions);

  return {
    units: data && [...data, initUnit] || [initUnit], //newUnit(product)],
    isLoading: !error && !data,
    isError: error,
    removeUnit: (id: number) => {
      const newData: iUnit[] = [];
      if (data) {
        for (let i = 0; i < data.length; i++) {
          if (data[i].id !== id) {
            newData.push(data[i]);
          }
        }
        mutate([...newData], false);
      }
    },
    reload: (p: iUnit) => {
      if (p.id === 0) return;
      const newData: iUnit[] = [];
      let start: number = -1;
      const iLength = (data && data?.length || 0);
      if (data) {
        for (let i = 0; i < iLength; i++) {
          if (data[i].id === p.id) {
            newData.push(p);
            start++;
          } else {
            newData.push(data[i]);
          }
        }
        if (start === -1) {
          newData.push(p)
        }

        mutate([...newData], false); //{ ...data, products: newData && [...newData] || [p] }, false)
      }
    }
  }
}
/*
function roundToTwo(num: number, dec: number) {
  const d: number = parseFloat(`${num}e+${dec}`)
  return +(Math.round(d) + `e-${dec}`);
}
*/
function useOutsideAlerter(ref: any, clearSelection: Function) {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event: MouseEvent) {
      if (ref && ref.current && !ref.current.contains(event.target)) {
        clearSelection(-1); //alert("You clicked outside of me!");
      }
    }

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
}

type FooterType = {
  total: number,
  message: string
}

const initialFooter: FooterType = {
  total: 0,
  message: 'item'
}

enum FooterActionEnum {
  plus = 'PLUS',
  minus = 'MINUS',
  reload = 'RELOAD'
}

type ActionFooterType = { type: FooterActionEnum.minus } | { type: FooterActionEnum.plus } | { type: FooterActionEnum.reload, init: number }

const footerReducer = (state: FooterType, action: ActionFooterType): FooterType => {
  switch (action.type) {
    case FooterActionEnum.plus:
      return { total: state.total + 1, message: state.total === 0 ? 'item' : 'items' }
    case FooterActionEnum.minus:
      return { total: state.total - 1, message: state.total <= 2 ? 'item' : 'items' }
    case FooterActionEnum.reload:
      return { total: action.init, message: (action.init > 1) ? 'items' : 'item' }
    default: return state
  }

}

const newUnit = (product: iProduct): iUnit => {
  return {
    id: 0,
    barcode: '',
    name: product.base_unit,
    content: 1,
    weight: product.base_weight,
    buy_price: product.base_price,
    margin: 0.10,
    member_margin: 0.075,
    agent_margin: 0.05,
    sale_price: product.base_price + (product.base_price * 0.1),
    agent_price: product.base_price + (product.base_price * 0.075),
    member_price: product.base_price + (product.base_price * 0.05),
    profit: 0,
    product_id: product.id
  }
}

/*
const newUnit = (product: iProduct): iSUnit => {

  return {
    id: '0',
    barcode: '',
    name: product.base_unit,
    content: '1',
    weight: formatters.remove(2).format(product.base_weight),
    buy_price: formatters.remove(2).format(product.base_price),
    margin: '10',
    member_margin: '7',
    agent_margin: '5',
    sale_price: formatters.remove(2).format(product.base_price + (product.base_price * 0.1)),
    agent_price: formatters.remove(2).format(product.base_price + (product.base_price * 0.07)),
    member_price: formatters.remove(2).format(product.base_price + (product.base_price * 0.05)),
    profit: '0',
    product_id: product.id.toString()

  }
}
*/
/*
function ConvertToStringUnit(item: iUnit): iSUnit {
  return {
    id: item.id.toString(),
    barcode: item.barcode,
    name: item.name,
    content: formatters.remove(2).format(item.content),
    weight: formatters.remove(4).format(item.weight),
    buy_price: formatters.remove(2).format(item.buy_price),
    margin: formatters.auto(4).format(item.margin * 100),
    agent_margin: formatters.auto(4).format(item.agent_margin * 100),
    member_margin: formatters.auto(4).format(item.member_margin * 100),
    sale_price: formatters.remove(2).format(item.sale_price),
    agent_price: formatters.remove(2).format(item.agent_price),
    member_price: formatters.remove(2).format(item.member_price),
    profit: item.profit.toString(),
    product_id: item.product_id.toString()
  }
}
*/
export default Unit;
