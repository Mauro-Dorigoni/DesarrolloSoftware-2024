var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, OneToMany, Property, Cascade, Collection, ManyToOne } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.js";
import { Institucion } from "../institucion/institucion.entity.js";
import { Patente } from "../patente/patente.entity.js";
import { Solicitud } from "../solicitud_visualizacion/solicitud.entity.js";
let Magos = class Magos extends BaseEntity {
    nombre;
    apellido;
    email;
    pass;
    profesion;
    madera_varita;
    nucleo_varita;
    largo_varita;
    isEmpleado;
    institucion;
    patentes = new Collection(this);
    solicitudes = new Collection(this);
};
__decorate([
    Property({ nullable: false, unique: false }),
    __metadata("design:type", String)
], Magos.prototype, "nombre", void 0);
__decorate([
    Property({ nullable: false, unique: false }),
    __metadata("design:type", String)
], Magos.prototype, "apellido", void 0);
__decorate([
    Property({ nullable: false, unique: true }),
    __metadata("design:type", String)
], Magos.prototype, "email", void 0);
__decorate([
    Property({ nullable: false, unique: false }),
    __metadata("design:type", String)
], Magos.prototype, "pass", void 0);
__decorate([
    Property({ nullable: true, unique: false }),
    __metadata("design:type", String)
], Magos.prototype, "profesion", void 0);
__decorate([
    Property({ nullable: false, unique: false }),
    __metadata("design:type", String)
], Magos.prototype, "madera_varita", void 0);
__decorate([
    Property({ nullable: false, unique: false }),
    __metadata("design:type", String)
], Magos.prototype, "nucleo_varita", void 0);
__decorate([
    Property({ nullable: false, unique: false }),
    __metadata("design:type", Number)
], Magos.prototype, "largo_varita", void 0);
__decorate([
    Property({ nullable: false, unique: false }),
    __metadata("design:type", Boolean)
], Magos.prototype, "isEmpleado", void 0);
__decorate([
    ManyToOne(() => Institucion, { nullable: false }),
    __metadata("design:type", Object)
], Magos.prototype, "institucion", void 0);
__decorate([
    OneToMany(() => Patente, patente => patente.mago, { cascade: [Cascade.ALL] }),
    __metadata("design:type", Object)
], Magos.prototype, "patentes", void 0);
__decorate([
    OneToMany(() => Solicitud, solicitud => solicitud.mago, { cascade: [Cascade.ALL] }),
    __metadata("design:type", Object)
], Magos.prototype, "solicitudes", void 0);
Magos = __decorate([
    Entity()
], Magos);
export { Magos };
//# sourceMappingURL=magos.entity.js.map