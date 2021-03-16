import type { NextApiRequest, NextApiResponse } from 'next'
import apiUnit from '../models/unit.model'
import { iUnit } from '../../../components/interfaces'
const METHOD_POST: string = 'POST';
const METHOD_PUT: string = 'PUT';
const METHOD_DELETE: string = 'DELETE';
const METHOD_GET: string = 'GET';


export default async function unitIDHandler(req: NextApiRequest, res: NextApiResponse) {
  let result;

  switch (req.method) {
    case METHOD_POST:
      {
        const data = req.body as iUnit;
        result = await apiUnit.insertUnit(data);
      }
      break;
    case METHOD_PUT:
      {
        const id: number = req.query.id ? +req.query.id : 0;
        const data = req.body as iUnit;
        result = await apiUnit.updateUnit(id, data);
      }
      break;
    case METHOD_DELETE:
      {
        const id: number = req.query.id ? +req.query.id : 0;
        result = await apiUnit.deleteUnit(id);
      }
      break;
    case METHOD_GET:
    default: {
      const id: number = req.query.id ? +req.query.id : 0;
      result = await apiUnit.getUnit(id)
    }
      break;
  }

  const [data, error] = result;
  if (data) {
    res.status(200).json(result);
  } else {
    res.status(403).json({ message: error.message })
  }
}
