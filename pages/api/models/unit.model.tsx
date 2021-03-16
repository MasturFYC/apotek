import db, { sql } from '../../../config';
import { iUnit } from '../../../components/interfaces'
//import { nestQuery } from './nest'
import { UniqueIntegrityConstraintViolationError } from 'slonik'

const apiUnit = {
  getUnit: async (id: number) => {
    return await db.query<iUnit>
      (
        sql`SELECT id, barcode, name, content, weight, buy_price,
          margin, agent_margin, member_margin,
          sale_price, agent_price, member_price,
          profit, product_id
        FROM units
        WHERE id = ${id}`
      )
      .then((data) => ([data.rows[0], undefined]))
      .catch((error) => ([undefined, error]));
  }
  , getUnits: async () => {
    return await db.query<iUnit>
      (
        sql`SELECT id, barcode, name, content, weight, buy_price,
          margin, agent_margin, member_margin,
          sale_price, agent_price, member_price,
          profit, product_id
        ORDER BY content`
      )
      .then((data) => ([data.rows, undefined]))
      .catch((error) => ([undefined, error]));
  }
  , updateUnit: async (id: number, p: iUnit): Promise<any> => {
    return await db.query<iUnit | any>
      (
        sql`UPDATE units SET barcode = ${p.barcode}, name = ${p.name},
          content = ${p.content}, weight = ${p.weight}, buy_price = ${p.buy_price},
          margin = ${p.margin}, agent_margin = ${p.agent_margin},
          member_margin = ${p.member_margin}, sale_price = ${p.sale_price},
          agent_price = ${p.agent_price}, member_price = ${p.member_price},
          profit = ${p.profit}, product_id = ${p.product_id}
        WHERE id = ${id}
        RETURNING *`
      )
      .then((data) => ([data.rows[0], undefined]))
      .catch((error) => ([undefined, error]));
  }
  , insertUnit: async (p: iUnit) => {
    return await db.query<iUnit>
      (
        sql`INSERT INTO units (barcode, name, content, weight, buy_price,
          margin, agent_margin, member_margin,
          sale_price, agent_price, member_price,
          profit, product_id)
        VALUES (${p.barcode}, ${p.name}, ${p.content}, ${p.weight}, ${p.buy_price},
        ${p.margin}, ${p.agent_margin}, ${p.member_margin},
        ${p.sale_price}, ${p.agent_price}, ${p.member_price},
        ${p.profit}, ${p.product_id}) RETURNING id`
      )
      .then((data) => ([{ ...p, id: data.rows[0].id }, undefined]))
      .catch((error) => ([undefined, error]));
  }
  , deleteUnit: async (id: number) => {
    return await db.query<iUnit>
      (
        sql`DELETE FROM units
        WHERE id = ${id} RETURNING id`
      )
      .then((data) => ([{ id: data.rows[0].id }, undefined]))
      .catch((error) => ([undefined, error]));
  }
}

export default apiUnit;
