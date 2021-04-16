import type { NextApiRequest, NextApiResponse } from 'next'
import api from '../../models/category.model'

export default async function handlerListCategories(_req: NextApiRequest, res: NextApiResponse) {
  const [retData, error] = await api.getListCategories();

  if (retData) {
    res.status(200).json(retData);
  } else {
      res.status(403)
      .json({ message: error.message })
  }
}
