import request from 'supertest'
import express from 'express';
import { app } from '../src/app.js';


describe("GET /api/institucion", () => {
  it("Deberia devolver un json con 200 de status", async () => {
      return request(app)
          .get("/api/institucion")
          .expect('Content-Type', /json/)
          .expect(200)
          
  });
});
