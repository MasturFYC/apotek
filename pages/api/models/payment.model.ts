import db, { nestQuerySingle, sql } from '../../../config';
import { iPayment } from '../../../components/interfaces';

type apiPaymentReturnType = Promise<any[] | (readonly iPayment[] | undefined)[]>;

interface apiPaymentFunction {
  getMethods: () => apiPaymentReturnType
  getPayment(id: number): apiPaymentReturnType;
  getAllPayment: () => apiPaymentReturnType; // same as above
  getPaymentByOrder: (orderId: number) => apiPaymentReturnType; // same as above
  // getPaymentBySales: (id: number) => apiPaymentReturnType;
  updatePayment(id: number, p: iPayment): apiPaymentReturnType;
  insertPayment(p: iPayment): apiPaymentReturnType;
  deletePayment(id: number): apiPaymentReturnType;
}

const apiPayment: apiPaymentFunction = {
  getMethods: async () => {
    return await db.query(
      sql`SELECT id, name, descriptions
      FROM payment_methods
      ORDER BY name`)
      .then((data) => ([data.rows, undefined]))
      .catch((error) => ([undefined, error]))
  }

  , getPayment: async (id: number) => {
    return await db.query(
      sql`SELECT t.id, t.order_id, t.method_id, t.amount,
      t.descriptions, t.user_id, t.created_at, t.updated_at,
      ${nestQuerySingle(sql`
        SELECT id, name, descriptions FROM payment_methods WHERE id = t.method_id
      `)} AS payment
      FROM payments AS t
      WHERE t.id = ${id}`)
      .then((data) => ([data.rows[0], undefined]))
      .catch((error) => ([undefined, error]))
  }

  , getAllPayment: async () => {
    return await db.query(
      sql`SELECT t.id, t.order_id, t.method_id, t.amount,
      t.descriptions, t.user_id, t.created_at, t.updated_at,
      ${nestQuerySingle(sql`
        SELECT id, name, descriptions FROM payment_methods WHERE id = t.method_id
      `)} AS payment
      FROM payments AS t
      ORDER BY t.id`)
      .then((data) => ([data.rows, undefined]))
      .catch((error) => ([undefined, error]))
  }

  , getPaymentByOrder: async (orderId: number) => {
    return await db.query(
      sql`SELECT t.id, t.order_id, t.method_id, t.amount,
      t.descriptions, t.user_id, t.created_at, t.updated_at,
      ${nestQuerySingle(sql`
        SELECT id, name, descriptions FROM payment_methods WHERE id = t.method_id
      `)} AS payment
      FROM payments AS t
      WHERE t.id = ${orderId}
      ORDER BY t.id`)
      .then((data) => ([data.rows, undefined]))
      .catch((error) => ([undefined, error]))
  },

  insertPayment: async (c: iPayment) => {
    //console.log(c)
    return await db.query
      (
        sql`INSERT INTO payments (order_id, method_id, amount, descriptions, user_id)
        VALUES (${c.orderId},${c.methodId},${c.amount},${c.descriptions || null}, ${c.userId} || '-')
        RETURNING id`
      )
      .then(data => ([{ id: data.rows[0].id }, undefined]))
      .catch(error => ([undefined, error]));
  },

  updatePayment: async (id: number, c: iPayment) => {
    return await db.query
      (
        sql`UPDATE payments SET
          order_id = ${c.orderId}, method_id = ${c.methodId},
          amount = ${c.amount}, descriptions = ${c.descriptions || null},
          user_id = ${c.userId || '-'}
        WHERE id = ${id}
        RETURNING *`
      )
      .then(data => ([data.rows[0], undefined]))
      .catch(error => ([undefined, error]));
  },

  deletePayment: async (id: number) => {
    return await db.query
      (
        sql`DELETE FROM payments
        WHERE id = ${id}
        RETURNING id`
      )
      .then(data => ([{ id: data.rows[0].id }, undefined]))
      .catch(error => ([undefined, error]));
  }
}

export default apiPayment;
