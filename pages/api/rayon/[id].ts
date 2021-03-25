import type { NextApiRequest, NextApiResponse } from 'next'
import api from '../models/rayon.model'
import {
  iRayon,
  METHOD_DELETE,
  METHOD_GET,
  METHOD_POST,
  METHOD_PUT
} from '../../../components/interfaces'

export default async function rayonHandler(req: NextApiRequest, res: NextApiResponse) {
  let result;

  switch (req.method) {
    case METHOD_POST:
      {
        const data: iRayon = req.body as iRayon;
        result = await api.insertRayon(data);
      }
      break;
    case METHOD_PUT:
      {
        const id: number = req.query.id ? +req.query.id : 0;
        const data: iRayon = req.body as iRayon;
        //console.log(id, cat)
        result = await api.updateRayon(id, data);
      }
      break;
    case METHOD_DELETE:
      {
        const id: number = req.query.id ? +req.query.id : 0;
        result = await api.deleteRayon(id);
      }
      break;
    case METHOD_GET:
    default:
      {
        const id: number = req.query.id ? +req.query.id : 0;
        result = await api.getRayon(id)
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
