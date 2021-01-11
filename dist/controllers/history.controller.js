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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HistoryController = void 0;
const common_1 = require("@nestjs/common");
const history_service_1 = require("../services/history.service");
const history_model_1 = require("../models/history.model");
const swagger_1 = require("@nestjs/swagger");
const user_guard_1 = require("../interface/user.guard");
let HistoryController = class HistoryController {
    constructor(appService) {
        this.appService = appService;
    }
    listAll(req) {
        return this.appService.listAll();
    }
    listByUser(req) {
        return this.appService.findByUsername(req.user.user);
    }
    findSingByRoomID(_id) {
        return this.appService.findSingByID(_id);
    }
    create(input) {
        return this.appService.create(input);
    }
};
__decorate([
    common_1.Get('/list'),
    __param(0, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Object)
], HistoryController.prototype, "listAll", null);
__decorate([
    common_1.Get('/'),
    common_1.UseGuards(user_guard_1.JwtAuthGuard),
    __param(0, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], HistoryController.prototype, "listByUser", null);
__decorate([
    common_1.Get('/result/:id'),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HistoryController.prototype, "findSingByRoomID", null);
__decorate([
    common_1.Post('/'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [history_model_1.History]),
    __metadata("design:returntype", Promise)
], HistoryController.prototype, "create", null);
HistoryController = __decorate([
    common_1.Controller('/history'),
    swagger_1.ApiTags('History'),
    __metadata("design:paramtypes", [history_service_1.HistoryService])
], HistoryController);
exports.HistoryController = HistoryController;
//# sourceMappingURL=history.controller.js.map