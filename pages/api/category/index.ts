import type { NextApiRequest, NextApiResponse } from 'next'
import apiCategory from '../models/category.model'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const [data, error] = await apiCategory.getCategories();

  if (data) {
    res.status(200).json(data);
  } else {
      res.status(403).json({ message: error.message })
  }
}
