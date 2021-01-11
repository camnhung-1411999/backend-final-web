import { RoomService } from '../services/room.service';
import { Room } from '../models/room.model';
export declare class RoomController {
    private readonly appService;
    constructor(appService: RoomService);
    list(req: any): any;
    getRoom(idroom: string, req: any): any;
    create(req: any, input: any): Promise<Room>;
    join(idroom: string, req: any, input: any): Promise<any>;
    out(idroom: string, req: any): Promise<any>;
}
