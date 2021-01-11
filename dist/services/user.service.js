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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const user_model_1 = require("../models/user.model");
const mongoose_2 = require("mongoose");
const jwt_1 = require("@nestjs/jwt");
let UserService = class UserService {
    constructor(userModel, jwtService) {
        this.userModel = userModel;
        this.jwtService = jwtService;
    }
    async find(user) {
        const iuser = await this.userModel.findOne({
            user,
        });
        if (!iuser) {
            throw new common_1.HttpException('User not found.', common_1.HttpStatus.UNAUTHORIZED);
        }
        return iuser;
    }
    async postUsers(input) {
        const user = await this.userModel.findOne({
            user: input.user,
        });
        if (user) {
            throw new common_1.HttpException({
                status: 409,
                error: 'USER_EXIST',
            }, 409);
        }
        return user;
    }
    async create(input) {
        const user = await this.userModel.findOne({
            user: input.user,
        });
        if (user) {
            throw new common_1.HttpException({
                status: 409,
                error: 'USER_EXIST',
            }, 409);
        }
        const createdUser = new this.userModel({
            user: input.user,
            password: input.password,
            name: input.name,
            role: input.role,
            totalMatch: input.totalMatch ? input.totalMatch : 0,
            wins: input.wins ? input.wins : 0,
            cups: input.cups ? input.cups : 0,
            status: false,
            image: null,
            block: false,
        });
        await createdUser.save();
        return createdUser;
    }
    async login(input) {
        const find = await this.userModel.findOne({
            user: input.user,
        });
        if (!find) {
            throw new common_1.HttpException({
                status: 404,
                error: 'USER_NOT_FOUND',
            }, 404);
        }
        if (find.block) {
            throw new common_1.HttpException({
                status: 404,
                error: 'ACCOUNT_HAS_BEEN_BLOCKED',
            }, 404);
        }
        let token;
        if (input.password) {
            if (!input.type) {
                const isMatch = await find.comparePassword(input.password);
                if (!isMatch) {
                    throw new common_1.HttpException({
                        status: 422,
                        error: 'PASSWORD_NOT_MATCH',
                    }, 422);
                }
            }
            find.status = true;
            find.password = input.password;
            await find.save();
            const payload = { user: input.user };
            const optionAccess = {
                expiresIn: '2h'
            };
            const optionRefresh = {
                expiresIn: '10day'
            };
            return {
                name: find.name,
                user: find.user,
                image: find.image,
                role: find.role,
                block: find.block,
                accessToken: this.jwtService.sign(payload, optionAccess),
                refreshToken: this.jwtService.sign(payload, optionRefresh),
            };
        }
        else {
            throw new common_1.HttpException({
                status: 422,
                error: 'PASSWORD_NOT_FOUND',
            }, 422);
        }
    }
    async refreshToken(input) {
        const find = await this.userModel.findOne({
            user: input,
        });
        if (!find) {
            throw new common_1.HttpException({
                status: 404,
                error: 'USER_NOT_FOUND',
            }, 404);
        }
        const payload = { user: input };
        const optionAccess = {
            expiresIn: '2h'
        };
        const optionRefresh = {
            expiresIn: '10day'
        };
        return {
            name: find.name,
            user: find.user,
            image: find.image,
            role: find.role,
            block: find.block,
            accessToken: this.jwtService.sign(payload, optionAccess),
            refreshToken: this.jwtService.sign(payload, optionRefresh),
        };
    }
    async update(input) {
        const iuser = await this.userModel.findOne({
            user: input.user,
        });
        if (!iuser) {
            throw new common_1.HttpException({
                status: 404,
                error: 'USER_NOT_FOUND',
            }, 404);
        }
        if (input.password) {
            if (input.oldPassword) {
                const isMatch = await iuser.comparePassword(input.oldPassword);
                if (!isMatch) {
                    throw new common_1.HttpException({
                        status: 422,
                        error: 'PASSWORD_NOT_MATCH',
                    }, 422);
                }
            }
            iuser.password = input.password;
            await iuser.save();
            return iuser;
        }
        const data = {
            status: input.name || input.role ? iuser.status : input.status,
            role: input.role ? input.role : iuser.role,
            name: input.name ? input.name : iuser.name,
            totalMatch: input.totalMatch ? input.totalMatch : iuser.totalMatch,
            wins: input.wins ? input.wins : iuser.wins,
            cups: input.cups ? input.cups : iuser.cups,
            image: input.image ? input.image : iuser.image,
            block: (input.block !== null) ? input.block : iuser.block,
        };
        const result = await this.userModel.findOneAndUpdate({
            user: input.user,
        }, data, {
            new: true,
        });
        return result;
    }
    async getOnlineUsers() {
        const users = await this.userModel.find();
        let usersOnline = users
            .filter((user) => user.status && user.role === 'user')
            .map((user) => ({
            username: user.user,
            name: user.name,
            image: user.image,
        }));
        return usersOnline;
    }
    async getAllUsers() {
        const users = await this.userModel.find();
        const listUser = users.filter((user) => user.role === 'user');
        return listUser;
    }
    async getListRank() {
        const users = await this.userModel.find();
        const listUser = users
            .filter((user) => user.role === 'user')
            .map((user) => ({ name: user.name, image: user.image, cups: user.cups }))
            .sort((user1, user2) => user2.cups - user1.cups);
        return listUser;
    }
    async findSingleById(id) {
        const find = await this.userModel.findOne({
            _id: id,
        });
        if (!find) {
            throw new common_1.HttpException({
                status: 404,
                error: 'USER_NOT_FOUND',
            }, 404);
        }
        else {
            return find;
        }
    }
};
UserService = __decorate([
    common_1.Injectable(),
    __param(0, mongoose_1.InjectModel(user_model_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        jwt_1.JwtService])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map