var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, Property } from "@mikro-orm/core";
/* import { Hechizo } from "../hechizo/hechizo.entity.js" */
import { BaseEntity } from "../shared/db/baseEntity.js";
/* import { Institucion } from "../institucion/institucion.entity.js"
import { Patente } from "../patente/patente.entity.js"
import { Solicitud } from "../solicitud_visualizacion/solicitud.entity.js" */
let Empleado = class Empleado extends BaseEntity {
};
__decorate([
    Property({ nullable: false, unique: false }),
    __metadata("design:type", String)
], Empleado.prototype, "nombre", void 0);
__decorate([
    Property({ nullable: false, unique: false }),
    __metadata("design:type", String)
], Empleado.prototype, "apellido", void 0);
__decorate([
    Property({ nullable: false, unique: true }),
    __metadata("design:type", String)
], Empleado.prototype, "email", void 0);
__decorate([
    Property({ nullable: false, unique: false }),
    __metadata("design:type", String)
], Empleado.prototype, "pass", void 0);
__decorate([
    Property({ nullable: false, unique: false }),
    __metadata("design:type", String)
], Empleado.prototype, "profesion", void 0);
__decorate([
    Property({ nullable: false, unique: false }),
    __metadata("design:type", String)
], Empleado.prototype, "madera_varita", void 0);
__decorate([
    Property({ nullable: false, unique: false }),
    __metadata("design:type", String)
], Empleado.prototype, "nucleo_varita", void 0);
__decorate([
    Property({ nullable: false, unique: false }),
    __metadata("design:type", Number)
], Empleado.prototype, "largo_varita", void 0);
__decorate([
    Property({ nullable: false, unique: false }),
    __metadata("design:type", Boolean)
], Empleado.prototype, "isEmpleado", void 0);
Empleado = __decorate([
    Entity()
], Empleado);
export { Empleado };
//# sourceMappingURL=empleado.entity.js.map