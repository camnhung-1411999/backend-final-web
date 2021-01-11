"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require("jsonwebtoken");
const jwtConfig = {
    accessTokenSecret: process.env.JWT_ACCESSTOKEN_SECRET || '2155B3A7378B76C15A33932859D6F',
    refreshTokenSecret: process.env.JWT_REFRESHTOKEN_SECRET || '11EC248BF9C2CF4AEAC958724EB4B',
    issuer: process.env.JWT_ISSUER || '6AC3E9A78E316',
    audience: process.env.JWT_AUDIENCE || 'B55EF41518AED',
};
const authUtils = {
    async generateAccessToken(user) {
        return jwt.sign({ user: user || '' }, jwtConfig.accessTokenSecret, {
            subject: user.id || '',
            audience: jwtConfig.audience,
            issuer: jwtConfig.issuer,
            expiresIn: '2d',
        });
    },
    async generateRefreshToken(user) {
        return jwt.sign({ user: user || '' }, jwtConfig.refreshTokenSecret, {
            subject: user.id || '',
            audience: jwtConfig.audience,
            issuer: jwtConfig.issuer,
            expiresIn: '5d',
        });
    },
    async verifyJWT(token) {
        return jwt.verify(token, jwtConfig.accessTokenSecret, (err, user) => {
            if (err) {
                throw err;
            }
            return user;
        });
    },
};
exports.default = authUtils;
//# sourceMappingURL=jwt.js.map