import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Game, gameSchema } from 'src/models/game.model';
import { RoomSocketGateway } from './room.socket.gateway';
import { Room, roomSchema } from '../../models/room.model';

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
    ]),
  ],
  controllers: [],
  providers: [RoomSocketGateway],
})
export class RoomSocketModule {}
