import type { NextApiRequest, NextApiResponse } from 'next'
import api from '../models/order-detail.model'
import { iOrder, METHOD_POST, METHOD_PUT, METHOD_DELETE, METHOD_GET } from '../../../components/interfaces'


export default async function orderDetailHandler(req: NextApiRequest, res: NextApiResponse) {
  let result;

  switch (req.method) {
    case METHOD_PUT:
      {
        const id: number = req.query.id ? +req.query.id : 0;
        const { data } = req.body
        result = await api.updateDetail(id, data);
      }
      break;
    case METHOD_POST:
      {
        const { data } = req.body

        result = await api.insertDetail(data);
        //console.log(result)
      }
      break;
    case METHOD_DELETE:
      {
        const id: number = req.query.id ? +req.query.id : 0;
        result = await api.deleteDetail(id);
      }
      break
    case METHOD_GET:
    default:
      {
        const id: number = req.query.id ? +req.query.id : 0;
        result = await api.getDetail(id);
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
