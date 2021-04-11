import db, { sql, nestQuery } from '../../../config';
import { iSupplier } from '../../../components/interfaces';
type apiSupplierReturnType = Promise<any[] | (readonly iSupplier[] | undefined)[]>;

interface apiSupplierFunction {
  getSupplier(id: number): apiSupplierReturnType;
  getSuppliers: () => apiSupplierReturnType; // same as above
  getListSuppliers: () => apiSupplierReturnType; // same as above
  updateSupplier(id: number, p: iSupplier): apiSupplierReturnType;
  insertSupplier(p: iSupplier): apiSupplierReturnType;
  deleteSupplier(id: number): apiSupplierReturnType;
}

const apiSupplier: apiSupplierFunction = {
  getSupplier: async (id: number) => {
    return await db.query(
      sql`SELECT t.id, t.name, t.contact_name, t.street, t.city, t.phone, t.cell, t.zip,
        ${nestQuery(sql`SELECT p.id, p.code, p.name, p.spec,
          p.base_unit "baseUnit",
          p.base_price "basePrice",
          p.base_weight "baseWeight",
          p.is_active "isActive",
          p.first_stock "firstStock",
          p.unit_in_stock "unitInStock",
          p.category_id "categoryId",
          p.supplier_id "supplierId",
          p.warehouse_id "warehouseId"
      FROM products AS p
      WHERE p.supplier_id = t.id`)} AS products
      FROM suppliers AS t
      WHERE t.id = ${id}
      ORDER BY t.name`)
      .then((data) => ([data.rows[0], undefined]))
      .catch((error) => ([undefined, error]));
  },

  getSuppliers: async () => {
    return await db.query(
      sql`SELECT id, name, contact_name, street, city, phone, cell, zip
      FROM suppliers
      ORDER BY name`)
      .then((data) => ([data.rows, undefined]))
      .catch((error) => ([undefined, error]))
  },

  getListSuppliers: async () => {
    return await db.query(
      sql`SELECT id, name
      FROM suppliers
      ORDER BY name`)
      .then((data) => ([data.rows, undefined]))
      .catch((error) => ([undefined, error]))
  },

  insertSupplier: async (c: iSupplier) => {
    return await db.query
      (
        sql`INSERT INTO suppliers (name, contact_name, street, city, phone, cell, zip)
        VALUES (${c.name}, ${c.contactName}, ${c.street}, ${c.city}, ${c.phone}, ${c.cell??null}, ${c.zip??null})
        RETURNING id`
      )
      .then(data => ([{ ...c, id: data.rows[0].id }, undefined]))
      .catch(error => ([undefined, error]));
  },

  updateSupplier: async (id: number, c: iSupplier) => {
    return await db.query
      (
        sql`UPDATE suppliers  SET
        name = ${c.name}, contact_name = ${c.contactName}, street = ${c.street},
        city = ${c.city}, phone = ${c.phone}, cell = ${c.cell??null}, zip = ${c.zip??null}
        WHERE id = ${id}
        RETURNING *`
      )
      .then(data => ([data.rows[0], undefined]))
      .catch(error => ([undefined, error]));
  },

  deleteSupplier: async (id: number) => {
    return await db.query
      (
        sql`DELETE FROM suppliers
        WHERE id = ${id}
        RETURNING id`
      )
      .then(data => ([{ id: data.rows[0].id }, undefined]))
      .catch(error => ([undefined, error]));
  }
}

export default apiSupplier;
