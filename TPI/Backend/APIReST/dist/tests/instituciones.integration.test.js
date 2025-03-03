import { app } from "../src/app.js";
import request from 'supertest';
describe("Deberia reflejar la adicion de una institucion y luego de un mago perteneciente a esta", () => {
    it("Deberia dar de alta la institucion y el mago correctamente", async () => {
        const initialResponse = await request(app).get('/api/institucion');
        expect(initialResponse.status).toBe(200);
        const initialInstitucionesCount = initialResponse.body.data.length;
        const secondResponse = await request(app).post('/api/institucion/').send({
            nombre: 'Prueba1',
            ciudad: 'Prueba1',
            pais: 'Prueba1'
        });
        expect(secondResponse.status).toBe(201);
        const thirdResponse = await request(app).get('/api/institucion');
        expect(thirdResponse.status).toBe(200);
        const secondInstitucionesCount = thirdResponse.body.data.length;
        expect(secondInstitucionesCount).toBe(initialInstitucionesCount + 1);
        const initialMagosResponse = await request(app).get('/api/magos');
        expect(initialMagosResponse.status).toBe(200);
        const initialMagosLength = initialMagosResponse.body.data.length;
        const secondMagosResponse = await request(app).post('/api/magos').send({
            nombre: 'MagoPrueba',
            apellido: 'MagoPrueba',
            email: 'mago@prueba.com',
            pass: 'contrRpuea',
            profesion: 'probPrueba',
            madera_varita: 'req.body.madera_varita',
            nucleo_varita: 'req.body.nucleo_varita',
            largo_varita: 35,
            isEmpleado: false,
            institucion: secondResponse.body.data.id,
            patentes: [],
            solicitudes: []
        });
        expect(secondMagosResponse.status).toBe(201);
        expect(secondMagosResponse.body.data.institucion).toBe(secondResponse.body.data.id);
        const thirdMagosResponse = await request(app).get('/api/magos');
        const secondMagosLength = thirdMagosResponse.body.data.length;
        expect(secondMagosLength).toBe(initialMagosLength + 1);
    });
});
//# sourceMappingURL=instituciones.integration.test.js.map