import type { NextApiRequest, NextApiResponse } from 'next'
import api from '../../models/order.model'


export default async function orderPaymentHandler(req: NextApiRequest, res: NextApiResponse) {

  const id: number = req.query.id ? +req.query.id : 0;

  const [data, error] = await api.getPayments(id);


  if (data) {
    res.status(200).json(data);
  } else {
    res.status(403).json({ message: error.message })
  }
}
