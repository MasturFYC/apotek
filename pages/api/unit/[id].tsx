import type { NextApiRequest, NextApiResponse } from 'next'
import apiUnit from '../models/unit.model'
import { iUnit } from '../../../components/interfaces'
const METHOD_POST: string = 'POST';
const METHOD_PUT: string = 'PUT';
const METHOD_DELETE: string = 'DELETE';


export default async function unitIDHandler(req: NextApiRequest, res: NextApiResponse) {
  const id: number = req.query.id ? +req.query.id : 0;
  let result;

  switch (req.method) {
    case METHOD_POST:
      {
        const data = req.body as iUnit;
        result = await apiUnit.insertUnit(id, data, (unitId: any, error: any) => {
          if (unitId) {
            res.status(200).json({...data, id: unitId});
          }

          if (error) {
            res.status(404).json({ message: error.message })
          }
        });
      }
      break;
    case METHOD_PUT: {
      const data = req.body as iUnit;
      result = await apiUnit.updateUnit(id, data)

      if (result.rowCount === 0) {
        res.status(403).json({ message: result.message })
      }
      else {
        res.status(200).json({ ...data, id: result });
      }
      /*
      if (unitId) {
          res.status(200).json(data);
        }

        if (error) {
          res.status(404).json({ id: 0, message: error.message })
        }
        */
    }
      break;
    case METHOD_DELETE: {
      result = await apiUnit.deleteUnit(id, (unitId: any, error: any) => {
        if (unitId) {
          res.status(200).json({ id: unitId });
        }

        if (error) {
          res.status(404).json({ message: `Unit with id: ${id} not found!` })
        }
      });
    }
      break;
    default:
      result = await apiUnit.getUnit(id, (row: any, error: any) => {
        if (row) {
          res.status(200).json(row);
        }

        if(error) {
          res.status(404).json({ message: `Unit with id: ${id} not found!` })
        }
      })
      break;
  }

  // if (result) {
  //   if (result.id === 0) {
  //     res.status(403).json({ message: 'Error: ' + result.message });
  //   } else {
  //     res.status(200).json(result);
  //   }
  // } else {
  //   res.status(404).json({ message: `Unit with id: ${id} not found!` })
  // }
}
