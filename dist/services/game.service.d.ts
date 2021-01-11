import { IGame, Game } from '../models/game.model';
import { Model } from 'mongoose';
export declare class GameService {
    private readonly gameModel;
    constructor(gameModel: Model<IGame>);
    listAll(): Promise<IGame[]>;
    create(input: Game): Promise<IGame>;
    findByUsername(input: string): Promise<IGame[]>;
    findSingByID(input: string): Promise<IGame>;
    sendMessage(roomId: string, message: any): Promise<void>;
}
