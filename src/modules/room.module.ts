import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RoomController } from '../controllers/room.controller';
import { RoomService } from '../services/room.service';
import { Room, roomSchema } from '../models/room.model';
import { UserModule } from './user.module';
@Module({
  imports: [MongooseModule.forFeatureAsync([
    {
      name: Room.name,
      useFactory: () => {
        return roomSchema;
      }
    }]),
    // UserModule,
  ],
  controllers: [RoomController],
  providers: [RoomService],
})
export class RoomModule {}
  