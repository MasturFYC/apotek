import type { NextApiRequest, NextApiResponse } from 'next'
import apiProduct from '../../models/product.model'
import {iUnit} from '../../../../components/interfaces'


export default async function productUnitHandler(req: NextApiRequest, res: NextApiResponse) {
  const id: number = req.query.id ? +req.query.id : 0;
  const result = await apiProduct.getUnits(id);

  if (result) {
    res.status(200).json(result);
  } else {
    res.status(404).json({ message: `Unit with product id: ${id} not found!` })
  }
}
