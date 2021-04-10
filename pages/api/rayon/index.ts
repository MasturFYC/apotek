import type { NextApiRequest, NextApiResponse } from 'next'
import apiRayon from '../models/rayon.model'

export default async function rayonHandler(_req: NextApiRequest, res: NextApiResponse) {
  const [data, error] = await apiRayon.getRayons();
  //console.log(data);

  if (data) {
    res.status(200).json(data);
  } else {
    res.status(404).json({ message: error.message })
  }
}
