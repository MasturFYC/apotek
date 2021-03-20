import type { NextApiRequest, NextApiResponse } from 'next'
import apiSales from '../models/sales.model'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const [data, error] = await apiSales.getAllSales();
  if (data) {
    res.status(200).json(data);
  } else {
      res.status(403)
      .json({ message: error.message })
  }
}
