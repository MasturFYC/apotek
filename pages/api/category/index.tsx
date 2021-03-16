import type { NextApiRequest, NextApiResponse } from 'next'
import apiCategory from '../models/category.model'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const result = await apiCategory.getCategories();
  if (result) {
    res.status(200).json(result);
  } else {
    res.status(404).json({ message: `Category table is empty!` })
  }
}
