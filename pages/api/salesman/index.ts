import type { NextApiRequest, NextApiResponse } from 'next'
import apiSalesman from '../models/salesman.model'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const [data, error] = await apiSalesman.getAllSales();
  if (data) {
    res.status(200).json(data);
  } else {
      res.status(403)
      .json({ message: error.message })
  }
}
