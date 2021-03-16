import type { NextApiRequest, NextApiResponse } from 'next'
import apiProduct from '../../models/product.model'
import {iUnit} from '../../../../components/interfaces'


export default async function productUnitHandler(req: NextApiRequest, res: NextApiResponse) {
  const id: number = req.query.id ? +req.query.id : 0;
  const [data, error] = await apiProduct.getUnits(id);

  if (data) {
    res.status(200).json(data);
  } else {
    res.status(404).json({ message: error.message })
  }
}
