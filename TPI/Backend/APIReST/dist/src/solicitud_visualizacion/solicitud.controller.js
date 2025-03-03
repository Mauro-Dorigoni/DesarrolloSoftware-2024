import { orm } from "../shared/db/orm.js";
import { Solicitud } from "./solicitud.entity.js";
import { SolicitudEstado } from "./solicitud.enum.js";
import { Hechizo } from "../hechizo/hechizo.entity.js";
import { validateUser, validateEmpleado } from "../shared/authFunctions.js";
const em = orm.em;
function sanitizeSolicitudInput(req, res, next) {
    req.body.sanitizedInput = {
        fecha_hasta: req.body.fecha_hasta,
        permanente: req.body.permanente,
        motivo: req.body.motivo,
        motivo_rechazo: req.body.motivo_rechazo,
        estado: req.body.estado,
        hechizo: req.body.hechizo,
        mago: req.body.mago,
        empleado: req.body.empleado,
        idMago: req.body.idMago,
        idHechizo: req.body.idHechizo
    };
    Object.keys(req.body.sanitizedInput).forEach((key) => {
        if (req.body.sanitizedInput[key] === undefined) {
            delete req.body.sanitizedInput[key];
        }
    });
    next();
}
//Buscar todas las solicitudes
async function findAll(req, res) {
    try {
        const solicitudes = await em.find(Solicitud, {}, { populate: ['fecha_hasta', 'permanente', 'motivo', 'motivo_rechazo', 'estado', 'hechizo', 'mago', 'empleado'
            ] });
        res.status(200).json({ message: "Found All Solicitudes", data: solicitudes });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
//Buscar solicitudes pendientes de revision
async function findAllPending(req, res) {
    try {
        const solicitudesPendientes = await em.find(Solicitud, { estado: SolicitudEstado.PENDIENTE_REVISION }, { populate: ['fecha_hasta', 'permanente', 'motivo', 'motivo_rechazo', 'estado', 'hechizo', 'mago', 'empleado'] });
        res.status(200).json({ message: "Solicitudes pending revision found", data: solicitudesPendientes });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
//Creacion de nueva solicitud
async function add(req, res) {
    try {
        // Obtener los datos del cuerpo de la request
        const { idMago, idHechizo, ...solicitudData } = req.body.sanitizedInput;
        // Verificar si el mago existe
        const magoExistente = validateUser(req);
        if (!magoExistente) {
            return res.status(401).json({ message: "Not authenticated" });
        }
        /*
            Verificar si el hechizo existe (podria omitirse en caso de que la request
            ya disponga del objeto hechizo )
        */
        let hechizoExistente = await em.findOne(Hechizo, { id: idHechizo });
        if (!hechizoExistente) {
            return res.status(404).json({ message: 'Hechizo not found' });
        }
        // Crear la solicitud vinculada al mago existente
        const nuevaSolicitud = em.create(Solicitud, {
            ...solicitudData,
            mago: magoExistente, // Asociar el mago con la solicitud
            hechizo: hechizoExistente, //Asociar el hechizo con la solicitud
            estado: SolicitudEstado.PENDIENTE_REVISION, //Asignacion por defecto
            permanente: false, //Asignacion por defecto.
        });
        //Guardado en base de datos
        await em.flush();
        res.status(201).json({ message: 'Solicitud created', data: nuevaSolicitud });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
//Deberiamos utilizar el sanitizeInput, por el momento lo hacemos sin el.
async function grant(req, res) {
    try {
        // Buscar la solicitud por su ID
        const id = Number.parseInt(req.params.id);
        const solicitud = await em.findOneOrFail(Solicitud, { id });
        //Obtengo el empleado actual para asignar a la solicitud
        const empleado = validateEmpleado(req);
        if (!empleado) {
            return res.status(401).json({ message: "Not authenticated" });
        }
        if (!solicitud) {
            return res.status(404).json({ message: 'Solicitud not found' });
        }
        // Verificar que el estado actual sea "pendiente_revision"
        if (solicitud.estado !== SolicitudEstado.PENDIENTE_REVISION) {
            return res.status(400).json({ message: 'The Solicitud is not pending revision' });
        }
        // Actualizar el estado, asignar empleado, y definir si la solicitud es permanente o no.
        solicitud.estado = SolicitudEstado.APROBADA;
        solicitud.empleado = empleado;
        // Si se ha seleccionado como permanente, no se asigna fecha de validez, sino, asigna la fecha de validez
        if (req.body.permanente) {
            solicitud.permanente = req.body.permanente;
        }
        else {
            solicitud.permanente = false;
            solicitud.fecha_hasta = req.body.fecha_hasta;
        }
        await em.persistAndFlush([solicitud]);
        res.status(200).json({ message: 'Solicitud granted correctly', data: solicitud });
    }
    catch (error) {
        res.status(500).json({ message: 'There was a problem in granting the Solicitud' });
    }
}
//Rechazar la solicitud
async function reject(req, res) {
    try {
        // Busca la solicitud por su ID
        const id = Number.parseInt(req.params.id);
        const solicitud = await em.findOneOrFail(Solicitud, { id }, { populate: ['fecha_hasta', 'permanente', 'motivo', 'motivo_rechazo', 'estado', 'hechizo', 'mago', 'empleado'] });
        if (!solicitud) {
            return res.status(404).json({ message: 'Solicitud not found' });
        }
        // Verifica que el estado actual sea "pendiente_revision"
        if (solicitud.estado !== SolicitudEstado.PENDIENTE_REVISION) {
            return res.status(400).json({ message: 'The Solicitud is not pending revision' });
        }
        // Actualiza el estado de la solicitud a "rechazada", agrega el motivo y el empleado que la rechazó.
        solicitud.estado = SolicitudEstado.RECHAZADA;
        solicitud.motivo_rechazo = req.body.sanitizedInput.motivo_rechazo;
        const empleado = validateEmpleado(req);
        if (!empleado) {
            return res.status(401).json({ message: "Not authenticated" });
        }
        solicitud.empleado = empleado;
        // Actualiza en BD
        await em.persistAndFlush([solicitud]);
        res.status(200).json({ message: 'Solicitud rejected correctly', data: solicitud });
    }
    catch (error) {
        res.status(500).json({ message: 'There was a problem in rejecting the Solicitud' });
    }
}
async function findByMago(req, res) {
    try {
        const magoExistente = validateUser(req);
        if (!magoExistente) {
            return res.status(401).json({ message: "Not authenticated" });
        }
        const solicitudes = await em.find(Solicitud, { mago: magoExistente }, { populate: ['fecha_hasta', 'permanente', 'motivo', 'motivo_rechazo', 'estado', 'hechizo', 'mago', 'empleado'] });
        res.status(200).json({ message: "Mago solicitudes found", data: solicitudes });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}
export { findAll, findAllPending, findByMago, add, grant, reject, sanitizeSolicitudInput };
//# sourceMappingURL=solicitud.controller.js.map