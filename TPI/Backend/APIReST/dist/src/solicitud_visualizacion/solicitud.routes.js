import { Router } from "express";
import { authMiddleware } from "../auth/auth.controller.js";
import { findAll, findAllPending, findByMago, add, grant, reject, sanitizeSolicitudInput } from "./solicitud.controller.js";
export const solicitudRouter = Router();
/**
 * @swagger
 * components:
 *   schemas:
 *     Solicitud:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         fecha_hasta:
 *           type: string
 *           format: date-time
 *         permanente:
 *           type: boolean
 *         motivo:
 *           type: string
 *         motivo_rechazo:
 *           type: string
 *         estado:
 *           type: string
 *         hechizo:
 *           type: object
 *           properties:
 *              id:
 *                  type: integer
 *                  description: ID autogenerado de la solicitud
 *              nombre:
 *                  type: string
 *                  description: nombre del hechizo
 *              descripcion:
 *                  type: string
 *                  description: descripcion del hechizo
 *              instrucciones:
 *                  type: string
 *                  description: instrucciones sobre como llevar a cabo el hechizo
 *              restringido:
 *                  type: boolean
 *                  description: indica si el hechizo esta tiene sus instrucciones restringidas para visualizacion
 *              patente:
 *                  type: object
 *                  description: patente que dio origen al hechizo (inconsecuente para la solicitud)
 *         mago:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *               description: ID autogenerado del mago
 *             nombre:
 *               type: string
 *             apellido:
 *               type: string
 *             email:
 *               type: string
 *             pass:
 *               type: string
 *             profesion:
 *               type: string
 *             madera_varita:
 *               type: string
 *             largo_varita:
 *               type: number
 *             nucleo_varita:
 *               type: string
 *             isEmpleado:
 *               type: boolean
 *             institucion:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 nombre:
 *                   type: string
 *                 ciudad:
 *                   type: string
 *                 pais:
 *                   type: string
 *         empleado:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *               description: ID autogenerado del mago
 *             nombre:
 *               type: string
 *             apellido:
 *               type: string
 *             email:
 *               type: string
 *             pass:
 *               type: string
 *             profesion:
 *               type: string
 *             madera_varita:
 *               type: string
 *             largo_varita:
 *               type: number
 *             nucleo_varita:
 *               type: string
 *             isEmpleado:
 *               type: boolean
 *             institucion:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 nombre:
 *                   type: string
 *                 ciudad:
 *                   type: string
 *                 pais:
 *                   type: string
 *       required:
 *         - id
 *         - permanente
 *         - motivo
 *         - hechizo
 *         - mago
 *       example:
 *         id: 1
 *         fecha_hasta: "2025-02-18T14:30:00Z"
 *         permanente: false
 *         motivo: "Quiero estudiar los efectos"
 *         estado: "aprobada"
 *         hechizo:
 *           id: 1
 *           nombre: "Sectumsempra"
 *           descripcion: "Hechizo que hace mal"
 *           instrucciones: "[REDACTED]"
 *           restringido: true
 *           patente: []
 *         mago:
 *           id: 1
 *           nombre: "Ejemplo"
 *           apellido: "Ejemplo"
 *           email: "ejemplo@ejemplo.com"
 *           pass: "EstoNoEsVerdad"
 *           profesion: "Ejemplo"
 *           madera_varita: "Ejemplo"
 *           largo_varita: 23
 *           nucleo_varita: "Ejemplo"
 *           isEmpleado: false
 *           institucion:
 *             id: 1
 *             nombre: "Hogwarts"
 *             ciudad: "Unknown"
 *             pais: "Scotland"
 *         empleado:
 *           id: 2
 *           nombre: "Amelia"
 *           apellido: "Bones"
 *           email: "amelia@bones.com"
 *           pass: "EstoNoEsVerdadDeVuelta"
 *           profesion: "Jefa del departamento de seguridad Magica"
 *           madera_varita: "Nogal"
 *           largo_varita: 23
 *           nucleo_varita: "Fibra de Corazon de Dragon"
 *           isEmpleado: false
 *           institucion:
 *             id: 1
 *             nombre: "Hogwarts"
 *             ciudad: "Unknown"
 *             pais: "Scotland"
 */
