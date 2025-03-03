import express from "express";
import { login, register, logout, validateSession, updateUser } from "./auth.controller.js";
const router = express.Router();
/**
 * @swagger
 * components:
 *   schemas:
 *     LoginInput:
 *       type: object
 *       required:
 *         - email
 *         - pass
 *       properties:
 *         email:
 *           type: string
 *           description: Email del usuario.
 *         pass:
 *           type: string
 *           description: Contraseña del usuario.
 *       example:
 *         email: "harry@potter.com"
 *         pass: "harry"
 *
 *     RegisterInput:
 *       type: object
 *       required:
 *         - nombre
 *         - apellido
 *         - email
 *         - pass
 *         - profesion
 *         - madera_varita
 *         - largo_varita
 *         - nucleo_varita
 *         - isEmpleado
 *         - institucion
 *       properties:
 *         nombre:
 *           type: string
 *         apellido:
 *           type: string
 *         email:
 *           type: string
 *         pass:
 *           type: string
 *         profesion:
 *           type: string
 *         madera_varita:
 *           type: string
 *         largo_varita:
 *           type: number
 *         nucleo_varita:
 *           type: string
 *         isEmpleado:
 *           type: boolean
 *         institucion:
 *           type: object
 *           properties:
 *             id:
 *               type: number
 *             nombre:
 *               type: string
 *             ciudad:
 *               type: string
 *             pais:
 *               type: string
 *       example:
 *         nombre: "Harry"
 *         apellido: "Potter"
 *         email: "harry@potter.com"
 *         pass: "harry"
 *         profesion: "Estudiante"
 *         madera_varita: "Acebo"
 *         largo_varita: 27
 *         nucleo_varita: "Fénix"
 *         isEmpleado: false
 *         institucion:
 *           id: 1
 *           nombre: "Hogwarts"
 *           ciudad: "Edimburgo"
 *           pais: "Scotland"
 *
 *     AuthResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         user:
 *           $ref: '#/components/schemas/Magos'
 *       example:
 *         message: "found user"
 *         user:
 *           id: 1
 *           nombre: "Harry"
 *           apellido: "Potter"
 *           email: "harry@potter.com"
 *           pass: "harry"
 *           profesion: "Estudiante"
 *           madera_varita: "Acebo"
 *           largo_varita: 27
 *           nucleo_varita: "Fénix"
 *           isEmpleado: false
 *           institucion:
 *             id: 1
 *             nombre: "Hogwarts"
 *             ciudad: "Edimburgo"
 *             pais: "Scotland"
 *
 *     LogoutResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *       example:
 *         message: "Sesión cerrada."
 *
 *     UpdateUserInput:
 *       type: object
 *       properties:
 *         nombre:
 *           type: string
 *         apellido:
 *           type: string
 *         email:
 *           type: string
 *         pass:
 *           type: string
 *         profesion:
 *           type: string
 *         madera_varita:
 *           type: string
 *         largo_varita:
 *           type: number
 *         nucleo_varita:
 *           type: string
 *       example:
 *         nombre: "Harry"
 *         apellido: "Potter"
 *         email: "harry@potter.com"
 *         pass: "harryNueva"
 *         profesion: "Estudiante"
 *         madera_varita: "Acebo"
 *         largo_varita: 27
 *         nucleo_varita: "Fénix"
 */
/**
 * @swagger
 * tags:
 *   name: Autenticacion
 *   description: API para autenticación de usuarios.
 */
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Inicia sesión de un usuario
 *     tags: [Autenticacion]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginInput'
 *     responses:
 *       200:
 *         description: Usuario autenticado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Datos no válidos
 *       401:
 *         description: Credenciales inválidas
 *       500:
 *         description: Error en el servidor
 */
router.post("/login", login);
/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registra un nuevo usuario.
 *     tags: [Autenticacion]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterInput'
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *               example:
 *                 message: "Usuario creado."
 *       409:
 *         description: El usuario ya existe
 *       500:
 *         description: Error en el servidor
 */
router.post("/register", register);
/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Cierra la sesión del usuario
 *     tags: [Autenticacion]
 *     responses:
 *       200:
 *         description: Sesión cerrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LogoutResponse'
 *       500:
 *         description: Error en el servidor
 */
router.post("/logout", logout);
/**
 * @swagger
 * /auth/update:
 *   put:
 *     summary: Actualiza la información del usuario
 *     tags: [Autenticacion]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserInput'
 *     responses:
 *       200:
 *         description: Información actualizada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Datos no válidos
 *       401:
 *         description: No autenticado
 *       500:
 *         description: Error en el servidor
 */
router.put("/update", updateUser);
/**
 * @swagger
 * /auth/validate:
 *   get:
 *     summary: Validar la sesión del usuario
 *     tags: [Autenticacion]
 *     responses:
 *       200:
 *         description: Usuario autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Token no válido
 *       404:
 *         description: user not found
 *       500:
 *         description: Error en el servidor
 */
router.get("/validate", validateSession);
export const authRouter = router;
//# sourceMappingURL=auth.routes.js.map