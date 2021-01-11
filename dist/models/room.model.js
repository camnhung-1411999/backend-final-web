"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.roomSchema = exports.Room = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const swagger_1 = require("@nestjs/swagger");
let Room = class Room {
};
__decorate([
    mongoose_1.Prop({ type: Object }),
    swagger_1.ApiProperty(),
    __metadata("design:type", Object)
], Room.prototype, "player1", void 0);
__decorate([
    mongoose_1.Prop({ type: Object }),
    swagger_1.ApiProperty(),
    __metadata("design:type", Object)
], Room.prototype, "player2", void 0);
__decorate([
    mongoose_1.Prop(),
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], Room.prototype, "idroom", void 0);
__decorate([
    mongoose_1.Prop(),
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], Room.prototype, "public", void 0);
__decorate([
    mongoose_1.Prop(),
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], Room.prototype, "password", void 0);
__decorate([
    mongoose_1.Prop(),
    swagger_1.ApiProperty({ type: [] }),
    __metadata("design:type", Array)
], Room.prototype, "viewers", void 0);
__decorate([
    mongoose_1.Prop(),
    swagger_1.ApiProperty({ type: [] }),
    __metadata("design:type", Array)
], Room.prototype, "chat", void 0);
Room = __decorate([
    mongoose_1.Schema()
], Room);
exports.Room = Room;
exports.roomSchema = mongoose_1.SchemaFactory.createForClass(Room);
//# sourceMappingURL=room.model.js.map