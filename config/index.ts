// import createConnectionPool, {sql, SQLQuery} from '@databases/pg';
// export {sql, SQLQuery};

// const db = createConnectionPool({bigIntMode: 'bigint'});

// process.once('SIGTERM', () => {
//   db.dispose().catch((ex) => {
//     console.error(ex);
//   });
// });

// export default db;

import {
  sql,
  //  SqlSqlTokenType,
  //  QueryResultRowType,
  createTypeParserPreset,
  createPool,
  TaggedTemplateLiteralInvocationType,
  createTimestampTypeParser,
  createDateTypeParser,
  SqlTaggedTemplateType
} from 'slonik';
import { PrimitiveValueExpressionType } from 'slonik/dist/src/types';
import {
  createFieldNameTransformationInterceptor
} from 'slonik-interceptor-field-name-transformation';
//import { PrimitiveValueExpressionType } from 'slonik/dist/types';
import {
  createQueryNormalisationInterceptor
} from 'slonik-interceptor-query-normalisation';


//console.log(preset);

export { sql };

const db = createPool(process.env.DATABASE_URL || '',
  {
    typeParsers: [ //...createTypeParserPreset()
      {
        name: 'timestamp',
        parse: (value) => value === null ? value : value.replace(' ', 'T')
      }
    ],
    interceptors: [
      createFieldNameTransformationInterceptor({
        format: "CAMEL_CASE"
      }),
      createQueryNormalisationInterceptor({
        stripComments: true
      })
    ]
    //     {
    //         name: 'timestamp',
    //         parse: (value) => {
    //           return value === null ? value : Date.parse(value);
    //         }
    //       }

    // ]

  });
/* bigIntMode: 'bigint',
  applicationName: 'trader',
  poolSize: 10,
  schema: 'public'
});
*/
/*
process.once('SIGTERM', () => {
  db.dispose().catch((ex) => {
    console.error(ex);
  });
});
*/

export function nestQuerySingle(query: TaggedTemplateLiteralInvocationType<Record<string, PrimitiveValueExpressionType>>) {
  return sql`
    (SELECT row_to_json(x) FROM (${query}) x)
  `;
}

export function nestQuery(query: TaggedTemplateLiteralInvocationType<Record<string, PrimitiveValueExpressionType>>) {
  return sql`
    coalesce(
      (
        SELECT array_to_json(array_agg(row_to_json(x)))
        FROM (${query}) x
      ),
      '[]'
    )
  `;
}

export const dateParam = (value: string) => value.replace('T', ' ');

// export const dateParam = (dateObj: s = Date.now()): TaggedTemplateLiteralInvocationType<Record<string, Date | PrimitiveValueExpressionType>> => {
//   return sql`TO_TIMESTAMP(${dateObj.getTime()} / 1000.0)`;
// };


export default db;
