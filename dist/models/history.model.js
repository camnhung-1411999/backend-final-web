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
exports.historySchema = exports.History = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const user_model_1 = require("./user.model");
const swagger_1 = require("@nestjs/swagger");
let History = class History {
};
__decorate([
    mongoose_1.Prop(),
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], History.prototype, "roomId", void 0);
__decorate([
    mongoose_1.Prop(),
    swagger_1.ApiProperty(),
    __metadata("design:type", Array)
], History.prototype, "result", void 0);
__decorate([
    mongoose_1.Prop({ type: String, ref: user_model_1.User.name }),
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], History.prototype, "winner", void 0);
__decorate([
    mongoose_1.Prop({ type: String, ref: user_model_1.User.name }),
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], History.prototype, "loser", void 0);
__decorate([
    mongoose_1.Prop(),
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], History.prototype, "datetime", void 0);
__decorate([
    mongoose_1.Prop(),
    swagger_1.ApiProperty(),
    __metadata("design:type", Array)
], History.prototype, "chat", void 0);
History = __decorate([
    mongoose_1.Schema()
], History);
exports.History = History;
exports.historySchema = mongoose_1.SchemaFactory.createForClass(History);
//# sourceMappingURL=history.model.js.map