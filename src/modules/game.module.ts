import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GameService } from '../services/game.service';
import { Game, gameSchema } from '../models/game.model';

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
  providers: [GameService],
})
export class GameModule {}
