import db, { sql, nestQuery } from '../../../config';
import { iRayon } from '../../../components/interfaces'


type apiRayonReturnType = Promise<any[] | (readonly iRayon[] | undefined)[]>;

interface apiRayonFunction {
  // getRayon(custId: number): apiRayonReturnType;
  // deleteRayon: (id: number) => apiRayonReturnType; // same as above
  // updateRayon(custId: number, p: iRayon): apiRayonReturnType;
  // insertRayon(p: iRayon): apiRayonReturnType;
  getRayons: () => apiRayonReturnType;
  // searchRayons(name: string, limit: number, offset: number): apiRayonReturnType;
  // getRayonsByRayon(rayonId: number): apiRayonReturnType;
}

const apiRayon: apiRayonFunction = {
  getRayons: async () => {
    return await db.query<iRayon>
      (
        sql`SELECT id, name, descriptions, created_at, updated_at
        FROM rayons
        ORDER BY name`
      )
      .then(data => ([data.rows, undefined]))
      .catch(error => ([undefined, error]));
  }
}

export default apiRayon;
