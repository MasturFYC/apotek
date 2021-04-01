import type { NextApiRequest, NextApiResponse } from 'next'
import apiProduct from '../../models/product.model'
import { iProduct } from '../../../../components/interfaces'


export default async function searchProductHandler(req: NextApiRequest, res: NextApiResponse) {
  const text = '' + req.query.text;
  const result = await apiProduct.searchProduct(text);

  const [data, error] = result;

  if (data) {
    res.status(200).json(data);
  } else {
    res.status(403).json({ message: error.message })
  }
}
