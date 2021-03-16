import type { NextApiRequest, NextApiResponse } from 'next'
import apiCategory from '../models/category.model'


export default async function categoryHandler(req: NextApiRequest, res: NextApiResponse) {
  const id: number = req.query.id ? +req.query.id : 0;

  const result = await apiCategory.getCategory(id);
  if(result) {
    res.status(200).json(result);
  } else {
    res.status(404).json({message: `Category with id: ${id} not found!`})
  }
}
