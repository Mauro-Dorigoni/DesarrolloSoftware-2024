import e, { Request, Response, NextFunction } from "express";
import { orm } from "../shared/db/orm.js";
import { Patente } from "./patente.entity.js";
import { PatenteEstado } from "./patente.enum.js";
import { Magos } from "../magos/magos.entity.js";
import { Tipo_Hechizo } from "../tipo_hechizo/tipo_hechizo.entity.js";
import { Etiqueta } from "../etiqueta/etiqueta.entity.js";
import path from "path";
import fs from 'fs';
import { fileURLToPath } from "url";
import { validateUser, validateEmpleado } from "../shared/authFunctions.js";
import { AuthRequest } from "../shared/types.js";


const em = orm.em.fork();

//Obtengo el dirname para el manejo de imagenes
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootPath = path.resolve(__dirname, '..', '..', 'public', 'uploads');

function sanitizePatenteInput(req: Request, res: Response, next: NextFunction)
{
    req.body.sanitizedInput = {
        fechaCreacion: req.body.fechaCreacion,
        nombre: req.body.nombre,    
        descripcion: req.body.descripcion,     
        estado: req.body.estado,
        motivo_rechazo: req.body.motivo_rechazo,
        instrucciones: req.body.instrucciones,
        restringido: req.body.restringido,
        hechizo: req.body.hechizo,
        tipo_hechizo: req.body.TipoHechizo,
        empleado: req.body.empleado,
        etiquetas: req.body.Etiquetas,
        idMago: req.body.idMago 
    }

    Object.keys(req.body.sanitizedInput).forEach((key)=>{
        if(req.body.sanitizedInput[key] === undefined) {
            delete req.body.sanitizedInput[key]
        }
    })
    next()
}
async function findAll(req: Request, res:Response){
    try {
        const patentes = await em.find(Patente,{},{populate:['hechizos','empleado','mago','etiquetas','tipo_hechizo']});
        //Proteccion de datos sensibles
        let filteredPatentes = patentes;
        const magoExistente: Magos | null = validateUser(req);
        if (!magoExistente) {
            return res.status(401).json({ message: "Not authenticated" });
        }
        if(!magoExistente.isEmpleado){
            filteredPatentes = patentes.map(p => {
                if(p.restringido && !(p.mago.id===magoExistente.id)){
                    p.instrucciones = "[REDACTED]";
                    return p;
                }
                return p;
            })
        }
        res.status(200).json({message:"Found All Patentes", data:filteredPatentes})
    } catch (error:any) {
        res.status(500).json({message:error.message})
    }
}

async function findByMago(req: AuthRequest, res:Response){
    try {
        const magoExistente: Magos | null = validateUser(req);
        if (!magoExistente) {
            return res.status(401).json({ message: "Not authenticated" });
        }
        const patentes = await em.find(Patente,{ mago: magoExistente.id },{populate:['empleado','mago']})
        res.status(200).json({ message: patentes.length === 0 ? "No patentes found for this user" : "Patentes found", data: patentes });
    } catch (error:any) {
        res.status(500).json({message:error.message})
    }
}

