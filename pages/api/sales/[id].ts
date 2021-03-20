import type { NextApiRequest, NextApiResponse } from 'next'
import apiSales from '../models/sales.model'
import { iSales, METHOD_DELETE, METHOD_GET, METHOD_POST, METHOD_PUT } from '../../../components/interfaces'


export default async function salesIDHandler(req: NextApiRequest, res: NextApiResponse) {
  let result;

  switch (req.method) {
    case METHOD_POST:
      {
        const sales: iSales = req.body as iSales;
        result = await apiSales.insertSales(sales);
      }
      break;
    case METHOD_PUT:
      {
        const id: number = req.query.id ? +req.query.id : 0;
        const sales: iSales = req.body as iSales;
        result = await apiSales.updateSales(id, sales);
      }
      break;
    case METHOD_DELETE:
      {
        const id: number = req.query.id ? +req.query.id : 0;
        result = await apiSales.deleteSales(id);
      }
      break;
    case METHOD_GET:
    default:
      {
        const id: number = req.query.id ? +req.query.id : 0;
        result = await apiSales.getSales(id)
      }
      break;
  }

  const [data, error] = result;
  if (data) {
    res.status(200).json(data);
  } else {
    console.log(error)
    res.status(403).json({ message: error.message })
  }
}
