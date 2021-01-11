import { UserService } from '../services/user.service';
import { User } from '../models/user.model';
import { Mailer } from '../middlewares/mailer.middleware';
import { CloudinaryService } from '../services/cloudinary.service';
export declare class UserController {
    private readonly appService;
    private readonly mailer;
    private readonly cloudinary;
    constructor(appService: UserService, mailer: Mailer, cloudinary: CloudinaryService);
    getAllUsers(req: any): any;
    me(req: any): any;
    getUserById(id: string): Promise<User>;
    refreshToken(req: any): any;
    getOnlineUsers(req: any): any;
    signup(input: any): Promise<null>;
    subSignup(input: any): Promise<User>;
    resetPassword(input: any): Promise<null>;
    password(input: any): Promise<User>;
    blockUser(input: any): Promise<User>;
    login(input: any): Promise<any>;
    loginSocial(input: User): Promise<any>;
    update(input: any, req: any, file: any): Promise<any>;
    logout(req: any): Promise<any>;
    getRankUsers(req: any): any;
}
