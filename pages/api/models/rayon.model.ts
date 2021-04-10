import db, { sql, nestQuery } from '../../../config';
import { iRayon } from '../../../components/interfaces';
type apiRayonReturnType = Promise<any[] | (readonly iRayon[] | undefined)[]>;

interface apiRayonFunction {
  getRayon(id: number): apiRayonReturnType;
  getRayons: () => apiRayonReturnType; // same as above
  getListRayons: () => apiRayonReturnType; // same as above
  updateRayon(id: number, p: iRayon): apiRayonReturnType;
  insertRayon(p: iRayon): apiRayonReturnType;
  deleteRayon(id: number): apiRayonReturnType;
}

const apiRayon: apiRayonFunction = {
  getRayon: async (id: number) => {
    return await db.query(
      sql`SELECT r.id, r.name, r.descriptions, r.created_at, r.updated_at,
        ${nestQuery(sql`SELECT t.id, t.name, t.street, t.city, t.phone,
        t.cell, t.zip,
        t.rayon_id "rayonId",
        t.created_at "createdAt",
        t.updated_at "updatedAt",
        t.credit_limit "creditLimit",
        t.customer_type "customerType",
        t.descriptions
      FROM customers AS t
      WHERE t.rayon_id = r.id`)} AS customers
      FROM rayons AS r
      WHERE r.id = ${id}`)
      .then((data) => ([data.rows[0], undefined]))
      .catch((error) => ([undefined, error]));
  },
  getListRayons: async () => {
    return await db.query(
      sql`SELECT r.id, r.name
      FROM rayons AS r
      ORDER BY r.name`)
      .then((data) => ([data.rows, undefined]))
      .catch((error) => ([undefined, error]))
  }
  , getRayons: async () => {
    return await db.query(
      sql`SELECT r.id, r.name, r.descriptions, r.created_at, r.updated_at
      FROM rayons AS r
      ORDER BY r.name`)
      .then((data) => ([data.rows, undefined]))
      .catch((error) => ([undefined, error]))
  },

  insertRayon: async (c: iRayon) => {
    return await db.query<iRayon>
      (
        sql`INSERT INTO rayons (name, descriptions)
        VALUES (${c.name}, ${c.descriptions??null})
        RETURNING id`
      )
      .then(data => ([{ ...c, id: data.rows[0].id }, undefined]))
      .catch(error => ([undefined, error]));
  },

  updateRayon: async (id: number, c: iRayon) => {
    return await db.query<iRayon>
      (
        sql`UPDATE rayons  SET
        name = ${c.name}, descriptions = ${c.descriptions??null}
        WHERE id = ${id}
        RETURNING *`
      )
      .then(data => ([data.rows[0], undefined]))
      .catch(error => ([undefined, error]));
  },

  deleteRayon: async (id: number) => {
    return await db.query<iRayon>
      (
        sql`DELETE FROM rayons
        WHERE id = ${id}
        RETURNING id`
      )
      .then(data => ([{ id: data.rows[0].id }, undefined]))
      .catch(error => ([undefined, error]));
  }
}

export default apiRayon;
