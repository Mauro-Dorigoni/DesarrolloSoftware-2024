var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, OneToMany, Property, Cascade, Collection } from "@mikro-orm/core";
import { Patente } from "../patente/patente.entity.js";
import { BaseEntity } from "../shared/db/baseEntity.js";
let Tipo_Hechizo = class Tipo_Hechizo extends BaseEntity {
    nombre;
    caracteristicas;
    patentes = new Collection(this);
};
__decorate([
    Property({ nullable: false, unique: true }),
    __metadata("design:type", String)
], Tipo_Hechizo.prototype, "nombre", void 0);
__decorate([
    Property({ nullable: false, unique: true }),
    __metadata("design:type", String)
], Tipo_Hechizo.prototype, "caracteristicas", void 0);
__decorate([
    OneToMany(() => Patente, patente => patente.tipo_hechizo, { cascade: [Cascade.ALL] }),
    __metadata("design:type", Object)
], Tipo_Hechizo.prototype, "patentes", void 0);
Tipo_Hechizo = __decorate([
    Entity()
], Tipo_Hechizo);
export { Tipo_Hechizo };
//# sourceMappingURL=tipo_hechizo.entity.js.map