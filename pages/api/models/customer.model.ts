import db, { sql, nestQuery } from '../../../config';
import { iCustomer, iDataList } from '../../../components/interfaces'


type apiCustomerReturnType = Promise<any[] | (readonly iCustomer[] | undefined)[]>;

interface apiProductFunction {
  getCustomer(custId: number): apiCustomerReturnType;
  deleteCustomer: (id: number) => apiCustomerReturnType; // same as above
  updateCustomer(custId: number, p: iCustomer): apiCustomerReturnType;
  insertCustomer(p: iCustomer): apiCustomerReturnType;
  getCustomers: () => apiCustomerReturnType;
  getListCustomers: () => apiCustomerReturnType;
  searchCustomers(name: string, limit: number, offset: number): apiCustomerReturnType;
  getCustomersByRayon(rayonId: number): apiCustomerReturnType;
}

const apiCustomer: apiProductFunction = {
  getCustomer: async (id: number) => {
    return await db.query<iCustomer>
      (
        sql`SELECT t.id, t.name, t.street, t.city, t.phone,
          t.cell, t.zip, t.rayon_id, t.created_at, t.updated_at,
          t.credit_limit, t.descriptions
        FROM customers AS t
        WHERE t.id = ${id}`
      )
      .then(data => ([data.rows[0], undefined]))
      .catch(error => ([undefined, error]));
  },

  getListCustomers: async () => {
    return await db.query<iDataList>
      (
        sql`SELECT t.id, t.name
        FROM customers AS t
        ORDER BY t.name`
      )
      .then(data => ([data.rows, undefined]))
      .catch(error => ([undefined, error]));
  }
  ,  getCustomers: async () => {
    return await db.query<iCustomer>
      (
        sql`SELECT t.id, t.name, t.street, t.city, t.phone,
          t.cell, t.zip, t.rayon_id, t.created_at, t.updated_at,
          t.credit_limit, t.customer_type, t.descriptions
        FROM customers AS t
        ORDER BY t.name`
      )
      .then(data => ([data.rows, undefined]))
      .catch(error => ([undefined, error]));
  },
  searchCustomers: async (name: string, limit: number, offset: number) => {
    return await db.query<iCustomer>
      (
        sql`SELECT t.id, t.name, t.street, t.city, t.phone,
          t.cell, t.zip, t.rayon_id, t.created_at, t.updated_at,
          t.credit_limit, t.customer_type, t.descriptions
        FROM customers AS t
        ORDER BY t.name
        LIMIT ${limit} OFFSET ${offset}`
      )
      .then(data => ([data.rows, undefined]))
      .catch(error => ([undefined, error]));
  },

  getCustomersByRayon: async (rayonId: number) => {
    return await db.query<iCustomer>
      (
        sql`SELECT t.id, t.name, t.street, t.city, t.phone,
          t.cell, t.zip, t.rayon_id, t.created_at, t.updated_at,
          t.credit_limit, t.customer_type, t.descriptions
        FROM customers AS t
        WHERE t.rayon_id = ${rayonId}
        ORDER BY t.name`
      )
      .then(data => ([data.rows, undefined]))
      .catch(error => ([undefined, error]));
  },

  insertCustomer: async (c: iCustomer) => {
    return await db.query<iCustomer>
      (
        sql`INSERT INTO customers (name, street, city, phone,
          cell, zip, rayon_id, credit_limit, customer_type, descriptions)
        VALUES (${c.name}, ${c.street}, ${c.city}, ${c.phone}, ${c.cell || null},
          ${c.zip!}, ${c.rayonId}, ${c.creditLimit}, ${c.customerType}, ${c.descriptions || null})
        RETURNING id`
      )
      .then(data => ([{ ...c, id: data.rows[0].id }, undefined]))
      .catch(error => ([undefined, error]));
  },

  updateCustomer: async (id: number, c: iCustomer) => {
    return await db.query<iCustomer>
      (
        sql`UPDATE customers  SET
        name = ${c.name}, street = ${c.street}, city = ${c.city}, phone = ${c.phone},
        cell = ${c.cell!}, zip = ${c.zip!}, rayon_id = ${c.rayonId},
        credit_limit = ${c.creditLimit}, customer_type = ${c.customerType},
        descriptions = ${c.descriptions!}
        WHERE id = ${id}
        RETURNING *`
      )
      .then(data => ([data.rows[0], undefined]))
      .catch(error => ([undefined, error]));
  },

  deleteCustomer: async (id: number) => {
    return await db.query<iCustomer>
      (
        sql`DELETE FROM customers
        WHERE id = ${id}
        RETURNING id`
      )
      .then(data => ([{ id: data.rows[0].id }, undefined]))
      .catch(error => ([undefined, error]));
  }
}

export default apiCustomer;
