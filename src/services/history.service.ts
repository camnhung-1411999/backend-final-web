import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IHistory, History } from '../models/history.model';
import { Model } from 'mongoose';
import * as moment from 'moment';

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
        const createdDate = moment(Date.now()).format("DD-MM-YYYY HH:mm:ss");
        console.log('create history data',input);
        // haven't handle input exist roomid
        const createHistory = new this.historyModel({
            roomId: input.roomId,
            result: input.result,
            winner: input.winner,
            loser: input.loser,
            datetime: createdDate,
            chat: input.chat,

        });
        await createHistory.save();
        return createHistory;
    }

    async findByUsername(input: string) {
        let username = input;
        const histories = await this.historyModel.find({ $or: [{ winner: username }, { loser: username }]});
    console.log(histories);
        return histories;

    }

    async findSingByID(input: string) {
        let _id = input;
        const history = await this.historyModel.findOne({_id});
        return history;

    }

}