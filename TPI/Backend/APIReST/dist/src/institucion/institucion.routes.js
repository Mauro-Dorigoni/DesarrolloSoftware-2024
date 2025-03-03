import { Router } from "express";
import { findAll, findOne, add, update, remove } from "./institucion.controller.js";
export const institucionRouter = Router();
/**
 * @swagger
 * components:
 *  schemas:
 *      Institucion:
 *          type: object
 *          required:
 *              - id
 *              - nombre
 *              - ciudad
 *              - pais
 *          properties:
 *            id:
 *              type: integer
 *              description: ID autogenerado (autoincremental) de la institucion academica en la Base de Datos
 *            nombre:
 *              type: string
 *              description: Nombre de la institucion academica
 *            ciudad:
 *              type: string
 *              description: Ciudad donde se encuentra ubicada la institucion academica
 *            pais:
 *              type: string
 *              description: Pais donde se encuentra ubicada la institucion academica
 *          example:
 *              id: 1
 *              nombre: Hogwarts
 *              ciudad: Unknown
 *              pais: Scotland
 */
/**
 * @swagger
 * tags:
 *   name: Institucion
 *   description: La API que administra las instituciones academicas
 */
/**
 * @swagger
 * /api/institucion:
 *   get:
 *     summary: Devuelve todas las instituciones academicas disponibles en la base de datos
 *     tags: [Institucion]
 *     responses:
 *       200:
 *         description: found all instituciones
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                  $ref: '#/components/schemas/Institucion'
 *       500:
 *          description: Error en el servidor
 */
institucionRouter.get('/', findAll);
/**
 * @swagger
 * /api/institucion/{id}:
 *   get:
 *      summary: Devuelve un una institucion por ID
 *      tags: [Institucion]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *              type: integer
 *          required: true
 *          description: El ID de la institucion
 *      responses:
 *          200:
 *              description: found institucion
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Institucion'
 *
 *          500:
 *              description: Error en el servidor
 */
institucionRouter.get('/:id', findOne);
/**
 * @swagger
 * /api/institucion:
 *   post:
 *      summary: Da de alta una nueva institucion
 *      tags: [Institucion]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *              schema:
 *                  $ref: '#/components/schemas/Institucion'
 *      responses:
 *          201:
 *              description: Institucion created
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Institucion'
 *
 *          500:
 *              description: Error en el servidor
 */
institucionRouter.post('/', add);
/**
 * @swagger
 * /api/institucion/{id}:
 *   put:
 *     summary: Modifica una institucion por ID
 *     tags: [Institucion]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: El ID de la institucion
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Institucion'
 *     responses:
 *       200:
 *         description: Institucion updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Institucion'
 *       500:
 *         description: Error en el servidor
 */
institucionRouter.put('/:id', update);
/**
 * @swagger
 * /api/institucion/{id}:
 *   delete:
 *     summary: Elimina una institucion por ID
 *     tags: [Institucion]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: El ID de la institucion
 *     responses:
 *       200:
 *         description: Institucion removed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Institucion'
 *       500:
 *         description: Error en el servidor
 */
institucionRouter.delete('/:id', remove);
//# sourceMappingURL=institucion.routes.js.map