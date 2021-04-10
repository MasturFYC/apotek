import type { NextApiRequest, NextApiResponse } from 'next'
import api from '../models/order.model'
import { METHOD_POST, METHOD_PUT, METHOD_DELETE, METHOD_GET } from '../../../components/interfaces'


export default async function orderHandler(req: NextApiRequest, res: NextApiResponse) {
  let result;

  switch (req.method) {
    case METHOD_PUT:
      {
        const id: number = req.query.id ? +req.query.id : 0;
        const { data } = req.body
        result = await api.updateOrder(id, data);
      }
      break;
    case METHOD_POST:
      {
        const { data } = req.body
        result = await api.insertOrder(data);
      }
      break;
    case METHOD_DELETE:
      {
        const id: number = req.query.id ? +req.query.id : 0;
        result = await api.deleteOrder(id);
      }
      break
    case METHOD_GET:
    default:
      {
        const id: number = req.query.id ? +req.query.id : 0;
        result = await api.getOrder(id);
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
