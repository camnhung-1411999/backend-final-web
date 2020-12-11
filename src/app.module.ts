import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './modules/user.module';
<<<<<<< Updated upstream
<<<<<<< Updated upstream

=======
import { RoomModule } from './modules/room.module';
import { HistoryModule} from './modules/history.module';
>>>>>>> Stashed changes
=======
import { RoomModule } from './modules/room.module';
import { HistoryModule} from './modules/history.module';
>>>>>>> Stashed changes
@Module({
  imports: [
    MongooseModule.forRoot("mongodb+srv://camnhung:camnhung123@cluster0.wj4cd.mongodb.net/FinalWeb?retryWrites=true&w=majority"),
    UserModule,
<<<<<<< Updated upstream
=======
    RoomModule,
    HistoryModule
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
  ],
})
export class AppModule {}
