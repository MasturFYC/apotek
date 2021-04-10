import type { NextApiRequest, NextApiResponse } from 'next'
import api from '../models/supplier.model'
import { iSupplier, METHOD_DELETE, METHOD_GET, METHOD_POST, METHOD_PUT } from '../../../components/interfaces'


export default async function supplierIDHandler(req: NextApiRequest, res: NextApiResponse) {
  let result;

  switch (req.method) {
    case METHOD_POST:
      {
        const data: iSupplier = req.body as iSupplier;
        result = await api.insertSupplier(data);
      }
      break;
    case METHOD_PUT:
      {
        const id: number = req.query.id ? +req.query.id : 0;
        const data: iSupplier = req.body as iSupplier;
        result = await api.updateSupplier(id, data);
      }
      break;
    case METHOD_DELETE:
      {
        const id: number = req.query.id ? +req.query.id : 0;
        result = await api.deleteSupplier(id);
      }
      break;
    case METHOD_GET:
    default:
      {
        const id: number = req.query.id ? +req.query.id : 0;
        result = await api.getSupplier(id)
      }
      break;
  }

  const [retData, error] = result;
  if (retData) {
    res.status(200).json(retData);
  } else {
    //console.log(error)
    res.status(403).json({ message: error.message })
  }
}
