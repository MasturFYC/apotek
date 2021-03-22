import * as React from 'react'
import useSWR, { mutate } from 'swr'
import NumberFormat from 'react-number-format';
import { iUnit, iProduct } from './interfaces'
import styles from './unit.module.css'
import EditSvg from '../public/images/edit.svg'
import DeleteSvg from '../public/images/delete.svg'
//import SaveSvg from '../public/images/save.svg'

export type UnitType = {
  product: iProduct;
  units: iUnit[];
  reload: (e: iUnit, option: string) => void
  //  updatePrice: (units: iUnit[]) => void;
  //  updateWeight: (units: iUnit[]) => void;
}

const Unit: React.FunctionComponent<UnitType> = (props) => {
  //const [controlName, setControlName] = useState('');
  const wrapperRef = React.useRef(null);
  const [currentIndex, setCurrentIndex] = React.useState(-1)
  useOutsideAlerter(wrapperRef, setCurrentIndex);
  const [formDirty, setFormDirty] = React.useState(false);
  //const [data, setData] = useState<iUnit[]>([]); //</iUnit>isLoading, isError, reload, removeUnit } = useUnit(product);
  const [currentUnit, setCurrentUnit] = React.useState<iUnit>(newUnit(props.product))
  //const [unit, setUnit] = useState<iSUnit>(newUnit(product))
  const [footer, footerDispatch] = React.useReducer(footerReducer, initialFooter);
/*
  React.useEffect(() => {
    var start: boolean = false;
    const reloadFooter = () => {
      if (!start) {
        footerDispatch({ type: FooterActionEnum.reload, init: product && (units.length - 1) || 0 })
      }
    }

    reloadFooter();

    return () => {
      start = true
    }
  }, [units])
  */
  /*
    React.useEffect(() => {
      let isLoaded = false;

      const changeDefaultUnits = () => {
        const basePrice = product.base_price;
        if (units) {

          const newUnit: iUnit[] = units.filter(item => item.id > 0).map((item, c) => {
            const price = item.content * basePrice;
            item.buy_price = price;
            item.sale_price = price + (price * item.margin);
            item.member_price = price + (price * item.member_margin);
            item.agent_price = price + (price * item.agent_margin);
            return item;
          })
          console.log(newUnit)
          reloadAll(newUnit);
        }

      }

      if (!isLoaded) {
        changeDefaultUnits()
      }

      return () => { isLoaded = true }
    }, [product.base_price])


    React.useEffect(() => {
      let isLoaded = false;

      const changeDefaultUnits = () => {
        const newUnit: iUnit[] = [];
        if (units) {
          for (let c = 0; c < units.length; c++) {
            const unit = units[c];
            if (unit.id > 0) {
              const weight = unit.content * defaultWeightChanged;
              unit.weight = weight;
              newUnit.push(unit)
            }
          }

          reloadAll(newUnit);
        }
      }

      if (!isLoaded) {
        changeDefaultUnits()
      }

      return () => { isLoaded = true }
    }, [product.base_weight])

  */
  /*
  if (isError) return <div>{isError.message}</div>
  //footerDispatch({ type: FooterActionEnum.reload, init: units?.length || 0})
  if (isLoading) return <div>Loading...</div>
  */

  const handleTrClick = (index: number, item: iUnit): void => {

    if (index !== currentIndex) {
      //console.log(index , ': ', units && units?.length - 1)
      //setUnit(item.id === 0 ? newUnit(product) : ConvertToStringUnit(item))
      setCurrentUnit(item.id === 0 ? newUnit(props.product) : item)
      setFormDirty(false)
      setCurrentIndex(index)
    }
  }

  const contentChanged = (content: number) => { // (val: string) => {
    if (document.activeElement?.id === "unit_content") {
      //    const content: number = parseFloat(val) || 1;

      const price: number = (content * props.product.base_price)
      const weight: number = (content * props.product.base_weight)
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
      setFormDirty(true)
    }
  }

  const updateUnit = async () => {

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

    if (res.status === 200) {

      props.reload(data, currentUnit.id === 0 ? 'insert' : 'update')
      setFormDirty(false)

      if (currentUnit.id === 0) {
        footerDispatch({ type: FooterActionEnum.plus })
        setCurrentUnit(newUnit(props.product));
        setCurrentIndex(props.units && props.units?.length || -1)
      }
    } else {
      alert(data.message)
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

    props.reload(props.units.filter(item=>item.id === id)[0], 'delete')
    setCurrentIndex(-1)
    setFormDirty(false)
    footerDispatch({ type: FooterActionEnum.minus })
  }

  const marginChanged = (margin: number) => {

    if (document.activeElement?.id === "margin") {
      const buy_price: number = +currentUnit.buy_price;
      const price: number = ((buy_price * margin) + buy_price);

      setCurrentUnit(prevState => {
        return {
          ...prevState,
          margin: margin,
          sale_price: price
        }

      })

      setFormDirty(true)
    }
  }

  const memberMarginChanged = (margin: number) => {
    if (document.activeElement?.id === "member_margin") {
      const buy_price: number = +currentUnit.buy_price;
      const price: number = ((buy_price * margin) + buy_price);

      setCurrentUnit(prevState => {
        return {
          ...prevState,
          member_margin: margin,
          member_price: price
        }

      })
      setFormDirty(true)
    }
  }

  const agentMarginChanged = (margin: number) => {

    if (document.activeElement?.id === "agent_margin") {
      const buy_price: number = +currentUnit.buy_price;
      const price: number = ((buy_price * margin) + buy_price);

      setCurrentUnit(prevState => {
        return {
          ...prevState,
          agent_margin: margin,
          agent_price: price
        }

      })

      setFormDirty(true)
    }
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
      setFormDirty(true)
    }
  }

  const memberPriceChanged = (price: number) => {
    if (document.activeElement?.id === "member_price") {
      const buy_price: number = +currentUnit.buy_price;
      const margin: number = (price - buy_price) / buy_price;

      setCurrentUnit(prevState => {
        return {
          ...prevState,
          member_margin: margin,
          member_price: price
        }
      })
      setFormDirty(true)
    }
  }

  const agentPriceChanged = (price: number) => {

    if (document.activeElement?.id === "agent_price") {
      const buy_price: number = +currentUnit.buy_price;
      const margin: number = (price - buy_price) / buy_price;

      setCurrentUnit(prevState => {

        return {
          ...prevState,
          agent_margin: margin,
          agent_price: price
        }
      })

      setFormDirty(true)
    }
  }

  const handlerChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentUnit(prevState => {
      return { ...prevState, [e.target.name]: e.target.value }
    })
    setFormDirty(true);
  }


  return (

    <table className={`${styles.unitTable}`}>
      <thead>
        <tr key={`tr_${1}`}>
          <th rowSpan={2}>ID</th>
          <th rowSpan={2}>BARCODE</th>
          <th rowSpan={2}>NAMA</th>
          <th rowSpan={2}>ISI ({props.product.base_unit})</th>
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
          // (units && product.id > 0)
          props.units && props.units.map((item: iUnit, index: number) => (
            <tr key={index} onClick={() => {
              handleTrClick(index, item)
            }}>
              {currentIndex !== index ?
                <React.Fragment>
                  <td className={styles.tdOff2}>{item.id}</td>
                  <td className={styles.tdOff1}>{item.barcode}</td>
                  <td className={styles.tdOff1}>{item.name}</td>
                  <td className={styles.tdOff2}><NumberFormat displayType={'text'} thousandSeparator={false} decimalScale={2} value={item.content} renderText={(e => <span>{+e * 1.0}</span>)} /></td>
                  <td className={styles.tdOff2}><NumberFormat displayType={'text'} thousandSeparator={false} decimalScale={2} value={item.weight} renderText={(e => <span>{+e * 1.0}</span>)} /></td>
                  <td className={styles.tdOff2}><NumberFormat displayType={'text'} thousandSeparator={true} decimalScale={2} value={item.buy_price * 1.0} /></td>
                  <td className={styles.tdOff2}><NumberFormat displayType={'text'} thousandSeparator={true} decimalScale={2} value={item.margin * 100} renderText={(e => <span>{+e * 1.0}%</span>)} /></td>
                  <td className={styles.tdOff2}><NumberFormat displayType={'text'} thousandSeparator={true} decimalScale={2} value={item.member_margin * 100} renderText={(e => <span>{+e * 1}%</span>)} /> </td>
                  <td className={styles.tdOff2}><NumberFormat displayType={'text'} thousandSeparator={true} decimalScale={2} value={item.agent_margin * 100} renderText={(e => <span>{+e * 1}%</span>)} /></td>
                  <td className={styles.tdOff2}><NumberFormat displayType={'text'} thousandSeparator={true} decimalScale={0} value={item.sale_price} /></td>
                  <td className={styles.tdOff2}><NumberFormat displayType={'text'} thousandSeparator={true} decimalScale={0} value={item.member_price} /></td>
                  <td className={styles.tdOff2}><NumberFormat displayType={'text'} thousandSeparator={true} decimalScale={0} value={item.agent_price} /></td>
                  <td>
                    {item.id > 0 &&
                      <img title="Hapus" className={`${styles.imgControl}`} height="16px" src={DeleteSvg} onClick={(e) => deleteUnit(item.id)} />
                    }
                  </td>
                </React.Fragment> :
                <React.Fragment>
                  <td className={styles.tdOff2}>{currentUnit.id}</td>
                  <td className={styles.tdEdit}><input autoFocus type='text' value={currentUnit.barcode} name={'barcode'} onChange={(e) => handlerChanged(e)} /></td>
                  <td className={styles.tdEdit}><input type='text' value={currentUnit.name} name={'name'} onChange={(e) => handlerChanged(e)} /></td>
                  <td className={styles.tdEdit2}><NumberFormat id={"unit_content"}
                    thousandSeparator={false}
                    decimalScale={2}
                    displayType={'input'} value={currentUnit.content * 1.0}
                    onValueChange={(e) => contentChanged(e.floatValue || 0.0)}
                    className={styles.tdInputNumber} /></td>
                  <td className={styles.tdOff2}><NumberFormat id={"unit_weight"}
                    displayType={'text'} thousandSeparator={false} decimalScale={2} value={currentUnit.weight} /></td>
                  <td className={styles.tdOff2}><NumberFormat id={"buy_price"}
                    displayType={'text'} thousandSeparator={true} decimalScale={2} value={currentUnit.buy_price * 1.0} /></td>
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
                  <td>
                    {formDirty && <img title="Simpan" className={`${styles.imgControl}`} height="16px" src={EditSvg} onClick={updateUnit} />}
                    {item.id > 0 &&
                      <img title="Hapus" className={styles.imgControl} height="16px" src={DeleteSvg} onClick={(e) => deleteUnit(item.id)} />
                    }
                  </td>
                </React.Fragment>}
            </tr>
          ))
        }
      </tbody>
      <tfoot>
        <tr>
          <td colSpan={13}>Total: {props.units.length - 1}{' item'}{props.units.length - 1 > 1 && 's'}</td>
        </tr>
      </tfoot>
    </table>
  )

}

