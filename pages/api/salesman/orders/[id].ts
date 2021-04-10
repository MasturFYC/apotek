import type { NextApiRequest, NextApiResponse } from 'next'
import apiSalesman from '../../models/salesman.model'


export default async function ordersBySalesHandler(req: NextApiRequest, res: NextApiResponse) {
  const id: number = req.query.id ? +req.query.id : 0;
  const [data, error] = await apiSalesman.getOrders(id);

  if (data) {
    res.status(200).json(data);
  } else {
    res.status(404).json({ message: error.message })
  }
}
