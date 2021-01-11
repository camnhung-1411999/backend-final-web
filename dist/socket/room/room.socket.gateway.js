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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomSocketGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const common_1 = require("@nestjs/common");
const ws_1 = require("ws");
const mongoose_1 = require("@nestjs/mongoose");
const game_model_1 = require("../../models/game.model");
const mongoose_2 = require("mongoose");
const room_model_1 = require("../../models/room.model");
const user_model_1 = require("../../models/user.model");
let RoomSocketGateway = class RoomSocketGateway {
    constructor(gameModel, roomModel, userModel) {
        this.gameModel = gameModel;
        this.roomModel = roomModel;
        this.userModel = userModel;
        this.logger = new common_1.Logger('RoomGateway');
    }
    async joinRoom(client, payload) {
        client.join(payload.roomId);
        const room = await this.roomModel.findOne({ idroom: payload.roomId });
        if (room) {
            let data = room;
            data.chat = room.chat.map(msg => ({
                message: msg.message,
                ownl: msg.username == payload.user.user,
                avatar: msg.avatar,
                display_name: msg.display_name,
            }));
            this.server.to(`${client.id}`).emit('joinRoom', data);
        }
    }
    async handleReady(client, payload) {
        var _a, _b, _c;
        const room = await this.roomModel.findOne({ idroom: payload.roomId });
        if (room) {
            if (((_a = room.player2) === null || _a === void 0 ? void 0 : _a.username) != payload.user.user && ((_b = room.player1) === null || _b === void 0 ? void 0 : _b.username) != payload.user.user) {
                if (!((_c = room.player2) === null || _c === void 0 ? void 0 : _c.username)) {
                    room.player2 = {
                        'avatar': payload.user.image,
                        'username': payload.user.user,
                        'display_name': payload.user.name,
                    };
                }
                else {
                    room.player1 = {
                        'avatar': payload.user.image,
                        'username': payload.user.user,
                        'display_name': payload.user.name,
                    };
                }
                await room.save();
                this.server.in(payload.roomId).emit('ready', room);
            }
        }
    }
    async createGame(client, payload) {
        const room = await this.roomModel.findOne({ idroom: payload.roomId });
        if (room) {
            const game = new this.gameModel({
                roomId: room.idroom,
                player1: room.player1.username,
                player2: room.player2.username,
                board: [],
                datetime: new Date(),
                playing: true,
            });
            await game.save();
        }
    }
    leaveRoom(client, room) {
        client.leave(room);
        client.emit('leftRoom', room);
    }
    async message(client, data) {
        const room = await this.roomModel.findOne({ idroom: data.roomId });
        room.chat.push({
            message: data.body.message,
            username: data.body.username,
            avatar: data.body.avatar,
            display_name: data.body.display_name,
        });
        await room.save();
        client.broadcast.in(data.roomId).emit('recievedMessage', data.body);
    }
    confirm(client, data) {
        client.emit('success');
    }
    play(client, payload) {
        client.to(payload.roomId).emit('play', payload);
    }
    afterInit(server) {
        return this.logger.log('Init');
    }
    handleDisconnect(client) {
        return this.logger.log(`Client disconnected: ${client.id}`);
    }
    handleConnection(client) {
        return this.logger.log(`Client connected: ${client.id}`);
    }
};
__decorate([
    websockets_1.WebSocketServer(),
    __metadata("design:type", typeof (_a = typeof ws_1.Server !== "undefined" && ws_1.Server) === "function" ? _a : Object)
], RoomSocketGateway.prototype, "server", void 0);
__decorate([
    websockets_1.SubscribeMessage('joinRoom'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], RoomSocketGateway.prototype, "joinRoom", null);
__decorate([
    websockets_1.SubscribeMessage('ready'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], RoomSocketGateway.prototype, "handleReady", null);
__decorate([
    websockets_1.SubscribeMessage('playGame'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], RoomSocketGateway.prototype, "createGame", null);
__decorate([
    websockets_1.SubscribeMessage('leaveRoom'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], RoomSocketGateway.prototype, "leaveRoom", null);
__decorate([
    websockets_1.SubscribeMessage('sendMessage'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], RoomSocketGateway.prototype, "message", null);
__decorate([
    websockets_1.SubscribeMessage('confirm'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], RoomSocketGateway.prototype, "confirm", null);
__decorate([
    websockets_1.SubscribeMessage('play'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], RoomSocketGateway.prototype, "play", null);
RoomSocketGateway = __decorate([
    websockets_1.WebSocketGateway(),
    __param(0, mongoose_1.InjectModel(game_model_1.Game.name)),
    __param(1, mongoose_1.InjectModel(room_model_1.Room.name)),
    __param(2, mongoose_1.InjectModel(user_model_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], RoomSocketGateway);
exports.RoomSocketGateway = RoomSocketGateway;
//# sourceMappingURL=room.socket.gateway.js.map