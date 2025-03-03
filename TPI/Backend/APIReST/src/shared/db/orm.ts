import { MikroORM } from '@mikro-orm/mysql';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';
import dotenv from 'dotenv'
import { Institucion } from '../../institucion/institucion.entity.js';
import { Magos } from '../../magos/magos.entity.js';
import { Etiqueta } from '../../etiqueta/etiqueta.entity.js';
import { Hechizo } from '../../hechizo/hechizo.entity.js';
import { Patente } from '../../patente/patente.entity.js';
import { Solicitud } from '../../solicitud_visualizacion/solicitud.entity.js';
import { Tipo_Hechizo } from '../../tipo_hechizo/tipo_hechizo.entity.js';
//Cargo las variables de entorno
const ENV = process.env.NODE_ENV || "development";
dotenv.config({ path: `.env.${ENV}` });

export const orm = MikroORM.initSync({
    entities: [Etiqueta,Hechizo,Institucion,Magos,Patente,Solicitud,Tipo_Hechizo],
    //entitiesTs: ['src/institucion/institicion.entity.ts'],
    dbName: process.env.DB_NAME,
    clientUrl: process.env.DB_URL,
    highlighter: new SqlHighlighter(),
    debug: process.env.NODE_ENV !== 'test',
    schemaGenerator: {
        disableForeignKeys: true,
        createForeignKeyConstraints: true,
        //ignoreSchema:[]
    }
});


export const syncSchema = async () => {
    const generator = orm.getSchemaGenerator();
    /*
    await generator.dropSchema();
    await generator.createSchema();
    */
    await generator.updateSchema();
};

