import { Request, Response, NextFunction } from "express";
import { orm } from "../shared/db/orm.js";
import bcrypt from "bcrypt";
import { Magos } from "../magos/magos.entity.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { body, validationResult } from "express-validator";
import { AuthRequest } from "../shared/types.js";

dotenv.config();

//genera un token con el ID del usuario
//protegí el token con variables de entorno
const generateToken = (userId: number) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET!, { expiresIn: '1h' });
};

export const register = async (req: Request, res: Response) => {
  const em = orm.em.fork();
  try {
    //busca si hay un usuario existente con ese email
    const existingUser = await em.findOne(Magos, { email: req.body.email });
    if (existingUser) {
      return res.status(409).json({ message: "Usuario ya existe." });
    }
    //cifrado de contraseña antes de guardarla
    const hashedPass = bcrypt.hashSync(req.body.pass, 10);
    const newUser = em.create(Magos, {
      nombre: req.body.nombre,
      apellido: req.body.apellido,
      email: req.body.email,
      pass: hashedPass,
      profesion: req.body.profesion,
      madera_varita: req.body.madera_varita,
      nucleo_varita: req.body.nucleo_varita,
      largo_varita: req.body.largo_varita,
      isEmpleado: req.body.isEmpleado,
      institucion: req.body.institucion
    });
    await em.persistAndFlush(newUser);
    return res.status(201).json({ message: "User Created." });
  } catch (err) {
    return res.status(500).json({ message: "Server Error", error: err });
  }
};

export const login = [
  //agregué validaciones con express-validator
  //NO cambiar el mínimo de longitud de la pass porque hay usuarios con 5 letras
  body("email").isEmail().withMessage("Must be a valid email").normalizeEmail(),
  body("pass").isLength({ min: 4}).withMessage("Password must be at least 4 charachters long"),
  async (req: Request, res: Response) => {
    const em = orm.em.fork();
    const errors = validationResult(req);
    //si hay error de validacion
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { email, pass } = req.body;
      //buscar el usuario por el mail
      const user = await em.findOne(Magos, { email });
      //comparar las contraseñas
      if (!user || !bcrypt.compareSync(pass, user.pass)) {
        return res.status(401).json({ message: "Invalid Credentials" });
      }
      if (!user.id) {
        return res.status(500).json({ message: "Error: User ID not found" });
      }
      //generar token
      const token = generateToken(user.id);
      const { pass: _, ...userData } = user;
      //cookie HttpOnly con el token
      //eltoken NO se envía en el cuerpo
      res.cookie("accessToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
        maxAge: 3600000 // 1 hora
      }).status(200).json({ user: userData });
    } catch (err) {
      return res.status(500).json({ message: "Server Error" });
    }
  }
];

export const logout = (req: Request, res: Response) => {
  //limpia la cookie
  res.clearCookie("accessToken", {
    httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
  }).status(200).json({ message: "Session closed" });
};

//validar la sesión (para que el frontend sepa si hay una sesión activa)
export const validateSession = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json({ message: "Not authenticated" });
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number };
    const em = orm.em.fork();
    const user = await em.findOne(Magos, { id: decoded.id });
    if (!user) return res.status(404).json({ message: "User not found" });
    const { pass, ...userData } = user;
    return res.status(200).json({ user: userData });
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired Token" });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const em = orm.em.fork();
  try {
    //extraer token de la cookie y verificarlo para obtener id del usuario
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json({ message: "Not authenticated" });
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number };
    const user = await em.findOne(Magos, { id: decoded.id });
    if (!user) return res.status(404).json({ message: "User not found" });

    //atualizar sólo campos permitidos
    user.nombre = req.body.nombre || user.nombre;
    user.apellido = req.body.apellido || user.apellido;
    user.email = req.body.email || user.email;
    user.profesion = req.body.profesion || user.profesion;
    user.madera_varita = req.body.madera_varita || user.madera_varita;
    user.nucleo_varita = req.body.nucleo_varita || user.nucleo_varita;
    user.largo_varita = req.body.largo_varita || user.largo_varita;

    //cifrar nueva constraseña
    if (req.body.pass) {
      user.pass = bcrypt.hashSync(req.body.pass, 10);
    }

    await em.persistAndFlush(user);
    const { pass, ...userData } = user;
    return res.status(200).json({ message: "Info updated", user: userData });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err });
  }
};


//Para recuperar el usuario desde el backend, sin necesariamente enviarlo desde el frontend
export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json({ message: "No authenticated user" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number };
    const em = orm.em.fork();
    const user = await em.findOneOrFail(Magos, { id: decoded.id });

    if (!user) return res.status(404).json({ message: "User not found" });

    req.user = user; // Agrego el usuario a la request
    next();
  } catch (err) {
    return res.status(401).json({ message: "invalid or expired Token" });
  }
};