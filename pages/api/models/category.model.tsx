import db, { sql, nestQuery } from '../../../config';
import { iCategory } from 'components/interfaces';
type apiCategoryReturnType = Promise<any[] | (readonly iCategory[] | undefined)[]>;

interface apiCategoryFunction {
  getCategory(id: number): apiCategoryReturnType;
  getCategories: () => apiCategoryReturnType; // same as above
  //updateProduct(id: number, p: iProduct): apiCategoryReturnType;
  //insertProduct(p: iProduct): apiCategoryReturnType;
  //getUnits(id: number): apiCategoryReturnType;
}


const apiCategory: apiCategoryFunction = {
  getCategory: async (id: number) => {
    return await db.query(
      sql`SELECT t.id, t.name,
        ${nestQuery(sql`SELECT p.id, p.code, p.name, p.spec, p.base_unit, p.base_price, p.base_weight, p.is_active, p.first_stock, p.unit_in_stock, p.category_id, p.supplier_id, p.warehouse_id,
        ROW_NUMBER () OVER (ORDER BY p.name)
      FROM products AS p
      WHERE p.category_id = t.id`)} AS products
      FROM categories AS t
      WHERE t.id = ${id}`)
      .then((data) => ([data.rows[0], undefined]))
      .catch((error) => ([undefined, error]));
  }
  , getCategories: async () => {
    return await db.query(
      sql`SELECT t.id, t.name
      FROM categories AS t
      ORDER BY t.name`)
      .then((data) => ([data.rows, undefined]))
      .catch((error) => ([undefined, error]))
  }

}

export default apiCategory;
