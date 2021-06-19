import type { NextApiRequest, NextApiResponse } from 'next'
import api from '../../models/category.model'

export default async function handlerListCategories(_req: NextApiRequest, res: NextApiResponse) {
  const [data, error] = await api.getListCategories();

  if (data) {
    res.status(200).json(data);
  } else {
      res.status(403)
      .json({ message: error.message })
  }
}
