import React, { useContext, useState } from 'react';
import ReactTooltip from 'react-tooltip';
import NumberFormat from 'react-number-format';
import { iProduct, iUnit, iCategory, iSupplier, iWarehouse } from '../interfaces';
import Unit, { useUnit } from '../unit';
import PropertyContext, { PropertyContextType } from '../context/propery-context'
import { CustomerFormDiv, CustomerName, DivRow, SelectedDiv } from 'components/styles';

type ProductInfoParam = {
  product: iProduct;
  onSelect: Function;
  isSelected: boolean;
  index: number;
}

type reloadParam = {
  data: iProduct,
  method: string
}

type updateProductParam = {
  data: iProduct,
  //  updateCommand: (e: reloadParam) => void,
  index: number,
}

export const initProduct = (categoryId: number): iProduct => ({
  id: 0,
  name: '',
  code: '',
  spec: '',
  baseUnit: '',
  basePrice: 0,
  baseWeight: 0,
  isActive: true,
  firstStock: 0,
  unitInStock: 0,
  supplierId: 0,
  categoryId: 0,
  warehouseId: 0,
  units: []
})

type productType = {
  products?: iProduct[] | undefined,
  updateCommand: (e: reloadParam) => void
}

const ProductInfo: React.FunctionComponent<ProductInfoParam> = ({
  product, onSelect, isSelected, index
}): JSX.Element => {
  const params = useContext(PropertyContext);

  return (
    <>
      <DivRow key={`pod-info-${index}`} isActive={isSelected}>
        <div className={'col'}>
          <CustomerName role={'button'} onClick={(e) => onSelect()}>{product.name || 'New Product'}</CustomerName>
          <div data-tip data-for={`tip-${product.id}`}
            className={'px-0 pt-0 pb-1'}>
            Kode: {product.code}, Spec: {product.spec}
          </div>
        </div>
      </DivRow>

      {!isSelected && !(product.id === 0) &&
        <ReactTooltip
          id={`tip-${product.id}`}
          type={'light'}
          delayHide={500}
          border={true}
          delayShow={500}
          delayUpdate={500} place={'right'}>
          <ShowTips product={product} params={params} />
        </ReactTooltip>
      }
    </>
  )
}

export const ShowProducts: React.FunctionComponent = () => {
  const [currentId, setCurrentId] = useState<number>(-1);
  const params: PropertyContextType = useContext(PropertyContext);

  const updateSelectedIndex = (i: number) => {
    (currentId === i ? setCurrentId(-1) : setCurrentId(i));
  };

  return (
    <React.Fragment>
      {params.products && [...params.products, initProduct(0)].map((item: iProduct, i: number) => (
        // <div key={i}
        //   className={`${item.id !== 0 && 'border-bottom'} ${(i % 2 === 0 && 'bg-white rounded-top')}`}>
        <React.Fragment key={i}>
          <ProductInfo key={`info-${i}`} isSelected={currentId === (item.id)}
            product={item} index={i}
            onSelect={() => updateSelectedIndex(item.id)} />
          {currentId === (item.id) &&
            <DivRow key={`prod-form-${i}`}>
              <EditProduct key={`edit-${i}`} data={item} index={i} />
            </DivRow>}
        </React.Fragment>
      ))}
    </React.Fragment>
  );
};

