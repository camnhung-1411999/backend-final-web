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
exports.CloudinaryService = void 0;
const common_1 = require("@nestjs/common");
const cloudinary_provider_1 = require("../utils/cloudinary.provider");
const fs = require("fs");
const util_1 = require("util");
const unlinkAsync = util_1.promisify(fs.unlink);
let CloudinaryService = class CloudinaryService {
    constructor(cloudinary) {
        this.cloudinary = cloudinary;
        this.cloudinary.v2.config({
            cloud_name: 'camnhung',
            api_key: '432754556175189',
            api_secret: '2TIXe6WJiVufXL41VhbBtYjqkgc',
        });
        this.v2 = cloudinary.v2;
    }
    async upload(file) {
        if (file) {
            const infor = await this.v2.uploader.upload(file.path);
            await unlinkAsync(file.path);
            return infor;
        }
        return null;
    }
};
CloudinaryService = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject(cloudinary_provider_1.Cloudinary)),
    __metadata("design:paramtypes", [Object])
], CloudinaryService);
exports.CloudinaryService = CloudinaryService;
//# sourceMappingURL=cloudinary.service.js.map