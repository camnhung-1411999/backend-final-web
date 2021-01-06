import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Game, gameSchema } from 'src/models/game.model';
import { RoomSocketGateway } from './room.socket.gateway';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Game.name,
        useFactory: () => {
          return gameSchema;
        },
      },
    ]),
  ],
  controllers: [],
  providers: [RoomSocketGateway],
})
export class RoomSocketModule {}
