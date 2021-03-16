import db, { sql, nestQuery } from '../../../config';

const apiCategory = {
  getCategory: async (id: number) => {
    const result = await db.query(
      sql`SELECT t.id, t.name,
      ${nestQuery(sql`SELECT p.id, p.code, p.name, p.spec, p.base_unit, p.base_price, p.base_weight, p.is_active, p.first_stock, p.unit_in_stock, p.category_id, p.supplier_id, p.warehouse_id,
      ROW_NUMBER () OVER (ORDER BY p.name)
      FROM products AS p
      WHERE p.category_id = t.id`)} AS products
      FROM categories AS t
      WHERE t.id = ${id}`);
    if(result.rowCount === 0) {
      return null;
    }
    return result.rows[0];
  }
  , getCategories: async () => {
    const result = await db.query(
      sql`SELECT t.id, t.name
      FROM categories AS t
      ORDER BY t.name`);
    if(result.rowCount === 0) {
      return null;
    }
    return result.rows;
  }

}

export default apiCategory;