/**
 * @swagger
 * tags:
 *  name: Solicitud
 *  description: La API que maneja las Solicitudes de Visualizacion de hechizos restringidos, realizadas por los magos (usuarios) y revisada por los empleados.
 */
/**
 * @swagger
 * /api/solicitud_visualizacion:
 *  get:
 *      summary: Devuelve todas las solicitudes de visualizacion disponibles en la Base de Datos
 *      tags: [Solicitud]
 *      responses:
 *          200:
 *              description: Found All Solicitudes
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Solicitud'
 *          500:
 *              description: Error en el Servidor
 *          401:
 *              description: No authenticated user
 */
solicitudRouter.get('/', authMiddleware, findAll);
/**
 * @swagger
 * /api/solicitud_visualizacion/pending:
 *  get:
 *      summary: Devuelve todas las solicitudes de visualizacion disponibles en la Base de Datos cuyo estado sea <pendiente_revision>
 *      tags: [Solicitud]
 *      responses:
 *          200:
 *              description: Solicitudes pending revision found
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Solicitud'
 *          401:
 *              description: No authenticated user
 *          500:
 *              description: Error en el Servidor
 */
solicitudRouter.get('/pending', authMiddleware, findAllPending);
/**
 * @swagger
 * /api/solicitud_visualizacion/mago:
 *  get:
 *      summary: Devuelve todas las solicitudes de visualizacion disponibles en la Base de Datos que correspondan al mago loggeado
 *      tags: [Solicitud]
 *      responses:
 *          200:
 *              description: Mago Solicitudes found
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Solicitud'
 *          500:
 *              description: Error en el Servidor
 *          401:
 *              description: No authenticated user
 */
solicitudRouter.get('/mago', authMiddleware, findByMago);
/**
 * @swagger
 * /api/solicitud_visualizacion:
 *   post:
 *      summary: Da de alta una nueva Solicitud de visualizacion de hechizo
 *      tags: [Solicitud]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *              schema:
 *                  $ref: '#/components/schemas/Solicitud'
 *      responses:
 *          201:
 *              description: Solicitud created
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Solicitud'
 *          401:
 *              description: Not authenticated
 *          404:
 *              description: Hechizo not found
 *
 *          500:
 *              description: Error en el servidor
 */
solicitudRouter.post('/', authMiddleware, sanitizeSolicitudInput, add);
/**
 * @swagger
 * /api/solicitud_visualizacion/grant/{id}:
 *   put:
 *     summary: Otorga una solicitud de visualizacion de hechizo, cambiando su estado de <pendiente_revision> a <aprobada>
 *     tags: [Solicitud]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: El ID de la solicitud a aprobar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Solicitud'
 *     responses:
 *       200:
 *         description: Solicitud granted correctly
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Solicitud'
 *       500:
 *         description: There was a problem in granting the Solicitud
 *       400:
 *         description: The Solicitud is not pendig revision
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Solicitud not found
 */
solicitudRouter.put('/grant/:id', authMiddleware, sanitizeSolicitudInput, grant);
/**
 * @swagger
 * /api/solicitud_visualizacion/reject/{id}:
 *   put:
 *     summary: Rechaza una solicitud de visualizacion de hechizo, cambiando su estado de <pendiente_revision> a <rechazada>
 *     tags: [Solicitud]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: El ID de la solicitud a rechazar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Solicitud'
 *     responses:
 *       200:
 *         description: Solicitud rejected correctly
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Solicitud'
 *       500:
 *         description: There was a problem in rejecting the Solicitud
 *       400:
 *         description: The Solicitud is not pendig revision
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Solicitud not found
 */
solicitudRouter.put('/reject/:id', authMiddleware, sanitizeSolicitudInput, reject);
//# sourceMappingURL=solicitud.routes.js.map