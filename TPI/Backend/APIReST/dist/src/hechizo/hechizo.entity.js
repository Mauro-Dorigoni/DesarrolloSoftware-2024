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
import { Patente } from "../patente/patente.entity.js";
import { Solicitud } from "../solicitud_visualizacion/solicitud.entity.js";
let Hechizo = class Hechizo extends BaseEntity {
    nombre;
    descripcion;
    instrucciones;
    restringido;
    patente;
    solicitudes = new Collection(this);
};
__decorate([
    Property({ nullable: false, unique: true }),
    __metadata("design:type", String)
], Hechizo.prototype, "nombre", void 0);
__decorate([
    Property({ nullable: false, unique: true }),
    __metadata("design:type", String)
], Hechizo.prototype, "descripcion", void 0);
__decorate([
    Property({ nullable: false, unique: false }),
    __metadata("design:type", String)
], Hechizo.prototype, "instrucciones", void 0);
__decorate([
    Property({ nullable: false, unique: false }),
    __metadata("design:type", Boolean)
], Hechizo.prototype, "restringido", void 0);
__decorate([
    ManyToOne(() => Patente, { nullable: false }),
    __metadata("design:type", Object)
], Hechizo.prototype, "patente", void 0);
__decorate([
    OneToMany(() => Solicitud, solicitud => solicitud.hechizo, { cascade: [Cascade.ALL] }),
    __metadata("design:type", Object)
], Hechizo.prototype, "solicitudes", void 0);
Hechizo = __decorate([
    Entity()
], Hechizo);
export { Hechizo };
//# sourceMappingURL=hechizo.entity.js.map