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
exports.gameSchema = exports.Game = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const user_model_1 = require("./user.model");
const swagger_1 = require("@nestjs/swagger");
let Game = class Game {
};
__decorate([
    mongoose_1.Prop(),
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], Game.prototype, "roomId", void 0);
__decorate([
    mongoose_1.Prop(),
    swagger_1.ApiProperty(),
    __metadata("design:type", Array)
], Game.prototype, "board", void 0);
__decorate([
    mongoose_1.Prop({ type: String, ref: user_model_1.User.name }),
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], Game.prototype, "player1", void 0);
__decorate([
    mongoose_1.Prop({ type: String, ref: user_model_1.User.name }),
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], Game.prototype, "player2", void 0);
__decorate([
    mongoose_1.Prop(),
    swagger_1.ApiProperty(),
    __metadata("design:type", Date)
], Game.prototype, "datetime", void 0);
__decorate([
    mongoose_1.Prop(),
    swagger_1.ApiProperty(),
    __metadata("design:type", Boolean)
], Game.prototype, "playing", void 0);
Game = __decorate([
    mongoose_1.Schema()
], Game);
exports.Game = Game;
exports.gameSchema = mongoose_1.SchemaFactory.createForClass(Game);
//# sourceMappingURL=game.model.js.map