async function findAllPending(req:Request, res:Response) {
    try {
        const patentesPendientes = await em.find(Patente, {estado: PatenteEstado.PENDIENTE_REVISION},{populate:['hechizos','empleado','mago','etiquetas','tipo_hechizo']});
        res.status(200).json({ message: "Patentes pendientes de revisión found", data: patentesPendientes });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

async function add(req: AuthRequest, res:Response){
    try {
        // Obtener los datos del cuerpo de la solicitud
        const { idMago, ...patenteData } = req.body;
        
        // Verificar si el mago existe
        const magoExistente: Magos | null = validateUser(req);
        if (!magoExistente) {
            return res.status(401).json({ message: "Not autenticted" });
        }

        const imagen = req.file ? req.file.filename : null;

        // Crear la patente vinculada al mago existente
        const nuevaPatente = em.create(Patente, {
            ...patenteData,
            mago: magoExistente, // Asociar el mago con la patente
            estado: PatenteEstado.PENDIENTE_REVISION,
            fechaCreacion: new Date(),
            imagen,
        });

        // Guardar en la base de datos
        await em.flush();
        
        // Responder con la nueva patente creada
        res.status(201).json({ message: "Patente created", data: nuevaPatente });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

async function publish(req:AuthRequest, res:Response){
    try {
        // Buscar la patente por su ID
        const id = Number.parseInt(req.params.id)
        const patente = await em.findOneOrFail(Patente,{ id });
        const idTH = Number.parseInt(req.body.tipoHechizo);
        const tipo_hechizo = await em.findOneOrFail(Tipo_Hechizo,{ id:idTH });
        const empleado: Magos | null = validateEmpleado(req);
        if (!empleado) {
            return res.status(401).json({ message: "Not authenticated" });
        }

        if (!patente) {
            return res.status(404).json({ message: 'Patente not found' });
        }

        // Verificar que el estado actual sea "pendiente_revision"
        if (patente.estado !== PatenteEstado.PENDIENTE_REVISION) {
            return res.status(400).json({ message: 'The Patente is not pendiente_revision' });
        }
        // Actualizar el estado
        patente.estado = PatenteEstado.PUBLICADA;
        patente.empleado = empleado;
        patente.restringido = req.body.restringido;
        patente.tipo_hechizo = tipo_hechizo;
        for (let i=0 ; i<req.body.Etiquetas.length; i++){
            const etiqueta = await em.findOneOrFail(Etiqueta, {id: req.body.Etiquetas[i].id})
            patente.etiquetas?.add(etiqueta)
        }
        //Crear el hechizo si la patente ha sido publicada
        const hechizo = {
            nombre: patente.nombre,
            descripcion: patente.descripcion,
            instrucciones: patente.instrucciones,
            restringido: patente.restringido,
            patente: patente // Asociar el hechizo con la patente
        };

        const newHechizo = em.create('Hechizo', hechizo);
        await em.persistAndFlush([patente,newHechizo]);


        res.status(200).json({ message: 'Patente published and Hechizo created', data: patente });
    } catch (error: any) {
        res.status(500).json({ message: 'There was a problem publishing the Patente' });
    }
}
async function reject(req: AuthRequest, res: Response) {
    try {
        // Busca la patente por su ID
        const id = Number.parseInt(req.params.id);
        const patente = await em.findOneOrFail(Patente, { id }, { populate: ['hechizos', 'tipo_hechizo', 'empleado', 'mago', 'etiquetas'] });
        if (!patente) {
            return res.status(404).json({ message: 'Patente not found' });
        }

        // Verifica que el estado actual sea "pendiente_revision"
        if (patente.estado !== PatenteEstado.PENDIENTE_REVISION) {
            return res.status(400).json({ message: 'The patente is not pendiente_revisión' });
        }

        const imageName = patente.imagen;
        if (imageName) {
            // Construye la ruta correcta al archivo en 'uploads' desde la raíz del proyecto
            const imagePath = path.join(rootPath, imageName);

            // Verifica si el archivo existe y eliminarlo
            await new Promise<void>((resolve, reject) => {
                fs.unlink(imagePath, (err) => {
                    if (err) {
                        reject(new Error('Error in eliminating the image'));
                    } else {
                        resolve();
                    }
                });
            });
        } 

        // Actualiza el estado de la patente a "rechazada", agrega el motivo y el empleado que la rechazó, deslinkea la imagen
        patente.estado = PatenteEstado.RECHAZADA;
        patente.motivo_rechazo = req.body.sanitizedInput.motivo_rechazo;
        const empleado: Magos | null = validateEmpleado(req);
        if (!empleado) {
            return res.status(401).json({ message: "Not authenticated" });
        }
        patente.empleado = empleado;
        patente.imagen=null;

        // Actualiza en BD
        await em.persistAndFlush([patente]);

        res.status(200).json({ message: 'Patente rejected', data: patente });

    } catch (error: any) {
        res.status(500).json({ message: 'there was a problem rejecting the patente' });
    }
}

export {sanitizePatenteInput,findAll, add, publish, reject, findAllPending, findByMago}