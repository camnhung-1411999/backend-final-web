"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomSocketModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const game_model_1 = require("../../models/game.model");
const room_socket_gateway_1 = require("./room.socket.gateway");
const room_model_1 = require("../../models/room.model");
const user_model_1 = require("../../models/user.model");
let RoomSocketModule = class RoomSocketModule {
};
RoomSocketModule = __decorate([
    common_1.Module({
        imports: [
            mongoose_1.MongooseModule.forFeatureAsync([
                {
                    name: game_model_1.Game.name,
                    useFactory: () => {
                        return game_model_1.gameSchema;
                    },
                },
                {
                    name: room_model_1.Room.name,
                    useFactory: () => {
                        return room_model_1.roomSchema;
                    },
                },
                {
                    name: user_model_1.User.name,
                    useFactory: () => {
                        return user_model_1.userSchema;
                    },
                },
            ]),
        ],
        controllers: [],
        providers: [room_socket_gateway_1.RoomSocketGateway],
    })
], RoomSocketModule);
exports.RoomSocketModule = RoomSocketModule;
//# sourceMappingURL=room.socket.module.js.map