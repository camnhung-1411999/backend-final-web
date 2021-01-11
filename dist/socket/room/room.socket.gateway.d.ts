import { OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { Server } from 'ws';
import { IGame } from '../../models/game.model';
import { Model } from 'mongoose';
import { IRoom } from '../../models/room.model';
import { IUser } from '../../models/user.model';
export declare class RoomSocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private readonly gameModel;
    private readonly roomModel;
    private readonly userModel;
    server: Server;
    constructor(gameModel: Model<IGame>, roomModel: Model<IRoom>, userModel: Model<IUser>);
    private logger;
    joinRoom(client: Socket, payload: any): Promise<void>;
    handleReady(client: Socket, payload: any): Promise<void>;
    createGame(client: Socket, payload: any): Promise<void>;
    leaveRoom(client: Socket, room: string): void;
    message(client: Socket, data: any): Promise<void>;
    confirm(client: Socket, data: any): void;
    play(client: Socket, payload: any): void;
    afterInit(server: Server): void;
    handleDisconnect(client: Socket): void;
    handleConnection(client: Socket): void;
}
