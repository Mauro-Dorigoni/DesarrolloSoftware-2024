import { Router } from "express";
import { findAll, findOne, add, update, remove, sanitizeMagoInput } from "./magos.controller.js";
export const magosRouter = Router();
/**
 * @swagger
 * components:
 *  schemas:
 *      Magos:
 *          type: object
 *          required:
 *              - id
 *              - nombre
 *              - apellido
 *              - email
 *              - pass
 *              - profesion
 *              - madera_varita
 *              - largo_varita
 *              - nucleo_varita
 *              - isEmpleado
 *              - institucion
 *          properties:
 *            id:
 *              type: integer
 *              description: ID autogenerado (autoincremental) del mago en Base de Datos
 *            nombre:
 *              type: string
 *              description: Nombre del mago
 *            apellido:
 *              type: string
 *              description: Apellido del mago
 *            email:
 *              type: string
 *              description: email del mago
 *            pass:
 *              type: string
 *              description: password del mago
 *            profesion:
 *              type: string
 *              description: empleo o profesion a la que se dedica el mago
 *            madera_varita:
 *              type: string
 *              description: madera de la que esta hecha la varita del mago
 *            largo_varita:
 *              type: number
 *              description: largo de la varita del mago
 *            nucleo_varita:
 *              type: string
 *              description: nucleo de la varita del mago
 *            isEmpleado:
 *              type: boolean
 *              description: determina si el mago es empleado o no
 *            institucion:
 *              type: object
 *              properties:
 *                 id:
 *                  type: integer
 *                  description: ID autogenerado (autoincremental) de la institucion academica en la Base de Datos
 *                 nombre:
 *                  type: string
 *                  description: Nombre de la institucion academica
 *                 ciudad:
 *                  type: string
 *                  description: Ciudad donde se encuentra ubicada la institucion academica
 *                 pais:
 *                  type: string
 *                  description: Pais donde se encuentra ubicada la institucion academica
 *          example:
 *              id: 1
 *              nombre: Ejemplo
 *              apellido: Ejemplo
 *              email: ejemplo@ejemplo.com
 *              pass: EstoNoEsVerdad
 *              profesion: Ejemplo
 *              madera_varita: Ejemplo
 *              largo_varita: 23
 *              nucleo_varita: Ejemplo
 *              isEmpleado: true
 *              institucion:
 *                  id: 1
 *                  nombre: Hogwarts
 *                  ciudad: Unknown
 *                  pais: Scotland
 */
/**
 * @swagger
 * tags:
 *  name: Magos
 *  description: La API que maneja los Magos (usuarios, empleados y admin) del sistema
 */
/**
 * @swagger
 * /api/magos:
 *   get:
 *     summary: Devuelve todos los magos disponibles en la Base de Datos
 *     tags: [Magos]
 *     responses:
 *       200:
 *         description: found all magos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                  $ref: '#/components/schemas/Magos'
 *       500:
 *          description: Error en el servidor
 */
magosRouter.get('/', findAll);
/**
 * @swagger
 * /api/magos/{id}:
 *   get:
 *      summary: Devuelve un un mago por su ID
 *      tags: [Magos]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *              type: integer
 *          required: true
 *          description: El ID del mago
 *      responses:
 *          200:
 *              description: found mago
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Magos'
 *
 *          500:
 *              description: Error en el servidor
 */
magosRouter.get('/:id', findOne);
/**
 * @swagger
 * /api/magos:
 *   post:
 *      summary: Da de alta un nuevo mago
 *      tags: [Magos]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *              schema:
 *                  $ref: '#/components/schemas/Magos'
 *      responses:
 *          201:
 *              description: Mago created
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Magos'
 *
 *          500:
 *              description: Error en el servidor
 */
magosRouter.post('/', sanitizeMagoInput, add);
/**
 * @swagger
 * /api/magos/{id}:
 *   put:
 *     summary: Modifica un Mago por su ID
 *     tags: [Magos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: El ID del Mago
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Magos'
 *     responses:
 *       200:
 *         description: mago updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Magos'
 *       500:
 *         description: Error en el servidor
 *       400:
 *         description: El correo electrónico ya está en uso.
 */
magosRouter.put('/:id', sanitizeMagoInput, update);
/**
 * @swagger
 * /api/magos/{id}:
 *   put:
 *     summary: Modifica un Mago por su ID
 *     tags: [Magos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: El ID del Mago
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Magos'
 *     responses:
 *       200:
 *         description: mago updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Magos'
 *       500:
 *         description: Error en el servidor
 *       400:
 *         description: El correo electrónico ya está en uso.
 */
magosRouter.patch('/:id', sanitizeMagoInput, update);
/**
 * @swagger
 * /api/magos/{id}:
 *   delete:
 *     summary: Elimina un mago por su ID
 *     tags: [Magos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: El ID del Mago
 *     responses:
 *       200:
 *         description: Mago removed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Magos'
 *       500:
 *         description: Error en el servidor
 */
magosRouter.delete('/:id', remove);
//# sourceMappingURL=magos.routes.js.map