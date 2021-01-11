import { Document } from 'mongoose';
export declare type IUser = User & Document;
export declare class User {
    user: string;
    password: string;
    name: string;
    role: string;
    image: string;
    status: boolean;
    totalMatch: number;
    wins: number;
    cups: number;
    block: boolean;
    comparePassword: ComparePasswordFunction;
}
declare type ComparePasswordFunction = (this: IUser, candidatePassword: string, cb?: (err: any, isMatch: any) => {}) => void;
export declare const userSchema: import("mongoose").Schema<any>;
export {};
