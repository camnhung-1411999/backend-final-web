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
exports.RoomController = void 0;
const common_1 = require("@nestjs/common");
const room_service_1 = require("../services/room.service");
const swagger_1 = require("@nestjs/swagger");
const user_guard_1 = require("../interface/user.guard");
let RoomController = class RoomController {
    constructor(appService) {
        this.appService = appService;
    }
    list(req) {
        return this.appService.list();
    }
    getRoom(idroom, req) {
        return this.appService.getRoom(idroom);
    }
    create(req, input) {
        const data = {
            player1: req.user.user,
            player2: null,
            idroom: null,
            public: input.public,
            password: input.public ? input.password : null,
            viewers: [],
        };
        return this.appService.create(data);
    }
    join(idroom, req, input) {
        const data = {
            idroom,
            player: req.user.user,
            password: input.password
        };
        return this.appService.join(data);
    }
    out(idroom, req) {
        const data = {
            idroom,
            player: req.user.user,
        };
        return this.appService.outRoom(data);
    }
};
__decorate([
    common_1.Get(),
    __param(0, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Object)
], RoomController.prototype, "list", null);
__decorate([
    common_1.Get('/:id'),
    __param(0, common_1.Param('id')), __param(1, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Object)
], RoomController.prototype, "getRoom", null);
__decorate([
    common_1.Post('/create'),
    common_1.UseGuards(user_guard_1.JwtAuthGuard),
    __param(0, common_1.Request()), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], RoomController.prototype, "create", null);
__decorate([
    common_1.Post('/join/:id'),
    common_1.UseGuards(user_guard_1.JwtAuthGuard),
    __param(0, common_1.Param('id')), __param(1, common_1.Request()), __param(2, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], RoomController.prototype, "join", null);
__decorate([
    common_1.Put('/out/:id'),
    common_1.UseGuards(user_guard_1.JwtAuthGuard),
    __param(0, common_1.Param('id')), __param(1, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], RoomController.prototype, "out", null);
RoomController = __decorate([
    common_1.Controller('/rooms'),
    swagger_1.ApiTags('Room'),
    __metadata("design:paramtypes", [room_service_1.RoomService])
], RoomController);
exports.RoomController = RoomController;
//# sourceMappingURL=room.controller.js.map