import * as mongoose from 'mongoose';
export declare type IHistory = History & mongoose.Document;
export declare class History {
    roomId: string;
    result: [];
    winner: string;
    loser: string;
    datetime: string;
    chat: [];
}
export declare const historySchema: mongoose.Schema<any>;
