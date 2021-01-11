import { IUser, User } from '../models/user.model';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
export declare class UserService {
    private readonly userModel;
    private jwtService;
    constructor(userModel: Model<IUser>, jwtService: JwtService);
    find(user: string): Promise<IUser>;
    postUsers(input: User): Promise<IUser>;
    create(input: User): Promise<IUser>;
    login(input: any): Promise<{
        name: string;
        user: string;
        image: string;
        role: string;
        block: boolean;
        accessToken: string;
        refreshToken: string;
    }>;
    refreshToken(input: string): Promise<{
        name: string;
        user: string;
        image: string;
        role: string;
        block: boolean;
        accessToken: string;
        refreshToken: string;
    }>;
    update(input: any): Promise<IUser>;
    getOnlineUsers(): Promise<{
        username: string;
        name: string;
        image: string;
    }[]>;
    getAllUsers(): Promise<IUser[]>;
    getListRank(): Promise<{
        name: string;
        image: string;
        cups: number;
    }[]>;
    findSingleById(id: any): Promise<IUser>;
}
