import type { NextApiRequest, NextApiResponse } from 'next'
import apiUnit from '../models/unit.model'
import { iUnit, METHOD_DELETE, METHOD_GET, METHOD_POST, METHOD_PUT } from '../../../components/interfaces'

export default async function unitIDHandler(req: NextApiRequest, res: NextApiResponse) {
  let result;

  switch (req.method) {
    case METHOD_POST:
      {
        const unit = req.body as iUnit;
        result = await apiUnit.insertUnit(unit);
      }
      break;
    case METHOD_PUT:
      {
        const id: number = req.query.id ? +req.query.id : 0;
        const unit = req.body as iUnit;
        result = await apiUnit.updateUnit(id, unit);
      }
      break;
    case METHOD_DELETE:
      {
        const id: number = req.query.id ? +req.query.id : 0;
        result = await apiUnit.deleteUnit(id);
      }
      break;
    case METHOD_GET:
    default:
      {
        const id: number = req.query.id ? +req.query.id : 0;
        result = await apiUnit.getUnit(id)
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
