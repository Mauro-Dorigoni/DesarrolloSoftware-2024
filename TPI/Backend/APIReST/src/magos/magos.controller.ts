import { Request, Response, NextFunction } from "express";
import { orm } from "../shared/db/orm.js";
import { Magos } from "./magos.entity.js";

const em = orm.em
function sanitizeMagoInput(req: Request, res: Response, next: NextFunction)
{
    req.body.sanitizedInput = {
        nombre: req.body.nombre,
        apellido: req.body.apellido,     
        email:req.body.email,
        pass:req.body.pass,
        profesion:req.body.profesion,
        madera_varita:req.body.madera_varita,
        nucleo_varita:req.body.nucleo_varita,
        largo_varita:req.body.largo_varita,
        isEmpleado:req.body.isEmpleado,
        institucion:req.body.institucion,
        patentes:req.body.patentes,
        solicitudes:req.body.solicitudes, 
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
        const magos = await em.find(Magos, {},{populate:['institucion','patentes','solicitudes']} )
        res.status(200).json({ message: 'found all magos', data:magos})
    }
    catch(error: any){
        res.status(500).json({message:error.message})
    }

}

async function findOne(req: Request, res:Response){
    try{
        const id = Number.parseInt(req.params.id)
        const mago = await em.findOneOrFail(Magos,{ id },{populate:['institucion','patentes','solicitudes']})
        res.status(200).json({message: 'found mago', data :mago})
    }
    catch(error: any){
        res.status(500).json({message: error.message})
    }
    
}

async function add(req: Request, res:Response){
    try{
        const mago = em.create(Magos, req.body.sanitizedInput)
        await em.flush()
        res.status(201).json({ message: 'Mago created', data:mago})
    }
    catch(error: any){
        res.status(500).json({message:error.message})
    }
    
}

async function update(req: Request, res:Response){
    try{
        const id = Number.parseInt(req.params.id)
        const magoToUpdate = await em.findOneOrFail(Magos, { id })
        const existingEmail = await em.findOne(Magos, { email: req.body.sanitizedInput.email });
        if (existingEmail && existingEmail.id !== id) {
            return res.status(400).json({ message: 'The email is already in use' });
        }
        
        em.assign(magoToUpdate, req.body.sanitizedInput)
        await em.flush()
        res.status(200).json({ message: 'mago updated', data:magoToUpdate})
    }
    catch(error: any){
        res.status(500).json({message: error.message})
    }
    
}

async function remove(req: Request, res:Response){
    try{
        const id = Number.parseInt(req.params.id)
        const mago = em.getReference(Magos, id)
        await em.removeAndFlush(mago)
        res.status(200).send({ message: 'Mago removed'})
    }
    catch(error: any){
        res.status(500).json({message:error.message})
    }
}

export{sanitizeMagoInput, findAll, findOne, add, update, remove}