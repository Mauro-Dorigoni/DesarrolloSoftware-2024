import { Router } from "express";
import { upload } from "../shared/multerConfig.js";
import { authMiddleware } from "../auth/auth.controller.js";
import { sanitizePatenteInput, findAll, add, publish, reject, findAllPending, findByMago } from "./patente.controller.js";
export const patenteRouter = Router();
/**
 * @swagger
 * components:
 *  schemas:
 *    Patente:
 *      type: object
 *      required:
 *        - id
 *        - fechaCreacion
 *        - descripcion
 *        - estado
 *        - instrucciones
 *        - hechizos
 *        - tipo_hechizo
 *        - etiquetas
 *        - mago
 *      properties:
 *        id:
 *          type: integer
 *          description: ID autogenerado de la patente.
 *        fechaCreacion:
 *          type: string
 *          format: date-time
 *          description: Fecha de alta de la patente.
 *        nombre:
 *          type: string
 *          description: Nombre asignado a la patente.
 *        descripcion:
 *          type: string
 *          description: Breve descripción de la patente.
 *        estado:
 *          type: string
 *          description: Estado en el que se encuentra actualmente la patente.
 *        motivo_rechazo:
 *          type: string
 *          description: Razón que llevó al rechazo de la patente. Opcional.
 *        instrucciones:
 *          type: string
 *          description: Descripción detallada acerca de cómo se debe efectuar el hechizo.
 *        restringido:
 *          type: boolean
 *          description: Indica si el hechizo está restringido para el solicitante.
 *        imagen:
 *          type: string
 *          description: Imagen descriptiva del hechizo.
 *        hechizos:
 *          type: object
 *          description: Hechizo por el cual se creó la patente.
 *          properties:
 *            nombre:
 *              type: string
 *            descripcion:
 *              type: string
 *            instrucciones:
 *              type: string
 *            restringido:
 *              type: boolean
 *        tipo_hechizo:
 *          type: object
 *          description: Clasificación asignada al hechizo tras aprobación.
 *          properties:
 *            nombre:
 *              type: string
 *            caracteristicas:
 *              type: string
 *        etiquetas:
 *          type: array
 *          description: Colección de etiquetas asignadas al hechizo de la patente.
 *          items:
 *            type: object
 *            properties:
 *              nombre:
 *                type: string
 *                description: Nombre de la etiqueta.
 *              descripcion:
 *                type: string
 *                description: Breve descripción de la etiqueta.
 *        empleado:
 *          type: object
 *          description: Empleado encargado de gestionar la patente.
 *          properties:
 *            id:
 *              type: integer
 *              description: ID autogenerado del empleado.
 *            nombre:
 *              type: string
 *            apellido:
 *              type: string
 *            email:
 *              type: string
 *            profesion:
 *              type: string
 *            madera_varita:
 *              type: string
 *            largo_varita:
 *              type: number
 *            nucleo_varita:
 *              type: string
 *            isEmpleado:
 *              type: boolean
 *            institucion:
 *              type: object
 *              properties:
 *                id:
 *                  type: integer
 *                nombre:
 *                  type: string
 *                ciudad:
 *                  type: string
 *                pais:
 *                  type: string
 *        mago:
 *          type: object
 *          description: Mago solicitante de la patente.
 *          properties:
 *            id:
 *              type: integer
 *              description: ID autogenerado del mago.
 *            nombre:
 *              type: string
 *            apellido:
 *              type: string
 *            email:
 *              type: string
 *            pass:
 *              type: string
 *            profesion:
 *              type: string
 *            madera_varita:
 *              type: string
 *            largo_varita:
 *              type: number
 *            nucleo_varita:
 *              type: string
 *            isEmpleado:
 *              type: boolean
 *            institucion:
 *              type: object
 *              properties:
 *                id:
 *                  type: integer
 *                nombre:
 *                  type: string
 *                ciudad:
 *                  type: string
 *                pais:
 *                  type: string
 *      example:
 *        id: 18
 *        fechaCreacion: "2024-11-17T00:00:00Z"
 *        nombre: "Wingardium Leviosa"
 *        descripcion: "Sin Luz. Hace que los objetos leviten"
 *        estado: "publicada"
 *        instrucciones: "Realiza una curva suave y ascendente hacia la derecha. Luego, lleva la varita hacia abajo en una curva y termina el movimiento con un pequeño giro hacia arriba."
 *        hechizos:
 *          nombre: "Wingardium Leviosa"
 *          descripcion: "Sin Luz. Hace que los objetos leviten."
 *          instrucciones: "[REDACTED]"
 *          restringido: false
 *        tipo_hechizo:
 *          nombre: "Encantamiento"
 *          caracteristicas: "Estos hechizos alteran las propiedades de sus objetivos, como sus comportamientos y propiedades. No alteran la esencia de las propiedades de quien lo sufre, sólo aumentan o cambian sus propiedades."
 *        etiquetas:
 *          - nombre: "Basico"
 *            descripcion: "Estos hechizos son los más fáciles de aprender y ejecutar. Se enseñan en los primeros años en Hogwarts y no requieren mucho poder mágico ni concentración."
 *        empleado:
 *          id: 12
 *          nombre: "Arthur"
 *          apellido: "Weasley"
 *          email: "arthur@weasley.com"
 *          profesion: "Jefe del Departamento del Uso Indebido de la Magia"
 *          madera_varita: "Nogal"
 *          largo_varita: 24
 *          nucleo_varita: "Fibra de Corazon de Dragon"
 *          isEmpleado: true
 *          institucion:
 *            id: 1
 *            nombre: "Hogwarts"
 *            ciudad: "Unknown"
 *            pais: "Scotland"
 *        mago:
 *          id: 6
 *          nombre: "Harry"
 *          apellido: "Potter"
 *          email: "harry@potter.com"
 *          pass: "nadaEsVerdad"
 *          profesion: "Estudiante"
 *          madera_varita: "Acebo"
 *          largo_varita: 28
 *          nucleo_varita: "Pluma de Fenix"
 *          isEmpleado: false
 *          institucion:
 *            id: 1
 *            nombre: "Hogwarts"
 *            ciudad: "Unknown"
 *            pais: "Scotland"
 */
