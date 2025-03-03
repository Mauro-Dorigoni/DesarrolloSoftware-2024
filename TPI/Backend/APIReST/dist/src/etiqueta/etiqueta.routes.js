import { Router } from "express";
import { findAll, findOne, add, update, remove } from "./etiqueta.controller.js";
export const etiquetaRouter = Router();
/**
 * @swagger
 * components:
 *  schemas:
 *      Etiqueta:
 *          type: object
 *          required:
 *            - id
 *            - nombre
 *            - descripcion
 *            - patentes
 *          properties:
 *            id:
 *              type: integer
 *              description: ID autogenerado (autoincremental) de la etiqueta en Base de Datos.
 *            nombre:
 *              type: string
 *              description: Nombre de la etiqueta.
 *            descripcion:
 *              type: string
 *              description: Breve descripción de la etiqueta.
 *            patentes:
 *              type: array
 *              items:
 *                type: object
 *                properties:
 *                  fechaCreacion:
 *                    type: string
 *                    format: date-time
 *                    description: Fecha de alta de patente.
 *                  nombre:
 *                    type: string
 *                    description: Nombre asignado a la patente.
 *                  descripcion:
 *                    type: string
 *                    description: Breve descripción de la patente.
 *                  estado:
 *                    type: string
 *                    description: Estado en el que se encuentra actualmente la patente.
 *                  motivo_rechazo:
 *                    type: string
 *                    description: Razón que llevó al rechazo de la patente.
 *                  instrucciones:
 *                    type: string
 *                    description: Descripción detallada acerca de cómo se debe efectuar el hechizo.
 *                  restringido:
 *                    type: boolean
 *                    description: Indica si el hechizo está restringido para el solicitante.
 *                  imagen:
 *                    type: string
 *                    description: Imagen descriptiva del hechizo.
 *                  hechizos:
 *                    type: object
 *                    description: Hechizo por el cual se creó la patente.
 *                    properties:
 *                      nombre:
 *                        type: string
 *                      descripcion:
 *                        type: string
 *                      instrucciones:
 *                        type: string
 *                      restringido:
 *                        type: boolean
 *                  tipo_hechizo:
 *                    type: object
 *                    description: Clasificación asignada al hechizo tras aprobación.
 *                    properties:
 *                      nombre:
 *                        type: string
 *                      caracteristicas:
 *                        type: string
 *                  etiquetas:
 *                    type: object
 *                    description: Colección de etiquetas asignadas al hechizo de la patente.
 *                    properties:
 *                      nombre:
 *                        type: string
 *                        description: Nombre de la etiqueta.
 *                      descripcion:
 *                        type: string
 *                        description: Breve descripción de la etiqueta.
 *                  empleado:
 *                    type: object
 *                    description: Empleado encargado de gestionar la patente.
 *                    properties:
 *                      id:
 *                        type: integer
 *                        description: ID autogenerado del mago.
 *                      nombre:
 *                        type: string
 *                      apellido:
 *                        type: string
 *                      email:
 *                        type: string
 *                      profesion:
 *                        type: string
 *                  mago:
 *                    type: object
 *                    description: Mago solicitante de la patente.
 *                    properties:
 *                      id:
 *                        type: integer
 *                        description: ID autogenerado del mago.
 *                      nombre:
 *                        type: string
 *                      apellido:
 *                        type: string
 *                      email:
 *                        type: string
 *                      profesion:
 *                        type: string
 *          example:
 *            id: 4
 *            nombre: Basico
 *            descripcion: Estos hechizos son los más fáciles de aprender y ejecutar. Se enseñan en los primeros años en Hogwarts y no requieren mucho poder mágico ni concentración.
 */
/**
 * @swagger
 * tags:
 *  name: Etiqueta
 *  description: La API que maneja las etiquetas asignadas a los hechizos solicitados en las patentes.
 */
/**
 * @swagger
 * /api/etiqueta:
 *   get:
 *     summary: Devuelve todas las etiquetas disponibles en la Base de Datos
 *     tags: [Etiqueta]
 *     responses:
 *       200:
 *         description: found all etiquetas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                  $ref: '#/components/schemas/Etiqueta'
 *       500:
 *          description: Error en el servidor
 */
etiquetaRouter.get('/', findAll);
/**
 * @swagger
 * /api/etiqueta/{id}:
 *   get:
 *      summary: Devuelve una etiqueta por su ID
 *      tags: [Etiqueta]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *              type: integer
 *          required: true
 *          description: El ID de la etiqueta
 *      responses:
 *          200:
 *              description: found etiqueta
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Etiqueta'
 *
 *          500:
 *              description: Error en el servidor
 */
etiquetaRouter.get('/:id', findOne);
/**
 * @swagger
 * /api/etiqueta:
 *   post:
 *      summary: Da de alta una nueva etiqueta
 *      tags: [Etiqueta]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *              schema:
 *                  $ref: '#/components/schemas/Etiqueta'
 *      responses:
 *          201:
 *              description: Etiqueta created
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Etiqueta'
 *
 *          500:
 *              description: Error en el servidor
 */
etiquetaRouter.post('/', add);
/**
 * @swagger
 * /api/etiqueta/{id}:
 *   put:
 *     summary: Modifica una etiqueta por su ID
 *     tags: [Etiqueta]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: El ID de la etiqueta
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Etiqueta'
 *     responses:
 *       200:
 *         description: etiqueta updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Etiqueta'
 *       500:
 *         description: Error en el servidor
 */
etiquetaRouter.put('/:id', update);
/**
 * @swagger
 * /api/etiqueta/{id}:
 *   put:
 *     summary: Modifica una etiqueta por su ID
 *     tags: [Etiqueta]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: El ID de la etiqueta
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Etiqueta'
 *     responses:
 *       200:
 *         description: etiqueta updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Etiqueta'
 *       500:
 *         description: Error en el servidor
 */
etiquetaRouter.patch('/:id', update);
/**
 * @swagger
 * /api/etiqueta/{id}:
 *   delete:
 *     summary: Elimina una etiqueta por su ID
 *     tags: [Etiqueta]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: El ID de la etiqueta
 *     responses:
 *       200:
 *         description: Etiqueta removed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Etiqueta'
 *       500:
 *         description: Error en el servidor
 */
etiquetaRouter.delete('/:id', remove);
//# sourceMappingURL=etiqueta.routes.js.map