import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IHistory, History } from '../models/history.model';
import { Model } from 'mongoose';

@Injectable()
export class HistoryService {
    constructor(
        @InjectModel(History.name)
        private readonly historyModel: Model<IHistory>,
    ) { }

    async listAll() {
        return this.historyModel.find();
    }
    async create(input: History) {
        console.log('create history data',input);
        // haven't handle input exist roomid
        const createHistory = new this.historyModel({
            data: input.data,
            winner: input.winner,
            loser: input.loser,
            idroom: input.idroom

        });
        await createHistory.save();
        return createHistory;
    }

    async findByUsername(input: string) {
        let username = input;
        const histories = await this.historyModel.find({ $or: [{ winner: username }, { loser: username }]});
        return histories;

    }
}