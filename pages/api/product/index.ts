import type { NextApiRequest, NextApiResponse } from 'next'
import apiProduct from '../models/product.model'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const result = await apiProduct.getProducts();
  if (result) {
    res.status(200).json(result);
  } else {
    res.status(404).json({ message: `Product table is empty!` })
  }
}
