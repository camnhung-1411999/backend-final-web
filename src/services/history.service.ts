import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IHistory, History } from '../models/history.model';
import { IUser, User } from '../models/user.model';
import { Model } from 'mongoose';
import * as moment from 'moment';

@Injectable()
export class HistoryService {
    constructor(
        @InjectModel(History.name)
        private readonly historyModel: Model<IHistory>,

        @InjectModel(User.name)
        private readonly userModel: Model<IUser>,
    ) { }

    async listAll() {
        return this.historyModel.find();
    }


    async findByUsername(input: string) {
        let username = input;
        const histories = await this.historyModel.find({ $or: [{ winner: username }, { loser: username }]});
        return histories;

    }

    async findByID(input: string) {
        let _id = input;
        const history = await this.historyModel.findOne({_id});
        return history;

    }

}