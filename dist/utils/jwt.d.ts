declare const authUtils: {
    generateAccessToken(user: any): Promise<string>;
    generateRefreshToken(user: any): Promise<string>;
    verifyJWT(token: string): Promise<void>;
};
export default authUtils;
