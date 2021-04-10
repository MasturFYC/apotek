import db, { nestQuery, nestQuerySingle, sql } from '../../../config';
import { iOrderDetail } from '../../../components/interfaces';

type apiOrderDetailReturnType = Promise<any[] | (readonly iOrderDetail[] | undefined)[]>;

interface apiOrderDetailFunction {
  getDetail(id: number): apiOrderDetailReturnType;
  getAllDetail: () => apiOrderDetailReturnType; // same as above
  // getOrderBySales: (id: number) => apiOrderDetailReturnType;
  updateDetail(id: number, p: iOrderDetail): apiOrderDetailReturnType;
  insertDetail(p: iOrderDetail): apiOrderDetailReturnType;
  deleteDetail(id: number): apiOrderDetailReturnType;
}
// : SqlSqlTokenType<QueryResultRowType<string>>
/*
const dateParam = (dateObj: Date) => {
  return sql`TO_TIMESTAMP(${dateObj.getTime()} / 1000.0)`;
};
*/
const apiOrderDetail: apiOrderDetailFunction = {
  getDetail: async (id: number) => {
    return await db.query(
      sql`SELECT t.id, t.customer_id, t.sales_id, t.due_date, t.total, t.cash,
        t.payment, t.remain_payment, t.user_id, t.descriptions, t.status,
        t.created_at, t.updated_at,
        ${nestQuerySingle(sql`SELECT c.id, c.name, c.street, c.city, c.phone, c.cell, c.zip, c.credit_limit "creditLimit", c.descriptions, c.rayon_id "rayonId", c.created_at "createdAt", c.updated_at "updatedAt" FROM customers AS c WHERE c.id = t.customer_id`)} AS customer,
        ${nestQuerySingle(sql`SELECT s.id, s.name, s.street, s.city, s.phone, s.cell, s.zip, s.created_at "createdAt", s.updated_at "updatedAt" FROM salesmans AS s WHERE s.id = t.sales_id`)} AS salesman,
        ${nestQuery(sql`SELECT m.id, pm.name as "methodName", m.order_id "orderId", m.method_id "methodId", m.amount, m.descriptions, m.created_at "createdAt", m.updated_at "updatedAt" FROM payments AS m INNER JOIN payment_methods AS pm ON pm.id = m.method_id WHERE m.order_id = t.id ORDER BY id`)} AS payments,
        ${nestQuery(sql`
          SELECT d.id,
          d.qty,
          d.weight,
          d.order_id "orderId",
          d.product_id "productId",
          d.unit_id "unitId",
          d.unit_name "unitName",
          d.real_qty "realQty",
          d.created_at "createdAt",
          d.updated_at "updatedAt",
          ${nestQuerySingle(sql`
            SELECT u.id,  u.name, u.barcode, u.content, u.weight, u.margin, u.profit,
              u.product_id "productId",
              u.buy_price "buyPrice",
              u.agent_margin "agentMargin",
              u.member_margin "memberMargin",
              u.sale_price "salePrice",
              u.agent_price "agentPrice",
              u.member_price "memberPrice",
              u.created_at "createdAt",
              u.updated_at "updatedAt",
              ${nestQuerySingle(sql`
              SELECT p.code, p.name, p.spec, p.base_unit "baseUnit",
                p.base_price "basePrice", p.base_weight "baseWeight",
                p.is_active "isActive", p.first_stock "firstStock",
                p.unit_in_stock "unitInStock", p.category_id "categoryId",
                p.supplier_id "supplierId", p.warehouse_id "warehouseId",
                p.created_at "createdAt",
                p.updated_at "updatedAt"
                FROM products as p
                WHERE p.id = u.product_id
              `)} AS product
              FROM units as u
              WHERE u.id = d.unit_id
          `)} as unit
          FROM order_details AS d
          WHERE d.order_id = t.id
          ORDER BY d.id
        `)} AS details
      FROM order_details AS t
      WHERE t.id = ${id}`)
      .then((data) => ([data.rows[0], undefined]))
      .catch((error) => ([undefined, error]))
  }
  , getAllDetail: async () => {
    return await db.query(
      sql`SELECT t.id, t.customer_id, t.sales_id, t.due_date,
 t.total, t.cash, t.payment, t.remain_payment, t.status,
 t.user_id, t.descriptions, t.created_at, t.updated_at
 FROM order_details AS t
 ORDER BY t.id`)
      .then((data) => ([data.rows, undefined]))
      .catch((error) => ([undefined, error]))
  },
  insertDetail: async (d: iOrderDetail) => {
    //console.log(d)
    return await db.query<iOrderDetail>
      (sql`INSERT INTO order_details
 (order_id, product_id, unit_id, qty, unit_name, real_qty, weight, discount, profit, price, subtotal)
 VALUES (${d.orderId}, ${d.productId}, ${d.unitId}, ${d.qty}, ${d.unitName}, ${d.realQty}, ${d.weight}, ${d.discount}, ${d.profit}, ${d.price}, ${d.subtotal})
 RETURNING *`)
      .then(data => ([data.rows[0], undefined]))
      .catch(error => ([undefined, error]));
  },

  updateDetail: async (id: number, d: iOrderDetail) => {
    //           due_date = ${sql`to_timestamp(${c.dueDate.replace('T', ' ')} / 1000.0)`}, total = ${c.total},

    //console.log(d)

    return await db.query<iOrderDetail>
      (sql`UPDATE order_details SET
 order_id = ${d.orderId},
 product_id = ${d.productId},
 price =  ${d.price},
 unit_id = ${d.unitId},
 qty = ${d.qty},
 unit_name = ${d.unitName},
 real_qty = ${d.realQty},
 discount = ${d.discount},
 weight = ${d.weight},
 profit = ${d.profit},
 subtotal = ${d.subtotal}
 WHERE id = ${id}
 RETURNING *`)
      .then(data => ([data.rows[0], undefined]))
      .catch(error => ([undefined, error]));
  },

  deleteDetail: async (id: number) => {
    return await db.query<iOrderDetail>
      (sql`DELETE FROM order_details WHERE id = ${id} RETURNING id`)
      .then(data => ([{ id: data.rows[0].id }, undefined]))
      .catch(error => ([undefined, error]));
  }
}

export default apiOrderDetail;
