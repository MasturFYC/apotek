import db, { sql } from '../../../config';
import { iProduct, iUnit } from '../../../components/interfaces'
//import { nestQuery } from './nest'

interface ErrorResultType {
  id: number;
  message: string;
}
const apiProduct = {
  getProduct: async (id: number) => {
    const result = await db.query<iProduct>(
      sql`SELECT t.id, t.code, t.name, t.spec
      FROM products AS t
      WHERE t.id = ${id}`);
    if (result.rowCount === 0) {
      return null;
    }
    return result.rows[0];
  }
  , getProducts: async () => {
    const result = await db.query(
      sql`SELECT t.id, t.code, t.name, t.spec
      FROM products AS t
      ORDER BY t.name`);
    if (result.rowCount === 0) {
      return null;
    }
    return result;
  }, updateProduct: async (id: number, p: iProduct): Promise<iProduct | null> => {
    //console.log('ID',id,p)
    const result = await db.query<iProduct>(
      sql`UPDATE products
      SET name = ${p.name}, code = ${p.code}, spec = ${p.spec},
      category_id = ${p.category_id}
      WHERE id = ${id}
      RETURNING id`);

    if (result.rowCount === 0) {
      return null;
    }
    return { ...p, id: result.rows[0].id };
  }
  , insertProduct: async (id: number, p: iProduct) => {
    const result = await db.query<iProduct>(
      sql`INSERT INTO products (code, name, spec, base_unit, base_price, base_weight, is_active, first_stock, unit_in_stock, category_id, supplier_id, warehouse_id)
      VALUES (${p.code}, ${p.name}, ${p.spec}, ${p.base_unit}, ${p.base_price}, ${p.base_weight}, ${p.is_active}, ${p.first_stock}, ${p.unit_in_stock}, ${p.category_id}, ${p.supplier_id}, ${p.warehouse_id})
      RETURNING id`);
    if (result.rowCount === 0) {
      return null;
    }
    return { ...p, id: result.rows[0].id };
  }, getUnits: async (id: number) => {
    const result = await db.query<iUnit>(
      sql`SELECT id, barcode, "name", content, "weight", buy_price,
      margin, agent_margin, member_margin,
      sale_price, agent_price, member_price,
      profit, product_id
      FROM units
      WHERE product_id = ${id}
      ORDER BY content`);

    //console.log(result)

    if (result.rowCount === 0) {
      return null;
    }

    return result.rows;
  }
}

export default apiProduct;
