import db, { sql, nestQuery } from '../../../config';
import { iCategory } from 'components/interfaces';
type apiCategoryReturnType = Promise<any[] | (readonly iCategory[] | undefined)[]>;

interface apiCategoryFunction {
  getCategory(id: number): apiCategoryReturnType;
  getCategories: () => apiCategoryReturnType; // same as above
  updateCategory(id: number, p: iCategory): apiCategoryReturnType;
  insertCategory(p: iCategory): apiCategoryReturnType;
  deleteCategory(id: number): apiCategoryReturnType;
}

const apiCategory: apiCategoryFunction = {
  getCategory: async (id: number) => {
/*
    return await db.query(
      sql`SELECT t.id, t.name,
        ${nestQuery(sql`SELECT p.id, p.code, p.name, p.spec, p.base_unit, p.base_price, p.base_weight, p.is_active, p.first_stock, p.unit_in_stock, p.category_id, p.supplier_id, p.warehouse_id,
        ${nestQuery(sql`SELECT id, barcode, name, content, weight, buy_price,
        margin, agent_margin, member_margin,
        sale_price, agent_price, member_price,
        profit, product_id
      FROM units
      WHERE product_id = p.id
      ORDER BY content`)} AS units
      FROM products AS p
      WHERE p.category_id = t.id`)} AS products
      FROM categories AS t
      WHERE t.id = ${id}`)
      .then((data) => ([data.rows[0], undefined]))
      .catch((error) => ([undefined, error]));
*/
    return await db.query(
      sql`SELECT t.id, t.name,
        ${nestQuery(sql`SELECT p.id, p.code, p.name, p.spec, p.base_unit, p.base_price, p.base_weight, p.is_active, p.first_stock, p.unit_in_stock, p.category_id, p.supplier_id, p.warehouse_id
      FROM products AS p
      WHERE p.category_id = t.id`)} AS products
      FROM categories AS t
      WHERE t.id = ${id}`)
      .then((data) => ([data.rows[0], undefined]))
      .catch((error) => ([undefined, error]));
  }
  , getCategories: async () => {
    return await db.query(
      sql`SELECT id, name
      FROM categories
      ORDER BY name`)
      .then((data) => ([data.rows, undefined]))
      .catch((error) => ([undefined, error]))
  },

  insertCategory: async (c: iCategory) => {
    return await db.query<iCategory>
      (
        sql`INSERT INTO categories (name)
        VALUES (${c.name})
        RETURNING id`
      )
      .then(data => ([{ ...c, id: data.rows[0].id }, undefined]))
      .catch(error => ([undefined, error]));
  },

  updateCategory: async (id: number, c: iCategory) => {
    return await db.query<iCategory>
      (
        sql`UPDATE categories  SET
        name = ${c.name}
        WHERE id = ${id}
        RETURNING *`
      )
      .then(data => ([data.rows[0], undefined]))
      .catch(error => ([undefined, error]));
  },

  deleteCategory: async (id: number) => {
    return await db.query<iCategory>
      (
        sql`DELETE FROM categories
        WHERE id = ${id}
        RETURNING id`
      )
      .then(data => ([{ id: data.rows[0].id }, undefined]))
      .catch(error => ([undefined, error]));
  }
}

export default apiCategory;
