import { Request, Response } from "express";
import { orm } from "../shared/db/orm.js";
import { Etiqueta } from "./etiqueta.entity.js";

const em = orm.em;

async function findAll(req: Request, res: Response) {
    try {
        const etiquetas = await em.find(Etiqueta, {});
        res.status(200).json({ message: 'founnd all etiquetas', data: etiquetas });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

async function findOne(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id);
        const etiqueta = await em.findOneOrFail(Etiqueta, { id });
        res.status(200).json({ message: 'found etiqueta', data: etiqueta });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

async function add(req: Request, res: Response) {
    try {
        const etiqueta = em.create(Etiqueta, req.body);
        await em.flush();
        res.status(201).json({ message: 'Etiqueta created', data: etiqueta });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

async function update(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id);
        const etiqueta = await em.getReference(Etiqueta, id);
        em.assign(etiqueta, req.body);
        await em.flush();
        res.status(200).json({ message: 'Etiqueta updated', data: etiqueta });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

async function remove(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id);
        const etiqueta = await em.getReference(Etiqueta, id);
        await em.removeAndFlush(etiqueta);
        res.status(200).json({ message: 'Etiqueta removed' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

export { findAll, findOne, add, update, remove };
