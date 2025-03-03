import { Router } from "express";
import { findAll, findOne, add, update, remove } from "./tipo_hechizo.controller.js";
export const tipo_hechizoRouter = Router();
/**
 * @swagger
 * components:
 *  schemas:
 *      Tipo_Hechizo:
 *          type: object
 *          required:
 *              - id
 *              - nombre
 *              - caracteristicas
 *              - patentes
 *          properties:
 *            id:
 *              type: integer
 *              description: ID autogenerado (autoincremental) del tipo de hechizo en la Base de Datos.
 *            nombre:
 *              type: string
 *              description: Nombre del tipo de hechizo.
 *            caracteristicas:
 *              type: string
 *              description: Breve descripción del tipo de hechizo.
 *            patentes:
 *              type: array
 *              items:
 *                type: object
 *                properties:
 *                  id:
 *                    type: integer
 *                    description: ID autogenerado de la patente.
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
 *                    description: Estado en el que se encuentra la patente.
 *                  motivo_rechazo:
 *                    type: string
 *                    description: Razón de rechazo de la patente.
 *                  instrucciones:
 *                    type: string
 *                    description: Descripción de cómo se debe efectuar el hechizo.
 *                  restringido:
 *                    type: boolean
 *                    description: Indica si el hechizo está restringido.
 *                  imagen:
 *                    type: string
 *                    description: Imagen del hechizo.
 *                  hechizos:
 *                    type: object
 *                    description: Hechizo por el cual se creó la patente.
 *                    properties:
 *                      id:
 *                        type: integer
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
 *                      id:
 *                        type: integer
 *                      nombre:
 *                        type: string
 *                      caracteristicas:
 *                        type: string
 *                  etiquetas:
 *                    type: object
 *                    description: Etiquetas del hechizo de la patente.
 *                    properties:
 *                      id:
 *                        type: integer
 *                        description: ID autogenerado del hechizo.
 *                      nombre:
 *                        type: string
 *                        description: Nombre de la etiqueta.
 *                      descripcion:
 *                        type: string
 *                        description: Breve descripción de la etiqueta.
 *                  empleado:
 *                    type: object
 *                    description: Empleado encargado de la patente.
 *                    properties:
 *                      id:
 *                        type: integer
 *                        description: ID autogenerado del empleado.
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
 *            id: 1
 *            nombre: Encantamiento
 *            caracteristicas: Estos hechizos alteran las propiedades de sus objetivos, como sus comportamientos y propiedades. No alteran la esencia de las propiedades de quien lo sufre, sólo aumentan o cambian sus propiedades.
 */
/**
 * @swagger
 * tags:
 *  name: Tipo_Hechizo
 *  description: La API que maneja los tipos de hechizos asignados a los hechizos.
 */
/**
 * @swagger
 * /api/tipo_hechizo:
 *   get:
 *     summary: Devuelve todos los tipos de hechizos disponibles en la Base de Datos.
 *     tags: [Tipo_Hechizo]
 *     responses:
 *       200:
 *          description: found all tipos hechizos
 *          content:
 *             application/json:
 *               schema:
 *                  type: array
 *                  items:
 *                     $ref: '#/components/schemas/Tipo_Hechizo'
 *       500:
 *          description: Error en el servidor
 */
tipo_hechizoRouter.get('/', findAll);
/**
 * @swagger
 * /api/tipo_hechizo/{id}:
 *   get:
 *      summary: Devuelve un tipo de hechizo por su ID
 *      tags: [Tipo_Hechizo]
 *      parameters:
 *         - in: path
 *           name: id
 *           schema:
 *              type: integer
 *           required: true
 *           description: El ID del tipo de hechizo
 *      responses:
 *          200:
 *              description: found tipo hechizo
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Tipo_Hechizo'
 *          500:
 *              description: Error en el servidor
 */
tipo_hechizoRouter.get('/:id', findOne);
/**
 * @swagger
 * /api/tipo_hechizo:
 *   post:
 *      summary: Crear un nuevo tipo de hechizo
 *      tags: [Tipo_Hechizo]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *              schema:
 *                  $ref: '#/components/schemas/Tipo_Hechizo'
 *      responses:
 *          201:
 *              description: Tipo hechizo created
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Tipo_Hechizo'
 *
 *          500:
 *              description: Error en el servidor
 */
tipo_hechizoRouter.post('/', add);
/**
 * @swagger
 * /api/tipo_hechizo/{id}:
 *   put:
 *     summary: Modifica un tipo de hechizo por su ID
 *     tags: [Tipo_Hechizo]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: El ID del tipo de hechizo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Tipo_Hechizo'
 *     responses:
 *       200:
 *         description: Tipo hechizo updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tipo_Hechizo'
 *       500:
 *         description: Error en el servidor
 */
tipo_hechizoRouter.put('/:id', update);
/**
 * @swagger
 * /api/tipo_hechizo/{id}:
 *   delete:
 *     summary: Elimina un tipo de hechizo por su ID
 *     tags: [Tipo_Hechizo]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: El ID del tipo de hechizo
 *     responses:
 *       200:
 *         description: Tipo de hechizo removed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tipo_Hechizo'
 *       500:
 *         description: Error en el servidor
 */
tipo_hechizoRouter.delete('/:id', remove);
//# sourceMappingURL=tipo_hechizo.routes.js.map