"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloudinaryProvider = exports.Cloudinary = void 0;
const CloudinaryLib = require("cloudinary");
exports.Cloudinary = 'lib:cloudinary';
exports.CloudinaryProvider = {
    provide: exports.Cloudinary,
    useValue: CloudinaryLib
};
//# sourceMappingURL=cloudinary.provider.js.map