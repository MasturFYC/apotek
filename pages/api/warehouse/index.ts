import type { NextApiRequest, NextApiResponse } from 'next'
import api from '../models/warehouse.model'

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  const [data, error] = await api.getWarehouses();

  if (data) {
    res.status(200).json(data);
  } else {
      res.status(403).json({ message: error.message })
  }
}
