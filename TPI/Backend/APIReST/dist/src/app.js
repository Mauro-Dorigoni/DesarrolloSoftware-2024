import 'reflect-metadata';
import express from 'express';
import { orm, syncSchema } from './shared/db/orm.js';
import { RequestContext } from '@mikro-orm/core';
import { magosRouter } from './magos/magos.routes.js';
import { institucionRouter } from './institucion/institucion.routes.js';
import { etiquetaRouter } from './etiqueta/etiqueta.routes.js';
import { hechizoRouter } from './hechizo/hechizo.routes.js';
import { patenteRouter } from './patente/patente.routes.js';
import { solicitudRouter } from './solicitud_visualizacion/solicitud.routes.js';
import { tipo_hechizoRouter } from './tipo_hechizo/tipo_hechizo.routes.js';
import { authRouter } from './auth/auth.routes.js';
import cors from 'cors';
import cookieParser from "cookie-parser";
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import swaggerUI from 'swagger-ui-express';
import specs from './documentacion/documentacion.js';
//Cargo las variables de entorno
const ENV = process.env.NODE_ENV || 'development'; //Descomentar para uso en desarrollo
//const ENV = process.env.NODE_ENV || 'production'; //Descomentar para uso en production
dotenv.config({ path: `.env.${ENV}` });
//dotenv.config();
// Leer orígenes desde el archivo .env separados por ','
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [];
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
//Middleware
app.use(cors({
    //comentar las proximas 2 lineas para prod
    origin: process.env.FRONTEND_URL, // Permitir solo solicitudes desde este origen
    credentials: true, // Permitir el envío de cookies, si es necesario*/
    //Descomentar las proximas lineas para prod
    // origin: (origin, callback) => {
    //   if (!origin || origin.endsWith(".vercel.app")) { // Esta linea permite cualquier subdominio y rutas de Vercel
    //     callback(null, true);
    //   } else {
    //     callback(new Error("CORS no permitido para este origen"));
    //   }
    // },
    //methods: "GET,POST,PUT,DELETE", // Métodos permitidos
    //credentials: true,
    //allowedHeaders: ["Content-Type", "Authorization"], // Cabeceras permitidas
}));
app.use(express.json());
app.use(cookieParser());
app.use((req, res, next) => {
    RequestContext.create(orm.em, next);
});
app.use('/api/institucion', institucionRouter);
app.use('/api/magos', magosRouter);
app.use('/api/etiqueta', etiquetaRouter);
app.use('/api/hechizo', hechizoRouter);
app.use('/api/patente', patenteRouter);
app.use('/api/solicitud_visualizacion', solicitudRouter);
app.use('/api/tipo_hechizo', tipo_hechizoRouter);
app.use('/api/auth', authRouter);
//Ruta de la documentacion de la api
app.use('/api/docs', swaggerUI.serve, swaggerUI.setup(specs));
//Ruta de subida de imagenes de la api
const uploadsPath = path.join(__dirname, '../public/uploads');
app.use('/uploads', express.static(uploadsPath));
/*
    El siguiente metodo se encarga de devolver un mensaje compatible
    con la API cuando se introduce una URL invalida, y no contenido HTML
*/
app.use((_, res) => {
    return res.status(404).send({ message: 'Resource not found' });
});
await syncSchema(); //solo en development
export { app };
//# sourceMappingURL=app.js.map