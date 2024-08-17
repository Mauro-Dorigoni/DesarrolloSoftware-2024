var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, Property, Collection, ManyToMany } from "@mikro-orm/core";
import { Hechizo } from "../hechizo/hechizo.entity.js";
import { BaseEntity } from "../shared/db/baseEntity.js";
let Etiqueta = class Etiqueta extends BaseEntity {
    constructor() {
        super(...arguments);
        this.hechizos = new Collection(this);
    }
};
__decorate([
    Property({ nullable: false, unique: true }),
    __metadata("design:type", String)
], Etiqueta.prototype, "nombre", void 0);
__decorate([
    Property({ nullable: false, unique: true }),
    __metadata("design:type", String)
], Etiqueta.prototype, "descripcion", void 0);
__decorate([
    ManyToMany(() => Hechizo, (hechizo) => hechizo.etiquetas),
    __metadata("design:type", Object)
], Etiqueta.prototype, "hechizos", void 0);
Etiqueta = __decorate([
    Entity()
], Etiqueta);
export { Etiqueta };
//# sourceMappingURL=etiqueta.entity.js.map