import type { NextApiRequest, NextApiResponse } from 'next'
import api from '../models/payment.model'
import { METHOD_POST, METHOD_PUT, METHOD_DELETE, METHOD_GET } from '../../../components/interfaces'


export default async function paymentHandler(req: NextApiRequest, res: NextApiResponse) {
  let result;

  switch (req.method) {
    case METHOD_PUT:
      {
        const id: number = req.query.id ? +req.query.id : 0;
        const { data } = req.body
        result = await api.updatePayment(id, data);
      }
      break;

    case METHOD_POST:
      {
        const { data } = req.body
        result = await api.insertPayment(data);
      }
      break;

    case METHOD_DELETE:
      {
        const id: number = req.query.id ? +req.query.id : 0;
        result = await api.deletePayment(id);
      }
      break

    case METHOD_GET:
    default:
      {
        const id: number = req.query.id ? +req.query.id : 0;
        result = await api.getPayment(id);
      }
      break;
  }

  const [data, error] = result;
  // console.log(data)

  if (data) {
    res.status(200).json(data);
  } else {
    res.status(403).json({ message: error.message })
  }
}
