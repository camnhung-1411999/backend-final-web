import * as mongoose from 'mongoose';
export declare type IGame = Game & mongoose.Document;
export declare class Game {
    roomId: string;
    board: [];
    player1: string;
    player2: string;
    datetime: Date;
    playing: boolean;
}
export declare const gameSchema: mongoose.Schema<any>;
