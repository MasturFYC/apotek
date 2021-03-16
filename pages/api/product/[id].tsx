import type { NextApiRequest, NextApiResponse } from 'next'
import apiProduct from '../models/product.model'
import { iProduct, METHOD_POST, METHOD_PUT } from '../../../components/interfaces'


export default async function productHandler(req: NextApiRequest, res: NextApiResponse) {
  let result;

  switch (req.method) {
    case METHOD_PUT:
      {
        const id: number = req.query.id ? +req.query.id : 0;
        const product = JSON.parse(req.body) as iProduct;
        //console.log('ID: ', id.toExponential, 'Data:', data);
        result = await apiProduct.updateProduct(id, product);
      }
      break;
    case METHOD_POST:
      {
        const product = JSON.parse(req.body) as iProduct;
        result = await apiProduct.insertProduct(product);
      }
      break;
    default:
      {
        const id: number = req.query.id ? +req.query.id : 0;
        result = await apiProduct.getProduct(id);
      }
      break;
  }

  const [data, error] = result;

  if (data) {
    res.status(200).json(data);
  } else {
    res.status(404).json({ message: error.message })
  }
}
