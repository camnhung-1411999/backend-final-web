import * as mongoose from 'mongoose';
export declare type IRoom = Room & mongoose.Document;
export declare class Room {
    player1: object;
    player2: object;
    idroom: string;
    public: string;
    password: string | null;
    viewers: string[];
    chat: {
        username: any;
        message: any;
        avatar: any;
        display_name: any;
    }[];
}
export declare const roomSchema: mongoose.Schema<any>;
