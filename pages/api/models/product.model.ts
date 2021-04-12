import db, { nestQuery, sql } from '../../../config';
import { iProduct, iUnit } from '../../../components/interfaces'

type apiProductReturnType = Promise<any[] | (readonly iProduct[] | undefined)[]>;
type apiUnitReturnType = Promise<any[] | (readonly iUnit[] | undefined)[]>;

interface apiProductFunction {
  searchProduct: (text: string) => apiProductReturnType,
  getProduct(id: number): apiProductReturnType;
  deleteProduct(id: number): apiProductReturnType;
  getProducts: () => apiProductReturnType; // same as above
  updateProduct(id: number, p: iProduct, includeUnit: boolean): apiProductReturnType;
  insertProduct(p: iProduct): apiProductReturnType;
  getUnits(id: number): apiUnitReturnType;
}

const updateUnit = async (units: iUnit[]) => {

  await db.transaction(async (transact) => {

    units.map( async (p: iUnit) => {
      await transact.query(
        sql`UPDATE units SET
          weight = ${p.weight},
          buy_price = ${p.buyPrice},
          sale_price = ${p.salePrice},
          agent_price = ${p.agentPrice},
          member_price = ${p.memberPrice}
        WHERE id = ${p.id}
        RETURNING *`
      );
    })
  })

  return true;
}

const apiProduct: apiProductFunction = {
  searchProduct: async (text: string | string[]) => {
    return await db.query
      (
      sql`SELECT p.id, p.code, p.name, p.spec, p.base_unit, p.base_price, p.base_weight, p.is_active,
      p.first_stock, p.unit_in_stock, p.category_id, p.supplier_id, p.warehouse_id,
      ${nestQuery(sql`SELECT
        u.id, u.barcode, u.name, u.content,
        u.weight, u.margin, u.profit,
        u.buy_price "buyPrice",
        u.agent_margin "agentMargin",
        u.member_margin "memberMargin",
        u.sale_price "salePrice",
        u.agent_price "agentPrice",
        u.member_price "memberPrice",
        u.product_id "productId"
        FROM units AS u
        WHERE u.product_id = p.id`)} AS "units"
      FROM products AS p
      WHERE position(${text} in LOWER(p.name)) > 0
      ORDER BY p.name`)
      .then(data => ([data.rows, undefined]))
      .catch(error => ([undefined, error]))
  }
  , getProduct: async (id: number) => {
   return await db.query(
      sql`SELECT code, name, spec, base_unit, base_price, base_weight, is_active,
      first_stock, unit_in_stock, category_id, supplier_id, warehouse_id
        FROM products
        WHERE id = ${id}`)
      .then(data => ([data.rows[0], undefined]))
      .catch(error => ([undefined, error]))

  },

  deleteProduct: async (id: number) => {
    return await db.query(
      sql`DELETE FROM products
        WHERE id = ${id}
        RETURNING id`)
      .then(data => ([data.rows[0], undefined]))
      .catch(error => ([undefined, error]))

  },

  getProducts: async () => {
    return await db.query(
      sql`SELECT code, name, spec, base_unit, base_price, base_weight, is_active,
        first_stock, unit_in_stock, category_id, supplier_id, warehouse_id
        FROM products
        ORDER BY name`)
      .then(data => ([data.rows, undefined]))
      .catch(error => ([undefined, error]))
  },

  updateProduct: async (id: number, p: iProduct, includeUnit: boolean) => {

    if (includeUnit && p.units) {
      if (!updateUnit(p.units)) {
        return ([undefined, {message: 'Multiple unit can not be updated!'}])
      }
    }

    return await db.query(
      sql`UPDATE products SET
        name = ${p.name}, code = ${p.code}, spec = ${p.spec ?? null}, base_unit = ${p.baseUnit},
        base_price = ${p.basePrice}, base_weight = ${p.baseWeight}, is_active = ${p.isActive},
        first_stock = ${p.firstStock}, category_id = ${p.categoryId},
        supplier_id = ${p.supplierId}, warehouse_id = ${p.warehouseId}
      WHERE id = ${id}
      RETURNING *`)
      .then(data => ([data.rows[0], undefined]))
      .catch(error => ([undefined, error]))
  },

  insertProduct: async (p: iProduct) => {
    return await db.query(
      sql`INSERT INTO products (code, name, spec, base_unit, base_price, base_weight, is_active, first_stock, category_id, supplier_id, warehouse_id, unit_in_stock)
        VALUES (${p.code}, ${p.name}, ${p.spec || null }, ${p.baseUnit}, ${p.basePrice}, ${p.baseWeight}, ${p.isActive}, ${p.firstStock}, ${p.categoryId}, ${p.supplierId}, ${p.warehouseId}, ${0})
        RETURNING id`)
      .then(data => ([{ ...p, id: data.rows[0].id }, undefined]))
      .catch(error => ([undefined, error]))
  },

  /**
   *
   * @param id Product ID
   * @returns Array of unit => iUnit[]
   */
  getUnits: async (id: number) => {
    /*
    return await db.query(
      sql`SELECT p.id, p.code, p.name, p.spec, p.baseUnit, p.basePrice, p.baseWeight, p.isActive, p.firstStock, p.unit_in_stock, p.categoryId, p.supplierId, p.warehouseId,
      ${nestQuery(sql`SELECT id, barcode, name, content, weight, buy_price,
        margin, agent_margin, member_margin,
        sale_price, agent_price, member_price,
        profit, product_id
      FROM units
      WHERE product_id = p.id
      ORDER BY content`)} AS units
      WHERE p.id = ${id}`)
      */

    return await db.query(
      sql`SELECT id, barcode, name, content, weight, buy_price,
        margin, agent_margin, member_margin,
        sale_price, agent_price, member_price,
        profit, product_id
      FROM units
      WHERE product_id = ${id}
      ORDER BY content`)
      .then(data => ([data.rows, undefined]))
      .catch(error => ([undefined, error]))
  }
}

export default apiProduct;
