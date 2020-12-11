import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './modules/user.module';
import { RoomModule } from './modules/room.module';

@Module({
  imports: [
    MongooseModule.forRoot("mongodb+srv://camnhung:camnhung123@cluster0.wj4cd.mongodb.net/FinalWeb?retryWrites=true&w=majority"),
    UserModule,
    RoomModule,
  ],
})
export class AppModule {}
