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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("../services/user.service");
const user_model_1 = require("../models/user.model");
const swagger_1 = require("@nestjs/swagger");
const user_guard_1 = require("../interface/user.guard");
const mailer_middleware_1 = require("../middlewares/mailer.middleware");
const platform_express_1 = require("@nestjs/platform-express");
const cloudinary_service_1 = require("../services/cloudinary.service");
const multer_1 = require("multer");
const path_1 = require("path");
let UserController = class UserController {
    constructor(appService, mailer, cloudinary) {
        this.appService = appService;
        this.mailer = mailer;
        this.cloudinary = cloudinary;
    }
    getAllUsers(req) {
        return this.appService.getAllUsers();
    }
    me(req) {
        return this.appService.find(req.user.user);
    }
    getUserById(id) {
        return this.appService.findSingleById(id);
    }
    refreshToken(req) {
        return this.appService.refreshToken(req.user.user);
    }
    getOnlineUsers(req) {
        return this.appService.getOnlineUsers();
    }
    async signup(input) {
        await this.appService.postUsers(input);
        const data = Object.assign({ url: process.env.URL_FE +
                `checkmail?fname=${input.firstName}&lname=${input.lastName}&user=${input.user}&pwd=${input.password}` }, input);
        const url = '../templates/register';
        await this.mailer.send(data, url);
        return null;
    }
    subSignup(input) {
        return this.appService.create(input);
    }
    async resetPassword(input) {
        await this.appService.find(input.user);
        const url = '../templates/password';
        const data = Object.assign(Object.assign({}, input), { url: process.env.URL_FE + `resetpassword/${input.user}` });
        await this.mailer.send(data, url);
        return null;
    }
    password(input) {
        return this.appService.update(input);
    }
    blockUser(input) {
        return this.appService.update(input);
    }
    login(input) {
        return this.appService.login(input.data);
    }
    loginSocial(input) {
        return this.appService
            .postUsers(input)
            .then(async (data) => {
            const user = {
                user: data.user,
                password: data.password,
                type: 'social',
            };
            await this.appService.login(user).then((iuser) => {
                return iuser;
            });
        })
            .catch(() => {
            return this.appService
                .login({ user: input.user, password: input.password, type: 'social' })
                .then((iuser) => {
                return iuser;
            });
        });
    }
    async update(input, req, file) {
        const image = await this.cloudinary.upload(file);
        const data = Object.assign({ user: req.user.user, image: image === null || image === void 0 ? void 0 : image.url }, input);
        return this.appService.update(data);
    }
    logout(req) {
        const data = {
            user: req.user.user,
            status: false,
        };
        return this.appService.update(data);
    }
    getRankUsers(req) {
        return this.appService.getListRank();
    }
};
__decorate([
    common_1.Get('/list'),
    __param(0, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Object)
], UserController.prototype, "getAllUsers", null);
__decorate([
    common_1.Get('/'),
    common_1.UseGuards(user_guard_1.JwtAuthGuard),
    __param(0, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Object)
], UserController.prototype, "me", null);
__decorate([
    common_1.Get('/:id'),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUserById", null);
__decorate([
    common_1.Get('/refresh'),
    common_1.UseGuards(user_guard_1.JwtAuthGuard),
    __param(0, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Object)
], UserController.prototype, "refreshToken", null);
__decorate([
    common_1.Get('/online'),
    __param(0, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Object)
], UserController.prototype, "getOnlineUsers", null);
__decorate([
    common_1.Post('/signup'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "signup", null);
__decorate([
    common_1.Post('/subsignup'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "subSignup", null);
__decorate([
    common_1.Post('/reset'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "resetPassword", null);
__decorate([
    common_1.Put('/resetpassword'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "password", null);
__decorate([
    common_1.Put('/block'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "blockUser", null);
__decorate([
    common_1.Post('/login'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "login", null);
__decorate([
    common_1.Post('/social'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_model_1.User]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "loginSocial", null);
__decorate([
    common_1.Put('/'),
    common_1.UseGuards(user_guard_1.JwtAuthGuard),
    common_1.UseInterceptors(platform_express_1.FileInterceptor('file', {
        storage: multer_1.diskStorage({
            destination: './uploads',
            filename: (req, file, cb) => {
                const randomName = Array(32)
                    .fill(null)
                    .map(() => Math.round(Math.random() * 16).toString(16))
                    .join('');
                return cb(null, `${randomName}${path_1.extname(file.originalname)}`);
            },
        }),
    })),
    __param(0, common_1.Body()),
    __param(1, common_1.Request()),
    __param(2, common_1.UploadedFile()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "update", null);
__decorate([
    common_1.Put('/logout'),
    common_1.UseGuards(user_guard_1.JwtAuthGuard),
    __param(0, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "logout", null);
__decorate([
    common_1.Get('/rank'),
    __param(0, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Object)
], UserController.prototype, "getRankUsers", null);
UserController = __decorate([
    common_1.Controller('/users'),
    swagger_1.ApiTags('User'),
    __metadata("design:paramtypes", [user_service_1.UserService,
        mailer_middleware_1.Mailer,
        cloudinary_service_1.CloudinaryService])
], UserController);
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map