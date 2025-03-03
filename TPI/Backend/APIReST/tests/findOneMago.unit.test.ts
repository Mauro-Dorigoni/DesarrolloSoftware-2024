import request from 'supertest';
import { app } from '../src/app.js';

describe('GET /api/magos/:id', ()=>{
    it("Deberia traer un mago de la BD", async()=>{
        const idMago = 1;
        const response = await request(app)
            .get(`/api/magos/${idMago}`)
            .expect('Content-Type', /json/)
            .expect(200);
        expect(response.body.data).toHaveProperty('id');
        expect(response.body.data).toHaveProperty('nombre');
        expect(response.body.data).toHaveProperty('apellido');
        expect(response.body.data).toHaveProperty('email');
        expect(response.body.data).toHaveProperty('isEmpleado');
        expect(response.body.data).toHaveProperty('pass');
        expect(response.body.data).toHaveProperty('profesion');
        expect(response.body.data).toHaveProperty('madera_varita');
        expect(response.body.data).toHaveProperty('nucleo_varita');
        expect(response.body.data).toHaveProperty('largo_varita');
        expect(response.body.data).toHaveProperty('institucion');
        expect(response.body.data).toHaveProperty('patentes');
        expect(response.body.data).toHaveProperty('solicitudes');
        expect(response.body.data.id).toBe(idMago);
    });
    it('Deberia fallar y tirar error 500', async()=>{
        const idMago = 'aswse';
        await request(app)
            .get(`/api/magos/${idMago}`)
            .expect('Content-Type', /json/)
            .expect(500);
    })
})

