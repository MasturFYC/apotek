import type { NextApiRequest, NextApiResponse } from 'next'
import apiProduct from '../models/product.model'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const result = await apiProduct.getProducts();
  const [data, error] = result;
  if (data) {
    res.status(200).json(data);
  } else {
    res.status(404).json({ message: `Product table is empty!` })
  }
}
