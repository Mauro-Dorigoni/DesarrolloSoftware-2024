import { validateUser, validateEmpleado } from "../src/shared/authFunctions.js";
import { Magos } from "../src/magos/magos.entity.js";
import { Collection } from "@mikro-orm/core";
describe("Testing de la authFunction validateUser", () => {
    it("debe devolver el usuario si existe", () => {
        const mockRequest = { user: {
                id: 1,
                nombre: "Harry",
                apellido: "Potter",
                email: "harry@potter.com",
                pass: "Estoesunacontra",
                profesion: 'Estudiante',
                madera_varita: "Holly",
                nucleo_varita: "Pluma de fenix",
                largo_varita: 35,
                isEmpleado: false,
                institucion: {
                    id: 1,
                    nombre: "Hogwarts",
                    ciudad: "Unknown",
                    pais: "Scotland",
                    magos: new Collection(new Magos)
                }
            } };
        const result = validateUser(mockRequest);
        expect(result).toEqual(mockRequest.user);
    });
    it("debe devolver null si el usuario no existe", () => {
        const mockRequest = { user: undefined };
        const result = validateUser(mockRequest);
        expect(result).toBeNull();
    });
});
describe("Testing de la authFunction validateEmpleado", () => {
    it("Deberia devolver el empleado si existe, si es empleado y si es el mismo enviado desde el front", () => {
        const mockRequest = { user: {
                id: 1,
                nombre: "Amelia",
                apellido: "Bones",
                email: "amelia@bones.com",
                pass: "Estoesunacontra",
                profesion: 'Proctologa',
                madera_varita: "Holly",
                nucleo_varita: "Pluma de fenix",
                largo_varita: 35,
                isEmpleado: true,
                institucion: {
                    id: 1,
                    nombre: "Hogwarts",
                    ciudad: "Unknown",
                    pais: "Scotland",
                    magos: new Collection(new Magos)
                }
            }, body: {
                empleado: 1,
            } };
        const result = validateEmpleado(mockRequest);
        expect(result).toBe(mockRequest.user);
    });
    it("Deberia devolver null si no hay user en la request", () => {
        const mockRequest = { user: undefined };
        const result = validateEmpleado(mockRequest);
        expect(result).toBeNull;
    });
    it("Deberia devolver null si el user no coincide con el enviado desde el front", () => {
        const mockRequest = { user: {
                id: 1,
                nombre: "Amelia",
                apellido: "Bones",
                email: "amelia@bones.com",
                pass: "Estoesunacontra",
                profesion: 'Proctologa',
                madera_varita: "Holly",
                nucleo_varita: "Pluma de fenix",
                largo_varita: 35,
                isEmpleado: true,
                institucion: {
                    id: 1,
                    nombre: "Hogwarts",
                    ciudad: "Unknown",
                    pais: "Scotland",
                    magos: new Collection(new Magos)
                }
            }, body: {
                empleado: 2,
            } };
        const result = validateEmpleado(mockRequest);
        expect(result).toBeNull;
    });
    it("Deberia devolver null si el user no es empleado", () => {
        const mockRequest = { user: {
                id: 1,
                nombre: "Amelia",
                apellido: "Bones",
                email: "amelia@bones.com",
                pass: "Estoesunacontra",
                profesion: 'Proctologa',
                madera_varita: "Holly",
                nucleo_varita: "Pluma de fenix",
                largo_varita: 35,
                isEmpleado: false,
                institucion: {
                    id: 1,
                    nombre: "Hogwarts",
                    ciudad: "Unknown",
                    pais: "Scotland",
                    magos: new Collection(new Magos)
                }
            }, body: {
                empleado: 2,
            } };
        const result = validateEmpleado(mockRequest);
        expect(result).toBeNull;
    });
});
//# sourceMappingURL=authFunctions.unit.test.js.map