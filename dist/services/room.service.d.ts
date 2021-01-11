import { IRoom } from '../models/room.model';
import { Model } from 'mongoose';
import { IUser } from '../models/user.model';
export declare class RoomService {
    private readonly roomModel;
    private readonly userModel;
    constructor(roomModel: Model<IRoom>, userModel: Model<IUser>);
    list(): Promise<IRoom[]>;
    getRoom(id: string): Promise<IRoom>;
    create(input: any): Promise<IRoom>;
    join(input: any): Promise<IRoom>;
    outRoom(input: any): Promise<IRoom>;
}
