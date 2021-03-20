import db, { sql, nestQuery } from '../../../config';
import { iSales } from 'components/interfaces';
type apiSalesReturnType = Promise<any[] | (readonly iSales[] | undefined)[]>;

interface apiSalesFunction {
  getSales(id: number): apiSalesReturnType;
  getAllSales: () => apiSalesReturnType; // same as above
  updateSales(id: number, p: iSales): apiSalesReturnType;
  insertSales(p: iSales): apiSalesReturnType;
  deleteSales(id: number): apiSalesReturnType;
}

const apiSales: apiSalesFunction = {
  getSales: async (id: number) => {
    return await db.query(
      sql`SELECT t.id, t.name, t.street, t.city, t.phone, t.cell, t.zip, t.created_at, t.updated_at,
        ${nestQuery
        (sql`SELECT p.id, customer_id, sales_id, due_date, total, cash, payments, remain_payment, created_at, updated_at
          FROM orders AS p
          WHERE p.sales_id = t.id
          ORDER BY p.id`
        )} AS orders
      FROM sales AS t
      WHERE t.id = ${id}`)
      .then((data) => ([data.rows[0], undefined]))
      .catch((error) => ([undefined, error]));
  }

  , getAllSales: async () => {
    return await db.query(
      sql`SELECT id, name, street, city, phone, cell, zip, created_at, updated_at
      FROM sales
      ORDER BY name`)
      .then((data) => ([data.rows, undefined]))
      .catch((error) => ([undefined, error]))
  },

  insertSales: async (c: iSales) => {
    return await db.query<iSales>
      (
        sql`INSERT INTO sales (name, street, city, phone, cell, zip)
        VALUES (${c.name}, ${c.street}, ${c.city}, ${c.phone}, ${c.cell || null}, ${c.zip || null})
        RETURNING id`
      )
      .then(data => ([{ ...c, id: data.rows[0].id }, undefined]))
      .catch(error => ([undefined, error]));
  },

  updateSales: async (id: number, c: iSales) => {
    return await db.query<iSales>
      (
        sql`UPDATE sales SET
        name = ${c.name}, street = ${c.street}, city = ${c.city}, phone = ${c.phone},
        cell = ${c.cell || null}, zip = ${c.zip || null}
        WHERE id = ${id}
        RETURNING *`
      )
      .then(data => ([data.rows[0], undefined]))
      .catch(error => ([undefined, error]));
  },

  deleteSales: async (id: number) => {
    return await db.query<iSales>
      (
        sql`DELETE FROM sales
        WHERE id = ${id}
        RETURNING id`
      )
      .then(data => ([{ id: data.rows[0].id }, undefined]))
      .catch(error => ([undefined, error]));
  }
}

export default apiSales;
