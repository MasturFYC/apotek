import type { NextApiRequest, NextApiResponse } from 'next'
import api from '../../models/supplier.model'

export default async function handlerListSuppliers(_req: NextApiRequest, res: NextApiResponse) {
  const [retData, error] = await api.getListSuppliers();

  if (retData) {
    res.status(200).json(retData);
  } else {
      res.status(403)
      .json({ message: error.message })
  }
}