const fetcher = async (url: string): Promise<iProduct | any> => {
  const res = await fetch(url);
  const data: iProduct | any = await res.json();

  if (res.status !== 200) {
    return null;
    // throw new Error('Produk ini tidak mempunyai units.')
  }

  //console.log(data)
  return data;
}

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


type UseUnitReturnType = {
  units: iUnit[];
  isLoading: boolean;
  isError?: Error | undefined;
  removeUnit: (id: number) => void;
  reload: (unit: iUnit) => void;
  reloadAll: (loadedUnits: iUnit[]) => void
}
const revalidationOptions = {
  //revalidateOnMount: true, //!cache.has(baseUrl), //here we refer to the SWR cache
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  //revalidateOnMount: false,
  refreshWhenOffline: false,
  refreshWhenHidden: false,
  refreshInterval: 0
};

export const useUnit = (product: iProduct): UseUnitReturnType => {
  const baseUrl: any = () => `/api/product/unit/${product.id}`;

  const { data, error, mutate } = useSWR<iUnit[], Error>(baseUrl, fetcher, revalidationOptions);

  return {
    units: data && [...data, initUnit] || [initUnit],  //newUnit(product)],
    isLoading: !error && !data,
    isError: error,
    removeUnit: (id: number) => {
      if (data) {
        const newData: iUnit[] = data.filter(item => item.id !== id);
        mutate([...newData], false);
      }
    },

    reloadAll: (loadedUnits: iUnit[]) => {
      data && mutate([...loadedUnits], false)
    },

    reload: (p: iUnit) => {
      if (p.id === 0) return;
      const newData: iUnit[] = [];
      let start: number = -1;
      if (data) {
        const iLength = (data.length || 0);
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

function useOutsideAlerter(ref: any, clearSelection: Function) {
  React.useEffect(() => {
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


export default Unit;
