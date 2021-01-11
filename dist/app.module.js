"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const user_module_1 = require("./modules/user.module");
const room_module_1 = require("./modules/room.module");
const history_module_1 = require("./modules/history.module");
const config_1 = require("@nestjs/config");
const room_socket_module_1 = require("./socket/room/room.socket.module");
const user_socket_module_1 = require("./socket/user/user.socket.module");
const game_module_1 = require("./modules/game.module");
let AppModule = class AppModule {
};
AppModule = __decorate([
    common_1.Module({
        imports: [
            config_1.ConfigModule.forRoot(),
            mongoose_1.MongooseModule.forRoot("mongodb+srv://camnhung:camnhung123@cluster0.wj4cd.mongodb.net/FinalWeb?retryWrites=true&w=majority"),
            user_module_1.UserModule,
            room_module_1.RoomModule,
            history_module_1.HistoryModule,
            room_socket_module_1.RoomSocketModule,
            user_socket_module_1.UserSocketModule,
            game_module_1.GameModule
        ],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map