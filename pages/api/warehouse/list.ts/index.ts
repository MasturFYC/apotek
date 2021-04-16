import type { NextApiRequest, NextApiResponse } from 'next'
import api from '../../models/warehouse.model'

export default async function handlerListWarehouses(_req: NextApiRequest, res: NextApiResponse) {
  const [retData, error] = await api.getListWarehouses();

  if (retData) {
    res.status(200).json(retData);
  } else {
      res.status(403)
      .json({ message: error.message })
  }
}
