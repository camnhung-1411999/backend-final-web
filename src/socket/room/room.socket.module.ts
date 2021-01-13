import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Game, gameSchema } from '../../models/game.model';
import { RoomSocketGateway } from './room.socket.gateway';
import { Room, roomSchema } from '../../models/room.model';
import { User, userSchema } from '../../models/user.model';
import { History, historySchema } from '../../models/history.model';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Game.name,
        useFactory: () => {
          return gameSchema;
        },
      },
      {
        name: Room.name,
        useFactory: () => {
          return roomSchema;
        },
      },
      {
        name: User.name,
        useFactory: () => {
          return userSchema;
        },
      },
      {
        name: History.name,
        useFactory: () => {
          return historySchema;
        },
      },
    ]),
  ],
  controllers: [],
  providers: [RoomSocketGateway],
})
export class RoomSocketModule {}
