import type { NextApiRequest, NextApiResponse } from 'next'
import api from '../models/supplier.model'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const [retData, error] = await api.getSuppliers();

  if (retData) {
    res.status(200).json(retData);
  } else {
      res.status(403)
      .json({ message: error.message })
  }
}