/**
 * @swagger
 * tags:
 *  name: Patente
 *  description: La API que maneja las patentes solicitadas para su  creacion por los magos (usuarios) y revisada por los empleados.
 */
/**
 * @swagger
 * /api/patente:
 *  get:
 *      summary: Devuelve todas las patentes disponibles en la Base de Datos
 *      tags: [Patente]
 *      responses:
 *          200:
 *              description: Found All patentes
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Patente'
 *          500:
 *              description: Error en el Servidor
 *          401:
 *              description: No authenticated user
 */
patenteRouter.get('/', authMiddleware, findAll);
/**
 * @swagger
 * /api/patente/pending:
 *  get:
 *      summary: Devuelve todas las patentes disponibles en la Base de Datos cuyo estado sea <pendiente_revision>
 *      tags: [Patente]
 *      responses:
 *          200:
 *              description: Patentes pending revision found
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Patente'
 *          401:
 *              description: No authenticated user
 *          500:
 *              description: Error en el Servidor
 */
patenteRouter.get('/pending', authMiddleware, findAllPending);
/**
 * @swagger
 * /api/patente/mago:
 *  get:
 *      summary: Devuelve todas las patentes disponibles en la Base de Datos que correspondan al mago loggeado
 *      tags: [Patente]
 *      responses:
 *          200:
 *              description: Mago Patentes found
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Patente'
 *          500:
 *              description: Error en el Servidor
 *          401:
 *              description: No authenticated user
 */
patenteRouter.get('/mago', authMiddleware, findByMago);
/**
 * @swagger
 * /api/patente:
 *   post:
 *      summary: Crea una nueva patente para un hechizo, la cual aun debe ser revisada por un empleado.
 *      tags: [Patente]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *              schema:
 *                  $ref: '#/components/schemas/Patente'
 *      responses:
 *          201:
 *              description: Patente created
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Patente'
 *          401:
 *              description: Not authenticated
 *          500:
 *              description: Error en el servidor
 */
patenteRouter.post('/', authMiddleware, upload.single('imagen'), sanitizePatenteInput, add);
/**
 * @swagger
 * /api/patente/publish/{id}:
 *   put:
 *     summary: Aprueba una solicitud de creacion de patente para un hechizo, cambiando su estado de <pendiente_revision> a <publicada>
 *     tags: [Patente]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: El id de la patente a publicar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Patente'
 *     responses:
 *       200:
 *         description: Patent successfully published
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Patente'
 *       500:
 *         description: There was a problem in publishing the Patente
 *       400:
 *         description: The Patente is not pendig revision
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Patente not found
 */
patenteRouter.put('/publish/:id', authMiddleware, sanitizePatenteInput, publish);
/**
 * @swagger
 * /api/patente/reject/{id}:
 *   put:
 *     summary: Rechaza una solicitud de creacion de patente, cambiando su estado de <pendiente_revision> a <rechazada>
 *     tags: [Patente]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: El id de la patente a rechazar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Patente'
 *     responses:
 *       200:
 *         description: Patente rejected correctly
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Patente'
 *       500:
 *         description: There was a problem in rejecting the Patente
 *       400:
 *         description: The Patente is not pendig revision
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Patente not found
 */
patenteRouter.put('/reject/:id', authMiddleware, sanitizePatenteInput, reject);
//# sourceMappingURL=patente.routes.js.map