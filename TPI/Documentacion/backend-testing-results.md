## Resultados de las Pruebas Automáticas

### Resumen General
- **Pruebas exitosas**: 13
- **Pruebas fallidas**: 0
- **Pruebas pendientes**: 0
- **Errores en pruebas**: 0
- **Total de pruebas**: 13

### Detalles de las Pruebas

#### 1. **authFunction.validateUser**
- **debe devolver el usuario si existe**: ✅ Pasada
- **debe devolver null si el usuario no existe**: ✅ Pasada

#### 2. **authFunction.validateEmpleado**
- **Deberia devolver el empleado si existe, si es empleado y si es el mismo enviado desde el front**: ✅ Pasada
- **Deberia devolver null si no hay user en la request**: ✅ Pasada
- **Deberia devolver null si el user no coincide con el enviado desde el front**: ✅ Pasada
- **Deberia devolver null si el user no es empleado**: ✅ Pasada

#### 3. **instituciones.integration.test.js**
- **Deberia devolver un json con 200 de status**: ✅ Pasada

#### 4. **findOneMago.unit.test.js**
- **Deberia traer un mago de la BD**: ✅ Pasada
- **Deberia fallar y tirar error 500**: ✅ Pasada

#### 5. **solicitud.unit.test.js**
- **Deberia fallar y tirar error 401**: ✅ Pasada
- **Deberia fallar y tirar error 401**: ✅ Pasada
- **Deberia fallar y tirar error 401**: ✅ Pasada

#### 6. **prueba.test.js**
- **Deberia devolver un json con 200 de status**: ✅ Pasada