const EditProduct: React.FunctionComponent<updateProductParam> = ({
  data, index
}) => {
  const [product, setProduct] = useState<iProduct>(initProduct(0));
  const { units, isLoading, isError, reload, removeUnit } = useUnit(data);
  const [includeUnit, setIncludeUnit] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string>('');
  const params = useContext(PropertyContext);

  React.useEffect(() => {
    let isLoaded = false;

    const attachProduct = () => {

      if (!isLoaded) {
        setProduct(data);
      }
    }

    attachProduct();

    return () => {
      isLoaded = true;
    };
  }, [data]);

  if (isError)
    return <div>{isError.message}</div>;
  //footerDispatch({ type: FooterActionEnum.reload, init: units?.length || 0})
  if (isLoading)
    return <div>Loading...</div>;

  const formSubmit = async (e: React.FormEvent) => {
    const baseUrl = `/api/product/${product.id}`;

    e.preventDefault();

    const check = checkError(product);
    if (check) {
      setErrorText(check);
      return false;
    }
    //console.log(product.id)
    const res = await fetch(baseUrl, {
      method: product.id === 0 ? 'POST' : 'PUT',
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      },
      body: JSON.stringify({
        data: includeUnit ? { ...product, units: units } : product,
        includeUnit: includeUnit
      })
    });

    const data: any = await res.json();

    if (res.status !== 200) {
      alert(data.message);
    } else {
      params.updateValue && params.updateValue(data, product.id === 0 ? 'insert' : 'update')
      //updateCommand({ data: data, method: product.id === 0 ? 'insert' : 'update' });
      setProduct(data);
      setIncludeUnit(false);
    }

    return false;
  };

  const updateUnitPrices = (basePrice: number) => {
    if (units) {
      //console.log('Price Changed')
      units.map((item: iUnit, index: number) => {
        const price = item.content * basePrice;
        item.buyPrice = price;
        item.salePrice = (item.margin * price) + price;
        item.memberPrice = (item.memberMargin * price) + price;
        item.agentPrice = (item.agentMargin * price) + price;
        return item;
      });
    }
  };

  const updateUnitWeights = (baseWeight: number) => {
    if (units) {
      units.map((item: iUnit, index: number) => {
        item.weight = item.content * baseWeight;
        return item;
      });
    }
  };

  const deleteData = async (e: React.MouseEvent) => {
    const baseUrl = `/api/product/${product.id}`;

    e.preventDefault();

    const res = await fetch(baseUrl, {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      }
    });

    const data: any = await res.json();

    if (res.status !== 200) {
      alert(data.message);
    } else {
      params.updateValue && params.updateValue(data, 'delete')
      //updateCommand({ data: product, method: 'delete' });
    }

    return false;
  };

  return (
    <form onSubmit={(e) => formSubmit(e)}>
      <div className={`form-floating g-3`}>
        <div className={'row'}>
          <div className={'col-md-6 form-floating mb-3'}>
            <input autoFocus type="text" className={'form-control'}
              id={ids[0]}
              placeholder={labels[0]}
              value={product.name}
              onChange={e => setProduct(prevState => ({ ...prevState, name: e.target.value }))} />
            <label htmlFor={ids[0]} className={'col-form-label mx-2'}>{labels[0]}</label>
          </div>

          <div className={'col-md-6 form-floating mb-3'}>
            <input className={'form-control'} type="text"
              id={ids[1]}
              placeholder={labels[1]}
              value={product.code}
              onChange={e => setProduct(prevState => ({ ...prevState, code: e.target.value }))} />
            <label htmlFor={ids[1]} className={'col-form-label mx-2'}>{labels[1]}</label>
          </div>

          <div className={'col-md-6 form-floating mb-3'}>
            <input className={'form-control'} type="text"
              id={ids[2]}
              placeholder={labels[2]}
              value={product.spec || ''}
              onChange={e => setProduct(prevState => ({ ...prevState, spec: e.target.value }))} />
            <label htmlFor={ids[2]} className={'col-form-label mx-2'}>{labels[2]}</label>
          </div>

          <div className={'col-md-6 form-floating mb-3'}>
            <input className={'form-control'} type="text"
              id={ids[3]}
              placeholder={labels[3]}
              value={product.baseUnit}
              onChange={e => setProduct(prevState => ({ ...prevState, baseUnit: e.target.value }))} />
            <label htmlFor={ids[3]} className={'col-form-label mx-2'}>{labels[3]}</label>
          </div>

          <div className={'col-md-6 form-floating mb-3'}>
            <NumberFormat
              id={ids[4]}
              className={'form-control'}
              thousandSeparator={true}
              value={product.basePrice * 1.0}
              decimalScale={2}
              fixedDecimalScale={false}
              placeholder={labels[4]}
              onValueChange={(e) => {
                setIncludeUnit(true);
                updateUnitPrices(e.floatValue || 0);
                setProduct(prevState => ({ ...prevState, basePrice: e.floatValue || 0 }));
              }} />
            <label htmlFor={ids[4]} className={'col-form-label mx-2'}>{labels[4]}</label>
          </div>

          <div className={'col-md-6 form-floating mb-3'}>
            <NumberFormat
              id={ids[5]}
              className={'form-control'}
              value={product.baseWeight * 1.0}
              decimalScale={2}
              fixedDecimalScale={false}
              placeholder={labels[5]}
              onValueChange={(e) => {
                setIncludeUnit(true);
                updateUnitWeights(e.floatValue ?? 0);
                setProduct(prevState => ({ ...prevState, baseWeight: e.floatValue ?? 0 }));
              }} />

            <label htmlFor={ids[5]} className={'col-form-label mx-2'}>{labels[5]}</label>
          </div>

          <div className={'col-md-6 form-floating mb-3'}>
            <select className={'form-control'}
              aria-label="Floating label select example"
              id={ids[7]}
              placeholder={labels[7]}
              value={product.categoryId}
              style={{ marginBottom: 2 }}
              onChange={e => {
                const i: number = parseInt(e.target.value);
                setProduct(prevState => ({ ...prevState, categoryId: i }));
              }}>{[{ id: 0, name: 'Pilih Kategori...' }, ...params.categories].map((item, index) => <option key={index} value={item.id}>{item.name}</option>)}</select>
            <label htmlFor={ids[7]} className={'col-form-label mx-2'}>{labels[7]}</label>
          </div>

          <div className={'col-md-6 form-floating mb-3'}>
            <select className={'form-control'}
              aria-label="Floating label select example"
              id={ids[8]}
              placeholder={labels[8]}
              value={product.supplierId}
              style={{ marginBottom: 2 }}
              onChange={e => {
                setProduct(prevState => ({ ...prevState, supplierId: +e.target.value }));
              }}>{[{ id: 0, name: 'Pilih Supplier...' }, ...params.suppliers].map((item, index) => <option key={index} value={item.id}>{item.name}</option>)}</select>
            <label htmlFor={ids[8]} className={'col-form-label mx-2'}>{labels[8]}</label>
          </div>

          <div className={'col-md-6 form-floating mb-3'}>
            <select className={'form-control'}
              aria-label="Floating label select example"
              id={ids[9]}
              placeholder={labels[9]}
              value={product.warehouseId}
              style={{ marginBottom: 2 }}
              onChange={e => {
                setProduct(prevState => ({ ...prevState, warehouseId: +e.target.value }));
              }}>{[{ id: 0, name: 'Pilih Gudang...' }, ...params.warehouses].map((item, index) => <option key={index} value={item.id}>{item.name}</option>)}</select>
            <label htmlFor={ids[9]} className={'col-form-label mx-2'}>{labels[9]}</label>
          </div>

          <div className={'col-md-6 form-check g-3'}>
            <input className={'form-check-input ms-0 me-3'}
              type={'checkbox'}
              checked={product.isActive}
              onChange={e => {
                setProduct(prevState => ({ ...prevState, isActive: !product.isActive }));
              }}
              value={product.isActive ? 1 : 0} id={ids[6]} />
            <label className={'form-check-label'} htmlFor={ids[6]}>{labels[6]}</label>
          </div>

          {product.id !== 0 &&
            <div className={'container'}>
              <Unit
                reload={(unit, option) => {
                  if (option === 'delete') {
                    removeUnit(unit.id);
                  } else {
                    reload(unit);
                  }
                }}
                units={units}
                product={product} />
            </div>}
          {errorText &&
            <div className={'container text-white font-bold bg-danger p-3 m-0'}>{errorText}</div>}
          <div className={'container mt-3'}>
            <button type={'submit'} className='btn w85 me-3 btn-primary'>
              Save Data
              </button>
            <button type={'button'}
              disabled={product.id === 0}
              style={{ width: '85px' }}
              onClick={(e) => deleteData(e)} className='btn w85 btn-danger'>
              Delete
              </button>
          </div>
        </div>
      </div>
    </form>

  );
};

