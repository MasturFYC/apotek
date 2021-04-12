import db, { sql, nestQuery } from '../../../config';
import { iWarehouse } from '../../../components/interfaces';
type apiWarehouseReturnType = Promise<any[] | (readonly iWarehouse[] | undefined)[]>;

interface apiWarehouseFunction {
  getWarehouse(id: number): apiWarehouseReturnType;
  getWarehouses: () => apiWarehouseReturnType; // same as above
  getListWarehouses: () => apiWarehouseReturnType; // same as above
  updateWarehouse(id: number, p: iWarehouse): apiWarehouseReturnType;
  insertWarehouse(p: iWarehouse): apiWarehouseReturnType;
  deleteWarehouse(id: number): apiWarehouseReturnType;
}

const apiWarehouse: apiWarehouseFunction = {
  getWarehouse: async (id: number) => {
    return await db.query(
      sql`SELECT t.id, t.name,
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
      WHERE p.warehouse_id = t.id`)} AS products
      FROM warehouses AS t
      WHERE t.id = ${id}`)
      .then((data) => ([data.rows[0], undefined]))
      .catch((error) => ([undefined, error]));
  },
  getListWarehouses: async () => {
    return await db.query(
      sql`SELECT id, name
      FROM warehouses
      ORDER BY name`)
      .then((data) => ([data.rows, undefined]))
      .catch((error) => ([undefined, error]))
  }
  , getWarehouses: async () => {
    return await db.query(
      sql`SELECT t.id, t.name, t.location
      FROM warehouses AS t
      ORDER BY t.name`)
      .then((data) => ([data.rows, undefined]))
      .catch((error) => ([undefined, error]))
  },

  insertWarehouse: async (c: iWarehouse) => {
    return await db.query
      (
        sql`INSERT INTO warehouses (name, location)
        VALUES (${c.name}, ${c.location??null})
        RETURNING id`
      )
      .then(data => ([{ ...c, id: data.rows[0].id }, undefined]))
      .catch(error => ([undefined, error]));
  },

  updateWarehouse: async (id: number, c: iWarehouse) => {
    return await db.query
      (
        sql`UPDATE warehouses  SET
        name = ${c.name}, location = ${c.location??null}
        WHERE id = ${id}
        RETURNING *`
      )
      .then(data => ([data.rows[0], undefined]))
      .catch(error => ([undefined, error]));
  },

  deleteWarehouse: async (id: number) => {
    return await db.query
      (
        sql`DELETE FROM warehouses
        WHERE id = ${id}
        RETURNING id`
      )
      .then(data => ([{ id: data.rows[0].id }, undefined]))
      .catch(error => ([undefined, error]));
  }
}

export default apiWarehouse;
