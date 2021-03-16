import type { NextApiRequest, NextApiResponse } from 'next'
import apiCustomer from '../models/customer.model'

export default async function customerHandler(req: NextApiRequest, res: NextApiResponse) {
  const [data, error] = await apiCustomer.getCustomers();
  console.log(data);

  if (data) {
    res.status(200).json(data);
  } else {
    res.status(403).json({ message: error.message })
  }
}
