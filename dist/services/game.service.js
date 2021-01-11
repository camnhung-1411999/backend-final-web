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
exports.GameService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const game_model_1 = require("../models/game.model");
const mongoose_2 = require("mongoose");
const moment = require("moment");
let GameService = class GameService {
    constructor(gameModel) {
        this.gameModel = gameModel;
    }
    async listAll() {
        return this.gameModel.find();
    }
    async create(input) {
        const createdDate = moment(Date.now()).format('DD-MM-YYYY HH:mm:ss');
        const createGame = new this.gameModel({
            roomId: input.roomId,
            board: input.board,
            player1: input.player1,
            player2: input.player1,
            datetime: createdDate,
        });
        await createGame.save();
        return createGame;
    }
    async findByUsername(input) {
        let username = input;
        const histories = await this.gameModel.find({
            $or: [{ player1: username }, { player2: username }],
        });
        return histories;
    }
    async findSingByID(input) {
        let _id = input;
        const game = await this.gameModel.findOne({ _id });
        return game;
    }
    async sendMessage(roomId, message) { }
};
GameService = __decorate([
    common_1.Injectable(),
    __param(0, mongoose_1.InjectModel(game_model_1.Game.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], GameService);
exports.GameService = GameService;
//# sourceMappingURL=game.service.js.map