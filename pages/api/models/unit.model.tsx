import db, { sql } from '../../../config';
import { iUnit } from '../../../components/interfaces'
//import { nestQuery } from './nest'
import { UniqueIntegrityConstraintViolationError } from 'slonik'

type errorMessage = {
  id: 0,
  rowCount: number;
  rows: iUnit[]
  message: string;
}

type ApiUnitType = {
  message?: errorMessage,
  data?: iUnit | iUnit[] | any
}

const apiUnit = {
  getUnit: async (id: number, callback: Function) => {
    const result = await db.query<iUnit>(
      sql`SELECT id, barcode, name, content, weight, buy_price,
      margin, agent_margin, member_margin,
      sale_price, agent_price, member_price,
      profit, product_id
      FROM units
      WHERE id = ${id}`)
      .then((data) => {
        callback(data.rows[0], null)
      }).catch((error) => {
        callback(null, {
          id: 0,
          message: "No data found"
        }, null);
      });
    /*
    if (result.rowCount === 0) {
      callback(error: {
        message: {
          id: 0,
          message: 'Data not found!'
        }
      });
    }
    return {
      data: result.rows[0]
    }
    */
  }
  , getUnits: async (callback: Function) => {
    const result = await db.query<iUnit>(
      sql`SELECT id, barcode, name, content, weight, buy_price,
      margin, agent_margin, member_margin,
      sale_price, agent_price, member_price,
      profit, product_id
      ORDER BY content`)
      .then((data) => {
        callback(data.rows, null)
      }).catch((error) => {
        callback(null, {
          id: 0,
          message: "No data found"
        }, null);
      });
    ;

    // if (result.rowCount === 0) {
    //   return {
    //     message: {
    //       id: 0,
    //       message: 'Data not found!'
    //     }
    //   };
    // }
    // return {
    //   data: result.rows
    // };
  }, updateUnit: async (id: number, p: iUnit): Promise<any> => {
    //console.log('ID',id,p)
    let errMessage: ApiUnitType;

    const result = await db.query<iUnit|any>(sql`
      UPDATE units SET barcode = ${p.barcode}, name = ${p.name},
      content = ${p.content}, weight = ${p.weight}, buy_price = ${p.buy_price},
      margin = ${p.margin}, agent_margin = ${p.agent_margin},
      member_margin = ${p.member_margin}, sale_price = ${p.sale_price},
      agent_price = ${p.agent_price}, member_price = ${p.member_price},
      profit = ${p.profit}, product_id = ${p.product_id}
      WHERE id = ${id}
      RETURNING id
      `).then(data=>data).catch((err) => err)
      /*
      .then((data) => {
        callback(data.rows[0].id, null);
      })
      .catch((error) => {
        if (error instanceof UniqueIntegrityConstraintViolationError) {
          //callback(error)
          console.log('Err ==:', error)
          callback(null, {
              id: 0,
              message: error.message
          })
        } else {
          callback(null, error)
        }
      })
      */

    if (!result.rowCount) {
      console.log('Error => ', result)
      return {
        rowCount: 0,
        message: result.message
      }
    }

    return result.rows[0].id;



    // console.log('Result: === ', res)
    // if (res.rowCount === 0) {
    //   return null;
    // }
    // return { ...p, id: res.rows[0].id };
  }
  , insertUnit: async (id: number, p: iUnit, callback: Function) => {
    const res = await db.query<iUnit | any>(
      sql`INSERT INTO units (barcode, name, content, weight, buy_price,
        margin, agent_margin, member_margin,
        sale_price, agent_price, member_price,
        profit, product_id)
      VALUES (${p.barcode}, ${p.name}, ${p.content}, ${p.weight}, ${p.buy_price},
       ${p.margin}, ${p.agent_margin}, ${p.member_margin},
       ${p.sale_price}, ${p.agent_price}, ${p.member_price},
       ${p.profit}, ${p.product_id})
      RETURNING id`)
      .then((data) => {
        callback(data.rows[0].id, null)
      })
      .catch((error) => {
        if (error instanceof UniqueIntegrityConstraintViolationError) {
          console.log('-- Error: ', error.message, '-- name: ', error.name, '-- constraint: ', error.constraint)
          callback(null, {
              id: 0,
              message: error.message
          })
        } else {
          callback(null, error)
        }
      })
    // .catch((err) => {
    //   if (err) {
    //     console.log(err)
    //     return [{
    //       id: 0,
    //       message: err.message
    //     }]
    //   }
    // });

    //if (res && res.rows[0].id === 0) {
    //console.log(res)
    // return res.rows[0];
    //}
    //    console.log(res)

    // if (res.rowCount === 0) {
    //   return null;
    // }

    // return { ...p, id: res.rows[0].id };
  }, deleteUnit: async (id: number, callback: Function) => {
    const res = await db.query<iUnit>(sql`DELETE FROM units WHERE id = ${id} RETURNING id`)
      .then((data) => {
        //return ({data: data, error: null})
        callback(data.rows[0].id, null)
      }).catch((error) => {
        //return ({data: null, error: error})
        callback(null, {
          id: 0,
          message: "No data found"
        }, null);
      });

    // if (res.rowCount === 0) {
    //   return null;
    // }
    // return { id: res.rows[0].id, message: 'success' };
  }
}

export default apiUnit;
