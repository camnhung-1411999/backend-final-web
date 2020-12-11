import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HistoryController } from '../controllers/history.controller';
import { HistoryService } from '../services/history.service';
import { History, historySchema } from '../models/history.model';

@Module({
    imports: [MongooseModule.forFeatureAsync([
        {
            name: History.name,
            useFactory: () => {
                return historySchema;
            }
        }]),
],
controllers: [HistoryController],
providers: [HistoryService],
})
export class HistoryModule {}