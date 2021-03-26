import db, { sql, nestQuery, nestQuerySingle } from '../../../config';
import { iSalesman } from 'components/interfaces';
type apiSalesReturnType = Promise<any[] | (readonly iSalesman[] | undefined)[]>;

interface apiSalesFunction {
  getSales(id: number): apiSalesReturnType;
  getAllSales: () => apiSalesReturnType; // same as above
  getListSales: () => apiSalesReturnType; // same as above
  getOrders: (salesId: number) => apiSalesReturnType;
  updateSales(id: number, p: iSalesman): apiSalesReturnType;
  insertSales(p: iSalesman): apiSalesReturnType;
  deleteSales(id: number): apiSalesReturnType;
}

const apiSales: apiSalesFunction = {
  getOrders: async (id: number) => {
    return await db.query(
      sql`SELECT t.id, t.name, t.street, t.city, t.phone, t.cell, t.zip, t.created_at, t.updated_at,
        ${nestQuery
        (sql`SELECT p.id,
          p.total, p.cash, p.payments,
          p.customer_id "customerId",
          p.sales_id "salesId",
          p.due_date "dueDate",
          p.remain_payment "remainPayment",
          p.created_at "createdAt",
          p.updated_at "updatedAt",
          ${nestQuerySingle(sql`
            SELECT c.id, c.name, c.street, c.city, c.phone,
            c.cell, c.zip, c.rayon_id "RayonId", c.created_at "createdAt",
            c.updated_at "updatedAt", c.credit_limit "creditLimit",
            c.customer_type "customerType", c.descriptions
            FROM customers AS c
            WHERE c.id = p.customer_id
          `)} AS customer
          FROM orders AS p
          WHERE p.sales_id = t.id
          ORDER BY p.id`
        )} AS orders
      FROM salesmans AS t
      WHERE t.id = ${id}`)
      .then((data) => ([data.rows[0], undefined]))
      .catch((error) => ([undefined, error]));
  },
  getSales: async (id: number) => {
    return await db.query(
      sql`SELECT t.id, t.name, t.street, t.city, t.phone, t.cell, t.zip, t.created_at, t.updated_at,
        ${nestQuery
        (sql`SELECT p.id,
        customer_id "customerId",
        sales_id "salesId",
        due_date "dueDate", total, cash, payments,
        remain_payment "remainPayment",
        created_at "createdAt",
        updated_at "updatedAt"
        FROM orders AS p
        WHERE p.sales_id = t.id
        ORDER BY p.id`
        )} AS orders
      FROM salesmans AS t
      WHERE t.id = ${id}`)
      .then((data) => ([data.rows[0], undefined]))
      .catch((error) => ([undefined, error]));
  }

  , getAllSales: async () => {
    return await db.query(
      sql`SELECT id, name, street, city, phone, cell, zip, created_at, updated_at
      FROM salesmans
      ORDER BY name`)
      .then((data) => ([data.rows, undefined]))
      .catch((error) => ([undefined, error]))
  },

  getListSales: async () => {
    return await db.query(
      sql`SELECT id, name
      FROM salesmans
      ORDER BY name`)
      .then((data) => ([data.rows, undefined]))
      .catch((error) => ([undefined, error]))
  },

  insertSales: async (c: iSalesman) => {
    return await db.query<iSalesman>
      (
        sql`INSERT INTO salesmans (name, street, city, phone, cell, zip)
        VALUES (${c.name}, ${c.street}, ${c.city}, ${c.phone}, ${c.cell || null}, ${c.zip || null})
        RETURNING id`
      )
      .then(data => ([{ ...c, id: data.rows[0].id }, undefined]))
      .catch(error => ([undefined, error]));
  },

  updateSales: async (id: number, c: iSalesman) => {
    return await db.query<iSalesman>
      (
        sql`UPDATE salesmans SET
        name = ${c.name}, street = ${c.street}, city = ${c.city}, phone = ${c.phone},
        cell = ${c.cell || null}, zip = ${c.zip || null}
        WHERE id = ${id}
        RETURNING *`
      )
      .then(data => ([data.rows[0], undefined]))
      .catch(error => ([undefined, error]));
  },

  deleteSales: async (id: number) => {
    return await db.query<iSalesman>
      (
        sql`DELETE FROM salesmans
        WHERE id = ${id}
        RETURNING id`
      )
      .then(data => ([{ id: data.rows[0].id }, undefined]))
      .catch(error => ([undefined, error]));
  }
}

export default apiSales;
