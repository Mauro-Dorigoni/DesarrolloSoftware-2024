import { Request, Response, NextFunction } from "express";
import { orm } from "../shared/db/orm.js";
import { Magos } from "../magos/magos.entity.js";
import { Hechizo } from "./hechizo.entity.js";
import { AuthRequest } from "../shared/types.js";
import { validateUser } from "../shared/authFunctions.js";
import { populate } from "dotenv";

const em = orm.em;

async function findAll(req: AuthRequest, res: Response) {
    try {
        const hechizos = await em.find(Hechizo, {}, {populate:['nombre' , 'descripcion', 'instrucciones','solicitudes', 'restringido', 'patente',
                                                                'patente.tipo_hechizo','patente.mago', 'patente.etiquetas']});
        //Protejo los datos sensibles en base al usuario que los pide
        const magoExistente: Magos | null = validateUser(req);
        if (!magoExistente) {
            return res.status(401).json({ message: "Not authenticated" });
        }
        let hechizosFiltrados = hechizos;
        if (!magoExistente.isEmpleado) {
            hechizosFiltrados = hechizos.map(h => {
                if (h.restringido) {
                    const tieneSolicitudAprobada = h.solicitudes.getItems().some(s => s.mago.id === magoExistente.id && s.estado === 'aprobada');
                    const esCreadorDePatente = h.patente?.mago.id === magoExistente.id;
                    if (!tieneSolicitudAprobada && !esCreadorDePatente) {
                        return { ...h, instrucciones: "[Redacted]", patente:{...h.patente, instrucciones: "[Redacted]"} };
                    }
                }
                return h;
            });
        }
        res.status(200).json({ message: "Found All Hechizos", data: hechizosFiltrados });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

async function findOne(req: Request, res:Response){
    try{
        const id = Number.parseInt(req.params.id);
        const hechizo = await em.findOneOrFail(Hechizo,{id}, {populate:['nombre' , 'descripcion', 'instrucciones','solicitudes', 'restringido', 'patente','patente.tipo_hechizo','patente.mago', 'patente.etiquetas']});
        const magoExistente: Magos | null = validateUser(req);
        if (!magoExistente) {
            return res.status(401).json({ message: "Not authenticated" });
        }
        if(!magoExistente.isEmpleado && hechizo.restringido){
            const tieneSolicitudAprobada = hechizo.solicitudes.getItems().some(s => s.mago.id === magoExistente.id && s.estado === 'aprobada');
            const esCreadorDePatente = hechizo.patente?.mago.id === magoExistente.id;
            if (!tieneSolicitudAprobada && !esCreadorDePatente) {
                hechizo.instrucciones = "[REDACTED]",
                hechizo.patente.instrucciones = "[REDACTED]";
            }
        }
        res.status(200).json({ message: 'found hechizo', data: hechizo });
    }catch(error:any){
        res.status(500).json({ message: error.message });
    }
}

//Devuelve los hechizos restringidos para los cuales un mago puede solicitar acceso de visualizacion
async function getAvailableForVisualizacion(req:AuthRequest, res:Response) {
    try {
        const magoExistente: Magos | null = validateUser(req);
        if (!magoExistente) {
            return res.status(401).json({ message: "Not authenticated" });
        }
        const hechizos = await em.find(Hechizo, {}, {populate:['nombre' , 'descripcion', 'instrucciones','solicitudes', 'restringido', 'patente','patente.tipo_hechizo','patente.mago', 'patente.etiquetas']});
        const hechizosFiltrados = hechizos.filter(h => {
            // Saco los hechizos no restringidos
            if (!h.restringido) {
                return false;
            }
            // Si está restringido, pero fue patentado por el mago, lo saco
            if (h.patente && h.patente.mago && h.patente.mago.id === magoExistente.id) {
                return false;
            }
            // Si está restringido, y el mago tiene solicitudes aprobadas o pendientes de revisión, lo saco
            const tieneSolicitudAprobadaOPendiente = h.solicitudes.getItems().some(s =>
                s.mago && s.mago.id === magoExistente.id && ['aprobada', 'pendiente_revision'].includes(s.estado ?? '')
            );
        
            if (tieneSolicitudAprobadaOPendiente) {
                return false;
            }
            return true;
        }).map(h => ({
            id: h.id, 
            nombre: h.nombre,
            restringido: h.restringido
        }));  // Mapeo solo el id y nombre para evitar enviar datos sensibles  
        res.status(200).json({ message: "Hechizos available", data: hechizosFiltrados });
    } catch (error:any) {
        res.status(500).json({ message: error.message });
    }
}
//devuelve los IDs de los hachizos que el usuario puede visualizar
async function findPermitedForUser(req:AuthRequest, res:Response) {
    try {
        const magoExistente: Magos | null = validateUser(req);
        if (!magoExistente) {
            return res.status(401).json({ message: "Not authenticated" });
        }
        let hechizosPermitidos = null;
        //si es empleado, el usuario puede visualizar todos los hechizos
        if(magoExistente.isEmpleado){
             hechizosPermitidos = await em.find(Hechizo, {}, {fields: ['id']})
        }else{ //si no es empleado, el usuario puede ver los hechizos no restringidos, los de su propia autoria y aquellos para los cuales tenga solicitudes vigentes
            hechizosPermitidos = await em.find(Hechizo,{
                $or: [
                    {restringido: false},
                    {patente: {mago: magoExistente}},
                    {solicitudes:{mago: magoExistente, estado: 'aprobada'}}
                ]
            }, {fields: ['id']})
        }
        res.status(200).json({message: "Hechizos that the user can visulize", data: hechizosPermitidos})
    } catch (error:any) {
        res.status(500).json({ message: error.message });
    }
}


export {findAll, findOne, getAvailableForVisualizacion, findPermitedForUser}