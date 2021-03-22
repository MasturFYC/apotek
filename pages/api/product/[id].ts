import type { NextApiRequest, NextApiResponse } from 'next'
import apiProduct from '../models/product.model'
import { iProduct, METHOD_POST, METHOD_PUT, METHOD_DELETE, METHOD_GET } from '../../../components/interfaces'


export default async function productHandler(req: NextApiRequest, res: NextApiResponse) {
  let result;

  switch (req.method) {
    case METHOD_PUT:
      {
        const id: number = req.query.id ? +req.query.id : 0;
        const { data, includeUnit} = req.body
        result = await apiProduct.updateProduct(id, data, includeUnit);
      }
      break;
    case METHOD_POST:
      {
        const { data } = req.body
        result = await apiProduct.insertProduct(data);
      }
      break;
    case METHOD_DELETE:
      {
        const id: number = req.query.id ? +req.query.id : 0;
        result = await apiProduct.deleteProduct(id);
      }
      break
    case METHOD_GET:
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
    res.status(403).json({ message: error.message })
  }
}
