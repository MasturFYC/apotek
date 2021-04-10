import type { NextApiRequest, NextApiResponse } from 'next'
import api from '../models/warehouse.model'
import {
  iWarehouse,
  METHOD_DELETE,
  METHOD_GET,
  METHOD_POST,
  METHOD_PUT
} from '../../../components/interfaces'

export default async function warehouseHandler(req: NextApiRequest, res: NextApiResponse) {
  let result;

  switch (req.method) {
    case METHOD_POST:
      {
        const data: iWarehouse = req.body as iWarehouse;
        result = await api.insertWarehouse(data);
      }
      break;
    case METHOD_PUT:
      {
        const id: number = req.query.id ? +req.query.id : 0;
        const data: iWarehouse = req.body as iWarehouse;
        //console.log(id, data)
        result = await api.updateWarehouse(id, data);
      }
      break;
    case METHOD_DELETE:
      {
        const id: number = req.query.id ? +req.query.id : 0;
        result = await api.deleteWarehouse(id);
      }
      break;
    case METHOD_GET:
    default:
      {
        const id: number = req.query.id ? +req.query.id : 0;
        result = await api.getWarehouse(id)
      }
      break;
  }

  const [data, error] = result;

  if (data) {
    res.status(200).json(data);
  } else {
    res.status(403).json({ message: error.message })
  }
}
