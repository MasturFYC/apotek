import type { NextApiRequest, NextApiResponse } from 'next'
import api from '../models/unit.model'

export default async function BarcodeUnitHandler(req: NextApiRequest, res: NextApiResponse) {

  const { barcode } = req.body;
  const result = await api.getProductByBarcode(barcode);

  //console.log(result)
  const [data, error] = result;
  if (data) {
    res.status(200).json(data);
  } else {
    res.status(404).json({ message: `Product yg dicari tidak ditemukan!` })
  }
}