const checkError = (p: iProduct) => {

  if (!p.name || p.name.trim() === '') {
    return 'Ketikkan nama barang!';
  }

  if (!p.code || p.code.trim() === '') {
    return 'Ketikkan kode barang!';
  }

  if (!p.baseUnit || p.baseUnit.trim() === '') {
    return 'Ketikkan satuan dasar!';
  }

  if (p.basePrice === 0) {
    return 'Harga dasar todak boleh (0) NOL!';
  }

  if (p.categoryId === 0) {
    return 'Pilih kategori...!';
  }

  if (p.supplierId === 0) {
    return 'Pilih supplier...!';
  }

  if (p.warehouseId === 0) {
    return 'Pilih gudang...!';
  }

  return false;
};


/**
 * @param values index of label control
 * @returns 0: Nama Produk, 1: Kode, 2: Spek, 3: Unit (Terkecil), 4: Harga (Terkecil), 5: Berat (Terkecil),
6: Masih Aktif?, 7: Kategori, 8: Supplier, 9: Gudang
 */
const labels: string[] = ['Nama Produk', 'Kode', 'Spek',
  'Unit (Terkecil)', 'Harga (Terkecil)', 'Berat (Terkecil)',
  'Masih Aktif?',
  'Kategori', 'Supplier', 'Gudang']

