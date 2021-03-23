import db, { sql } from '../../../config';
import { iOrder } from 'components/interfaces';

type apiOrderReturnType = Promise<any[] | (readonly iOrder[] | undefined)[]>;

interface apiOrderFunction {
  getOrder(id: number): apiOrderReturnType;
  getAllOrder: () => apiOrderReturnType; // same as above
 // getOrderBySales: (id: number) => apiOrderReturnType;
  updateOrder(id: number, p: iOrder): apiOrderReturnType;
  insertOrder(p: iOrder): apiOrderReturnType;
  deleteOrder(id: number): apiOrderReturnType;
}
// : SqlSqlTokenType<QueryResultRowType<string>>
const dateParam = (dateObj: Date) => {
  return sql`TO_TIMESTAMP(${dateObj.getTime()} / 1000.0)`;
};

const apiOrder: apiOrderFunction = {
  getOrder: async (id: number) => {
    return await db.query(
      sql`SELECT t.id, t.customer_id, t.sales_id, t.due_date,
        t.total, t.cash, t.payments, t.remain_payment,
        t.created_at, t.updated_at
      FROM orders AS t
      WHERE t.id = ${id}`)
      .then((data) => ([data.rows[0], undefined]))
      .catch((error) => ([undefined, error]));
  }

  , getAllOrder: async () => {
    return await db.query(
      sql`SELECT t.id, t.customer_id, t.sales_id, t.due_date,
      t.total, t.cash, t.payments, t.remain_payment,
      t.created_at, t.updated_at
      FROM orders AS t
      ORDER BY t.id`)
      .then((data) => ([data.rows, undefined]))
      .catch((error) => ([undefined, error]))
  },

  insertOrder: async (c: iOrder) => {
    return await db.query<iOrder>
      (
        sql`INSERT INTO orders (
          customer_id, sales_id, due_date,
          total, cash, payments, remain_payment
        )
        VALUES (
          ${c.customerId}, ${c.salesId},  ${dateParam(c.dueDate)},
          ${c.total}, ${c.cash}
        )
        RETURNING id`
      )
      .then(data => ([{ ...c, id: data.rows[0].id }, undefined]))
      .catch(error => ([undefined, error]));
  },

  updateOrder: async (id: number, c: iOrder) => {
    return await db.query<iOrder>
      (
        sql`UPDATE orders SET
          customer_id = ${c.customerId}, sales_id = ${c.salesId},
          due_date = ${dateParam(c.dueDate)}, total = ${c.total}, cash = ${c.cash}
        WHERE id = ${id}
        RETURNING *`
      )
      .then(data => ([data.rows[0], undefined]))
      .catch(error => ([undefined, error]));
  },

  deleteOrder: async (id: number) => {
    return await db.query<iOrder>
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
