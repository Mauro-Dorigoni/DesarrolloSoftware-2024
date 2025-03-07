import { Router } from "express";
import { findAll, findOne, getAvailableForVisualizacion, findPermitedForUser } from "./hechizo.controller.js";
import { authMiddleware } from "../auth/auth.controller.js";

export const hechizoRouter = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Hechizo:
 *       type: object
 *       required:
 *         - id
 *         - nombre
 *         - descripcion
 *         - instrucciones
 *         - restringido
 *         - patente
 *         - solicitudes
 *       properties:
 *         id:
 *           type: integer
 *           description: ID autogenerado del hechizo.
 *         nombre:
 *           type: string
 *           description: Nombre del hechizo.
 *         descripcion:
 *           type: string
 *           description: Breve descripción del hechizo.
 *         instrucciones:
 *           type: string
 *           description: Instrucciones para realizar el hechizo.
 *         restringido:
 *           type: boolean
 *           description: Indica si el hechizo está restringido.
 *         patente:
 *           type: object
 *           description: Información de la patente asociada al hechizo.
 *           properties:
 *             id:
 *               type: integer
 *               description: ID autogenerado de la patente.
 *             fechaCreacion:
 *               type: string
 *               format: date-time
 *               description: Fecha de creación de la patente.
 *             nombre:
 *               type: string
 *               description: Nombre de la patente.
 *             descripcion:
 *               type: string
 *               description: Breve descripción de la patente.
 *             estado:
 *               type: string
 *               description: Estado actual de la patente.
 *             motivo_rechazo:
 *               type: string
 *               description: Razón por la cual se rechazó la patente (opcional).
 *             instrucciones:
 *               type: string
 *               description: Instrucciones de la patente.
 *             restringido:
 *               type: boolean
 *               description: Indica si la patente es restringida.
 *             imagen:
 *               type: string
 *               description: URL de la imagen de la patente.
 *             hechizos:
 *               type: array
 *               description: Lista de hechizos asociados a la patente.
 *               items:
 *                 $ref: '#/components/schemas/Hechizo'
 *             tipo_hechizo:
 *               type: object
 *               description: Clasificación asignada a la patente.
 *               properties:
 *                 id:
 *                   type: integer
 *                 nombre:
 *                   type: string
 *                 caracteristicas:
 *                   type: string
 *             etiquetas:
 *               type: array
 *               description: Etiquetas asignadas a la patente.
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   nombre:
 *                     type: string
 *                     description: Nombre de la etiqueta.
 *                   descripcion:
 *                     type: string
 *                     description: Breve descripción de la etiqueta.
 *             empleado:
 *               type: object
 *               description: Empleado encargado de la patente.
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: ID autogenerado del empleado.
 *                 nombre:
 *                   type: string
 *                 apellido:
 *                   type: string
 *                 email:
 *                   type: string
 *                 profesion:
 *                   type: string
 *                 madera_varita:
 *                   type: string
 *                 largo_varita:
 *                   type: number
 *                 nucleo_varita:
 *                   type: string
 *                 isEmpleado:
 *                   type: boolean
 *                 institucion:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     nombre:
 *                       type: string
 *                     ciudad:
 *                       type: string
 *                     pais:
 *                       type: string
 *             mago:
 *               type: object
 *               description: Mago solicitante de la patente.
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: ID autogenerado del mago.
 *                 nombre:
 *                   type: string
 *                 apellido:
 *                   type: string
 *                 email:
 *                   type: string
 *                 profesion:
 *                   type: string
 *                 madera_varita:
 *                   type: string
 *                 largo_varita:
 *                   type: number
 *                 nucleo_varita:
 *                   type: string
 *                 isEmpleado:
 *                   type: boolean
 *                 institucion:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     nombre:
 *                       type: string
 *                     ciudad:
 *                       type: string
 *                     pais:
 *                       type: string
 *         solicitudes:
 *           type: array
 *           description: Lista de solicitudes asociadas al hechizo.
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: ID autogenerado de la solicitud.
 *               fecha_hasta:
 *                 type: string
 *                 format: date-time
 *                 description: Fecha hasta la que es válida la solicitud.
 *               permanente:
 *                 type: boolean
 *                 description: Indica si la solicitud es permanente.
 *               motivo:
 *                 type: string
 *                 description: Motivo de la solicitud.
 *               motivo_rechazo:
 *                 type: string
 *                 description: Razón del rechazo de la solicitud (si aplica).
 *               estado:
 *                 type: string
 *                 description: Estado de la solicitud.
 *               mago:
 *                 type: object
 *                 description: Mago solicitante del permiso.
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: ID autogenerado del mago.
 *                   nombre:
 *                     type: string
 *                   apellido:
 *                     type: string
 *                   email:
 *                     type: string
 *                   profesion:
 *                     type: string
 *                   madera_varita:
 *                     type: string
 *                   largo_varita:
 *                     type: number
 *                   nucleo_varita:
 *                     type: string
 *                   isEmpleado:
 *                     type: boolean
 *                   institucion:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       nombre:
 *                         type: string
 *                       ciudad:
 *                         type: string
 *                       pais:
 *                         type: string
 *               empleado:
 *                 type: object
 *                 description: Empleado encargado de la solicitud.
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: ID autogenerado del empleado.
 *                   nombre:
 *                     type: string
 *                   apellido:
 *                     type: string
 *                   email:
 *                     type: string
 *                   profesion:
 *                     type: string
 *                   madera_varita:
 *                     type: string
 *                   largo_varita:
 *                     type: number
 *                   nucleo_varita:
 *                     type: string
 *                   isEmpleado:
 *                     type: boolean
 *                   institucion:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       nombre:
 *                         type: string
 *                       ciudad:
 *                         type: string
 *                       pais:
 *                         type: string
 *       example:
 *         id: 1
 *         nombre: "Finitem Incantatem"
 *         descripcion: "Luz Roja. Cesa todos los efectos de los hechizos."
 *         instrucciones: "El movimiento de la varita es rápido y preciso, dibujando una forma de escudo."
 *         restringido: false
 *         patente:
 *           id: 100
 *           fechaCreacion: "2023-01-01T12:00:00Z"
 *           nombre: "Patente Finitem Incantatem"
 *           descripcion: "Patente para el hechizo Finitem Incantatem"
 *           estado: "aprobada"
 *           motivo_rechazo: ""
 *           instrucciones: "Realizar el movimiento indicado"
 *           restringido: false
 *           imagen: "http://example.com/imagen.jpg"
 *           hechizos: []
 *           tipo_hechizo:
 *             id: 10
 *             nombre: "Contrahechizo"
 *             caracteristicas: "Inhibición o finalización del efecto de otro hechizo."
 *           etiquetas: []
 *           empleado:
 *             id: 1
 *             nombre: "Ejemplo"
 *             apellido: "Ejemplo"
 *             email: "ejemplo@ejemplo.com"
 *             profesion: "Encargado"
 *             madera_varita: "Roble"
 *             largo_varita: 25
 *             nucleo_varita: "Dragón"
 *             isEmpleado: true
 *             institucion:
 *               id: 1
 *               nombre: "Hogwarts"
 *               ciudad: "Edimburgo"
 *               pais: "Scotland"
 *           mago:
 *             id: 2
 *             nombre: "Harry"
 *             apellido: "Potter"
 *             email: "harry@potter.com"
 *             profesion: "Estudiante"
 *             madera_varita: "Acebo"
 *             largo_varita: 27
 *             nucleo_varita: "Fénix"
 *             isEmpleado: false
 *             institucion:
 *               id: 1
 *               nombre: "Hogwarts"
 *               ciudad: "Edimburgo"
 *               pais: "Scotland"
 *         solicitudes: []
 */

