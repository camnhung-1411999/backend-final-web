import { IHistory, History } from '../models/history.model';
import { Model } from 'mongoose';
export declare class HistoryService {
    private readonly historyModel;
    constructor(historyModel: Model<IHistory>);
    listAll(): Promise<IHistory[]>;
    create(input: History): Promise<IHistory>;
    findByUsername(input: string): Promise<IHistory[]>;
    findSingByID(input: string): Promise<IHistory>;
}
