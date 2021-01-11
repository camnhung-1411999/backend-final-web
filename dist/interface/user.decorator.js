"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deUser = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("../utils/jwt");
exports.deUser = common_1.createParamDecorator(async (data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    const authHeaders = request.headers.authorization;
    const token = authHeaders.split(' ')[1];
    const decoded = await jwt_1.default.verifyJWT(token);
    return decoded.user;
});
//# sourceMappingURL=user.decorator.js.map