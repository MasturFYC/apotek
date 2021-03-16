import type { NextApiRequest, NextApiResponse } from 'next'
import apiCategory from '../models/category.model'


export default async function categoryHandler(req: NextApiRequest, res: NextApiResponse) {
  const id: number = req.query.id ? +req.query.id : 0;

  const [data, error] = await apiCategory.getCategory(id);
  if(data) {
    res.status(200).json(data);
  } else {
    res.status(404).json({message: error.message})
  }
}
