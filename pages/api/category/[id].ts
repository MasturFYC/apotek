import type { NextApiRequest, NextApiResponse } from 'next'
import apiCategory from '../models/category.model'
import {
  iCategory,
  METHOD_DELETE,
  METHOD_GET,
  METHOD_POST,
  METHOD_PUT
} from '../../../components/interfaces'

export default async function categoryHandler(req: NextApiRequest, res: NextApiResponse) {
  let result;

  switch (req.method) {
    case METHOD_POST:
      {
        const cat: iCategory = req.body as iCategory;
        result = await apiCategory.insertCategory(cat);
      }
      break;
    case METHOD_PUT:
      {
        const id: number = req.query.id ? +req.query.id : 0;
        const cat: iCategory = req.body as iCategory;
        //console.log(id, cat)
        result = await apiCategory.updateCategory(id, cat);
      }
      break;
    case METHOD_DELETE:
      {
        const id: number = req.query.id ? +req.query.id : 0;
        result = await apiCategory.deleteCategory(id);
      }
      break;
    case METHOD_GET:
    default:
      {
        const id: number = req.query.id ? +req.query.id : 0;
        result = await apiCategory.getCategory(id)
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
