import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IUser, User } from '../models/user.model';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<IUser>){}
  async getUsers() {
    const output = await this.userModel.find();
    return output;
  }

  async postUsers(input: User) {
    const output = await this.userModel.create(input);
    return output;
  }
}
