import request from 'supertest';
import { app } from '../src/app.js';

describe('Testing de las rutas de Solicitud', ()=>{

    it('Deberia fallar y tirar error 401', async()=>{
        await request(app)
            .get('/api/solicitud_visualizacion/')
            .expect('Content-Type', /json/)
            .expect(401);
    });

    it('Deberia fallar y tirar error 401', async()=>{
        await request(app)
            .get('/api/solicitud_visualizacion/pending')
            .expect('Content-Type', /json/)
            .expect(401);
    });
    it('Deberia fallar y tirar error 401', async()=>{
        await request(app)
            .get('/api/solicitud_visualizacion/mago')
            .expect('Content-Type', /json/)
            .expect(401);
    });
})