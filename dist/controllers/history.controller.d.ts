import { HistoryService } from '../services/history.service';
import { History } from '../models/history.model';
export declare class HistoryController {
    private readonly appService;
    constructor(appService: HistoryService);
    listAll(req: any): any;
    listByUser(req: any): Promise<import("../models/history.model").IHistory[]>;
    findSingByRoomID(_id: string): Promise<import("../models/history.model").IHistory>;
    create(input: History): Promise<History>;
}