/**
* @param values index of id control
* @returns 0: prod-name, 1: prod-code, 2: prod-spec, 3: prod-unit, 4: prod-price, 5: prod-price,
* 6: prod-acive, 7: prod-categori, 8: prod-supplier, 9: prod-warehouse
*/
const ids: string[] = [
  'prod-name', 'prod-code', 'prod-spec',
  'prod-unit', 'prod-price', 'prod-price',
  'prod-active',
  'prod-categori', 'prod-supplier', 'prod-warehouse'
]


type TipParam = {
  product: iProduct;
  params: PropertyContextType
}

const ShowTips: React.FunctionComponent<TipParam> = ({ product, params }) => {
  return (<>
    <div className={'row'}>
      <div className={'col-12'}>
        <strong>{product.name}</strong>
      </div>
    </div>
    <div className={'row'}>
      <div className={'col-md-4'}>Kode:</div>
      <div className={'col-md-8'}>
        {product.code}
      </div>
    </div>
    <div className={'row'}>
      <div className={'col-md-4'}>Spec:</div>
      <div className={'col-md-8'}>
        {product.spec}
      </div>
    </div>
    <div className={'row'}>
      <div className={'col-md-4'}>Kategori:</div>
      <div className={'col-md-8'}>
        {params.categories.filter((x) => x.id === product.categoryId)[0]?.name}
      </div>
    </div>
    <div className={'row'}>
      <div className={'col-md-4'}>Supplier:</div>
      <div className={'col-md-8'}>
        {params.suppliers.filter((x) => x.id === product.supplierId)[0]?.name}
      </div>
    </div>
    <div className={'row'}>
      <div className={'col-md-4'}>Gudang:</div>
      <div className={'col-md-8'}>
        {params.warehouses.filter((x) => x.id === product.warehouseId)[0]?.name}
      </div>
    </div>
  </>);
}
/* using tools tip
<p data-tip data-for={`tip-${product.name}`} />
      <ReactTooltip id={`tip-${product.name}`}
        type={'light'}
        delayHide={500}
        border={true}
        delayShow={500}
        delayUpdate={500} place={'right'} >
        <div>
          <p><strong>{product.name}</strong></p>
          <p>Kode: {product.code}</p>
          <p>Spec: {product.spec}</p>
          <p>Kategori: {categori</p>
        </div>
      </ReactTooltip>
*/