/**
 * @swagger
 * tags:
 *   name: Hechizo
 *   description: La API que maneja los hechizos del sistema.
 */

/**
 * @swagger
 * /api/hechizo/all:
 *   get:
 *     summary: Todos los hechizos disponibles en la Base de Datos
 *     tags: [Hechizo]
 *     responses:
 *       200:
 *         description: found all hechizos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Hechizo'
 *       500:
 *         description: Error en el servidor
 */
hechizoRouter.get('/all', authMiddleware, findAll);

/**
 * @swagger
 * /api/hechizo/visualizacion:
 *   get:
 *     summary: Hechizos disponibles para solicitar permiso de visualización para un usuario
 *     tags: [Hechizo]
 *     responses:
 *       200:
 *         description: found all hechizos para solicitar permiso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Hechizo'
 *       500:
 *         description: Error en el servidor.
 */
hechizoRouter.get('/visualizacion', authMiddleware, getAvailableForVisualizacion);

/**
 * @swagger
 * /api/hechizo/permitidos:
 *   get:
 *     summary: Hechizos permitidos para un usuario
 *     tags: [Hechizo]
 *     responses:
 *       200:
 *         description: found all hechizos permitidos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Hechizo'
 *       500:
 *         description: Error en el servidor
 */
hechizoRouter.get('/permitidos', authMiddleware, findPermitedForUser);

/**
 * @swagger
 * /api/hechizo/{id}:
 *   get:
 *     summary: Obtiene un hechizo por su ID.
 *     tags: [Hechizo]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del hechizo.
 *     responses:
 *       200:
 *         description: found hechizo
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Hechizo'
 *       500:
 *         description: Error en el servidor
 */
hechizoRouter.get('/:id',authMiddleware, findOne);
