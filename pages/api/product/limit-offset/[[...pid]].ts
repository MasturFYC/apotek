import type { NextApiRequest, NextApiResponse } from 'next'
import apiProduct from '../../models/product.model'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  const pids = req.query;
  const limit: number = +pids.pid[0];
  const offset: number = +pids.pid[1];
  
  // console.log(limit, offset)

  const result = await apiProduct.getProducts(limit, offset);
  
  // console.log(result)
  const [data, error] = result;
  //console.log(data, error)

  if (data) {
    res.status(200).json(data);
  } else {
    res.status(404).json({ message: error.message })
  }

}
