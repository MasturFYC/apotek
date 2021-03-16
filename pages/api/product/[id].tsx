import type { NextApiRequest, NextApiResponse } from 'next'
import apiProduct from '../models/product.model'
import {iProduct} from '../../../components/interfaces'


export default async function productHandler(req: NextApiRequest, res: NextApiResponse) {
  const id: number = req.query.id ? +req.query.id : 0;
  let result;

  switch (req.method) {
    case 'PUT': {
      const data = JSON.parse(req.body) as iProduct;
      //console.log('ID: ', id.toExponential, 'Data:', data);
      result = await apiProduct.updateProduct(id, data);
    }
      break;
    case 'POST': {
      const data = JSON.parse(req.body) as iProduct;
      result = await apiProduct.insertProduct(id, data);
    }
      break;
    default:
      result = await apiProduct.getProduct(id);
      break;
  }

  if (result) {
    res.status(200).json(result);
  } else {
    res.status(404).json({ message: `Product with id: ${id} not found!` })
  }
}
