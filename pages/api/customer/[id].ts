import type { NextApiRequest, NextApiResponse } from 'next'
import apiCustomer from '../models/customer.model'
import { iCustomer, METHOD_DELETE, METHOD_GET, METHOD_POST, METHOD_PUT } from '../../../components/interfaces'


export default async function customerIDHandler(req: NextApiRequest, res: NextApiResponse) {
  let result;

  switch (req.method) {
    case METHOD_POST:
      {
        const cust: iCustomer = req.body as iCustomer;
        result = await apiCustomer.insertCustomer(cust);
      }
      break;
    case METHOD_PUT:
      {
        const id: number = req.query.id ? +req.query.id : 0;
        const cust: iCustomer = req.body as iCustomer;
        result = await apiCustomer.updateCustomer(id, cust);
      }
      break;
    case METHOD_DELETE:
      {
        const id: number = req.query.id ? +req.query.id : 0;
        result = await apiCustomer.deleteCustomer(id);
      }
      break;
    case METHOD_GET:
    default:
      {
        const id: number = req.query.id ? +req.query.id : 0;
        result = await apiCustomer.getCustomer(id)
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
