import db, { dateParam, nestQuery, nestQuerySingle, sql } from '../../../config';
import { iOrder, iOrderDetail, iPayment } from '../../../components/interfaces';

type apiOrderReturnType = Promise<any[] | (readonly iOrder[] | undefined)[]>;

interface apiOrderFunction {
  getOrder(id: number): apiOrderReturnType;
  getAllOrder: () => apiOrderReturnType; // same as above
  // getOrderBySales: (id: number) => apiOrderReturnType;
  updateOrder(id: number, p: iOrder): apiOrderReturnType;
  insertOrder(p: iOrder): apiOrderReturnType;
  deleteOrder(id: number): apiOrderReturnType;
  getDetails(id: number): Promise<any[] | (readonly iOrderDetail[] | undefined)[]>;
  getPayments(id: number): Promise<any[] | (readonly iPayment[] | undefined)[]>;
}
// : SqlSqlTokenType<QueryResultRowType<string>>
/*
const dateParam = (dateObj: Date) => {
  return sql`TO_TIMESTAMP(${dateObj.getTime()} / 1000.0)`;
};


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
*/

const apiOrder: apiOrderFunction = {
  getPayments: async (id: number) => {
    return await db.query(sql`SELECT
      m.id, pm.name as "methodName", m.user_id,
      m.amount, m.descriptions,
      m.created_at, m.updated_at
    FROM payments AS m
    INNER JOIN payment_methods AS pm ON pm.id = m.method_id
    WHERE m.order_id = ${id}
    ORDER BY m.id`)
    .then((data) => ([data.rows, undefined]))
    .catch((error) => ([undefined, error]))
  },

  getDetails: async (id: number) => {
    // SELECT d.id, d.qty, d.weight, d.order_id, d.product_id,
    //   d.unit_id, d.unit_name, d.real_qty, d.profit, d.weight, d.price, d.discount, d.subtotal,
    //   d.created_at, d.updated_at, p.name "productName", p.spec, u.barcode
    //   FROM order_details AS d

    return await db.query(sql`
    SELECT d.id, d.qty, d.unit_name, d.price, d.discount, d.subtotal,
      p.name "productName", p.spec
    FROM order_details AS d
    INNER JOIN units AS u ON u.id = d.unit_id
    INNER JOIN products AS p ON p.id = u.product_id
    WHERE d.order_id = ${id}
    ORDER BY d.id
    `)
    .then((data) => ([data.rows, undefined]))
    .catch((error) => ([undefined, error]))
  },

  getOrder: async (id: number) => {
    return await db.query(
      sql`SELECT t.id, t.customer_id, t.sales_id, t.due_date, t.total, t.cash,
        t.payment, t.remain_payment, t.user_id, t.descriptions, t.status,
        t.created_at, t.updated_at,
        ${nestQuerySingle(sql`SELECT c.id, c.name, c.street, c.city, c.phone, c.cell, c.zip, c.credit_limit "creditLimit", c.descriptions, c.rayon_id "rayonId", c.created_at "createdAt", c.updated_at "updatedAt" FROM customers AS c WHERE c.id = t.customer_id`)} AS customer,
        ${nestQuerySingle(sql`SELECT s.id, s.name, s.street, s.city, s.phone, s.cell, s.zip, s.created_at "createdAt", s.updated_at "updatedAt" FROM salesmans AS s WHERE s.id = t.sales_id`)} AS salesman,
        ${nestQuery(sql`SELECT m.id, pm.name as "methodName", m.order_id "orderId", m.method_id "methodId", m.amount, m.descriptions, m.created_at "createdAt", m.updated_at "updatedAt" FROM payments AS m INNER JOIN payment_methods AS pm ON pm.id = m.method_id WHERE m.order_id = t.id ORDER BY m.id`)} AS payments,
        ${nestQuery(sql`
          SELECT d.id,
          d.qty, d.weight,
          d.order_id "orderId",
          d.product_id "productId",
          d.unit_id "unitId",
          d.unit_name "unitName",
          d.real_qty "realQty",
          d.profit, d.weight, d.price, d.discount, d.subtotal,
          d.created_at "createdAt",
          d.updated_at "updatedAt",
          p.name "productName",
          p.spec,
          u.barcode
          FROM order_details AS d
          INNER JOIN units AS u ON u.id = d.unit_id
          INNER JOIN products AS p ON p.id = u.product_id
          WHERE d.order_id = t.id
          ORDER BY d.id
        `)} AS details
      FROM orders AS t
      WHERE t.id = ${id}`)
      .then((data) => ([data.rows[0], undefined]))
      .catch((error) => ([undefined, error]))
  }

  , getAllOrder: async () => {
    return await db.query(
      sql`SELECT t.id, t.customer_id, t.sales_id, t.due_date,
      t.total, t.cash, t.payment, t.remain_payment, t.status,
      t.user_id, t.descriptions, t.created_at, t.updated_at
      FROM orders AS t
      ORDER BY t.id`)
      .then((data) => ([data.rows, undefined]))
      .catch((error) => ([undefined, error]))
  },

  insertOrder: async (c: iOrder) => {
    return await db.query
      (
        sql`INSERT INTO orders (
          customer_id, sales_id, due_date,
          total, cash, status, user_id,
          descriptions
        )
        VALUES (
          ${c.customerId}, ${c.salesId},  ${dateParam(c.dueDate)},
          ${0}, ${c.cash}, ${c.status}, ${c.userId || null},
          ${c.descriptions || null}
        )
        RETURNING *`
      )
      .then(data => ([data.rows[0], undefined]))
      .catch(error => ([undefined, error]));
  },

  updateOrder: async (id: number, c: iOrder) => {
    //           due_date = ${sql`to_timestamp(${c.dueDate.replace('T', ' ')} / 1000.0)`}, total = ${c.total},
    //console.log(c.dueDate)
    return await db.query
      (
        sql`UPDATE orders SET
          customer_id = ${c.customerId}, sales_id = ${c.salesId},
          due_date = ${dateParam(c.dueDate)},
          cash = ${c.cash}, status = ${c.status},
          user_id = ${c.userId || null}, descriptions = ${c.descriptions || null}
        WHERE id = ${id}
        RETURNING *`
      )
      .then(data => ([data.rows[0], undefined]))
      .catch(error => ([undefined, error]));
  },

  deleteOrder: async (id: number) => {
    return await db.query
      (
        sql`DELETE FROM orders
        WHERE id = ${id}
        RETURNING id`
      )
      .then(data => ([{ id: data.rows[0].id }, undefined]))
      .catch(error => ([undefined, error]));
  }
}

export default apiOrder;
