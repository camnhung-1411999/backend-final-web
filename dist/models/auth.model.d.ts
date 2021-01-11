import * as mongoose from 'mongoose';
export declare type IAuth = Auth & mongoose.Document;
export declare class Auth {
    user: string;
    accessToken: string;
    refreshToken: string;
    kind: string;
}
export declare const authSchema: mongoose.Schema<any>;
