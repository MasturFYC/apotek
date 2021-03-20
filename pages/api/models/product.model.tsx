import db, { nestQuery, sql } from '../../../config';
import { iProduct, iUnit } from '../../../components/interfaces'

type apiProductReturnType = Promise<any[] | (readonly iProduct[] | undefined)[]>;
//type apiUnitReturnType = Promise<any[] | (readonly iUnit[] | undefined)[]>;

interface apiProductFunction {
  getProduct(id: number): apiProductReturnType;
  deleteProduct(id: number): apiProductReturnType;
  getProducts: () => apiProductReturnType; // same as above
  updateProduct(id: number, p: iProduct): apiProductReturnType;
  insertProduct(p: iProduct): apiProductReturnType;
  getProductUnits(id: number): apiProductReturnType;
}

const apiProduct: apiProductFunction = {
  getProduct: async (id: number) => {
    return await db.query<iProduct>(
      sql`SELECT code, name, spec, base_unit, base_price, base_weight, is_active,
      first_stock, unit_in_stock, category_id, supplier_id, warehouse_id
        FROM products
        WHERE id = ${id}`)
      .then(data => ([data.rows[0], undefined]))
      .catch(error => ([undefined, error]))

  },

  deleteProduct: async (id: number) => {
    return await db.query<iProduct>(
      sql`DELETE FROM products
        WHERE id = ${id}
        RETURNING id`)
      .then(data => ([data.rows[0], undefined]))
      .catch(error => ([undefined, error]))

  },

  getProducts: async () => {
    return await db.query<iProduct>(
      sql`SELECT code, name, spec, base_unit, base_price, base_weight, is_active,
        first_stock, unit_in_stock, category_id, supplier_id, warehouse_id
        FROM products
        ORDER BY name`)
      .then(data => ([data.rows, undefined]))
      .catch(error => ([undefined, error]))
  },

  updateProduct: async (id: number, p: iProduct) => {
    return await db.query<iProduct>(
      sql`UPDATE products SET
        name = ${p.name}, code = ${p.code}, spec = ${p.spec??null}, base_unit = ${p.base_unit},
        base_price = ${p.base_price}, base_weight = ${p.base_weight}, is_active = ${p.is_active},
        first_stock = ${p.first_stock}, category_id = ${p.category_id},
        supplier_id = ${p.supplier_id}, warehouse_id = ${p.warehouse_id}
      WHERE id = ${id}
      RETURNING *`)
      .then(data => ([data.rows[0], undefined]))
      .catch(error => ([undefined, error]))
  },

  insertProduct: async (p: iProduct) => {
    return await db.query<iProduct>(
      sql`INSERT INTO products (code, name, spec, base_unit, base_price, base_weight, is_active, first_stock, category_id, supplier_id, warehouse_id)
        VALUES (${p.code}, ${p.name}, ${p.spec??null}, ${p.base_unit}, ${p.base_price}, ${p.base_weight}, ${p.is_active}, ${p.first_stock}, ${p.category_id}, ${p.supplier_id}, ${p.warehouse_id})
        RETURNING id`)
      .then(data => ([{ ...p, id: data.rows[0].id }, undefined]))
      .catch(error => ([undefined, error]))
  },
 
  getProductUnits: async (id: number) => {
    return await db.query<iProduct>(
      sql`SELECT p.id, p.code, p.name, p.spec, p.base_unit, p.base_price, p.base_weight, p.is_active, p.first_stock, p.unit_in_stock, p.category_id, p.supplier_id, p.warehouse_id,
      ${nestQuery(sql`SELECT id, barcode, name, content, weight, buy_price,
        margin, agent_margin, member_margin,
        sale_price, agent_price, member_price,
        profit, product_id
      FROM units
      WHERE product_id = p.id
      ORDER BY content`)} AS units
      WHERE p.id = ${id}`)
      .then(data => ([data.rows[0], undefined]))
      .catch(error => ([undefined, error]))
  }
}

export default apiProduct;
