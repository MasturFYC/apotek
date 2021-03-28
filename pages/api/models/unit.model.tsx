import db, { nestQuerySingle, sql } from '../../../config';
import { iUnit } from '../../../components/interfaces'
//import { nestQuery } from './nest'
//import { UniqueIntegrityConstraintViolationError } from 'slonik'


type apiUnitReturnType = Promise<any[] | (readonly iUnit[] | undefined)[]>;

interface apiProductFunction {
  getUnit(id: number): apiUnitReturnType;
  deleteUnit: (id: number) => apiUnitReturnType; // same as above
  updateUnit(id: number, p: iUnit): apiUnitReturnType;
  insertUnit(p: iUnit): apiUnitReturnType;
  getUnits: () => apiUnitReturnType;
  getProductByBarcode: (barcode: string | string[]) => apiUnitReturnType;
}

const apiUnit: apiProductFunction = {
  getProductByBarcode: async (barcode: string | string[]) => {
    return await db.query<iUnit>
      (
        sql`SELECT u.id, u.barcode, u.name, u.content, u.weight, u.buy_price,
        u.margin, u.agent_margin, u.member_margin,
        u.sale_price, u.agent_price, u.member_price,
        u.profit, u.product_id,
        ${nestQuerySingle(sql`
          SELECT p.id, p.code, p.name, p.spec, p.base_unit "baseUnit", p.base_price "basePrice",
          p.base_weight "baseWeight", p.is_active "isActive",
          p.first_stock "firstStock", p.unit_in_stock "unitInStock",
          p.category_id "categoryId", p.supplier_id "supplierId",
          p.warehouse_id "warehouseId"
          FROM products AS p
          WHERE p.id = u.product_id`)} AS "product"
        FROM units AS u
        WHERE u.barcode = ${barcode}`
      )
      .then((data) => ([data.rows[0], undefined]))
      .catch((error) => ([undefined, error]));
  },

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
          content = ${p.content}, weight = ${p.weight}, buy_price = ${p.buyPrice},
          margin = ${p.margin}, agent_margin = ${p.agentMargin},
          member_margin = ${p.memberMargin}, sale_price = ${p.salePrice},
          agent_price = ${p.agentPrice}, member_price = ${p.memberPrice},
          profit = ${p.profit}, product_id = ${p.productId}
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
        VALUES (${p.barcode}, ${p.name}, ${p.content}, ${p.weight}, ${p.buyPrice},
        ${p.margin}, ${p.agentMargin}, ${p.memberMargin},
        ${p.salePrice}, ${p.agentPrice}, ${p.memberPrice},
        ${p.profit}, ${p.productId}) RETURNING id`
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

/**
/* Update Multiple Rows

const keys = [
  'username',
  'email',
];

const identifiers = keys.map((key) => {
  return sql.identifier([key]);
});

const values = [
  ['nilesh', 'nilesh@gmail.com'], // single full record
  ['bailey', 'bailey@gmail.com'], // single full record
]

const values_types = [`varchar`,`varchar`];

const main = async(connection = slonik) => {
  let query = sql`
    INSERT INTO users
      (${sql.join(identifiers, sql`, `)})
    SELECT * FROM
      ${sql.unnest(values, values_types)}
    RETURNING *
  `
  try {
    const results = await connection.query(query)
    console.log(results);
    return results
  } catch (error) {
    console.error(error);
  }
}

main()
 */
