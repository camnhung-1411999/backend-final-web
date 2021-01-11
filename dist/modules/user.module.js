"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const user_controller_1 = require("../controllers/user.controller");
const user_service_1 = require("../services/user.service");
const user_model_1 = require("../models/user.model");
const auth_model_1 = require("../models/auth.model");
const bcrypt = require("bcrypt");
const passport_1 = require("@nestjs/passport");
const jwt_1 = require("@nestjs/jwt");
const constant_1 = require("../utils/constant");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const auth_guard_1 = require("../interface/auth.guard");
const user_guard_1 = require("../interface//user.guard");
const mailer_middleware_1 = require("../middlewares/mailer.middleware");
const cloudinary_provider_1 = require("../utils/cloudinary.provider");
const cloudinary_service_1 = require("../services/cloudinary.service");
let UserModule = class UserModule {
};
UserModule = __decorate([
    common_1.Module({
        imports: [mongoose_1.MongooseModule.forFeatureAsync([{
                    name: user_model_1.User.name,
                    useFactory: () => {
                        const schema = user_model_1.userSchema;
                        schema.pre('save', function save(next) {
                            const user = this;
                            if (!user.password) {
                                return next();
                            }
                            bcrypt.genSalt(10, (err, salt) => {
                                if (err) {
                                    return next(err);
                                }
                                bcrypt.hash(user.password, salt, (Err, hash) => {
                                    if (Err) {
                                        return next(Err);
                                    }
                                    user.password = hash;
                                    next();
                                });
                            });
                        });
                        return schema;
                    },
                }, {
                    name: auth_model_1.Auth.name,
                    useFactory: () => {
                        return auth_model_1.authSchema;
                    }
                }]), passport_1.PassportModule,
            jwt_1.JwtModule.register({
                secret: constant_1.jwtConstants.secret,
            }),],
        controllers: [user_controller_1.UserController],
        providers: [user_service_1.UserService, auth_middleware_1.JwtStrategy, user_guard_1.JwtAuthGuard, auth_guard_1.LocalAuthGuard, mailer_middleware_1.Mailer, cloudinary_service_1.CloudinaryService, cloudinary_provider_1.CloudinaryProvider],
        exports: [cloudinary_provider_1.CloudinaryProvider, cloudinary_service_1.CloudinaryService],
    })
], UserModule);
exports.UserModule = UserModule;
//# sourceMappingURL=user.module.js.map