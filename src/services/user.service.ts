import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IUser, User } from '../models/user.model';
import { IAuth, Auth} from '../models/auth.model';
import { Model } from 'mongoose';
import authUtils from '../utils/auth';

@Injectable()
export class UserService {
  constructor(
  @InjectModel(User.name)
  private readonly userModel: Model<IUser>,

  @InjectModel(Auth.name)
  private readonly authModel: Model<IAuth>

  ){}
  async getUsers() {
    const output = await this.userModel.find();
    return output;
  }

  async postUsers(input: User) {
    const output = await this.userModel.create(input);
    return output;
  }

  async login(input: any) {
    const find = await this.userModel.findOne({
      user: input.user,
    });
    if(!find) {
      const error = {
        name: 'ERROR',
        message: 'USER_NOT_FOUND'
      }
      throw error;
    }
    let token: any;
    if (input.password) {
      const isMatch: any = await find.comparePassword(input.password)
      console.log(isMatch)
      if (!isMatch) {
        const err: Error = new Error();
        err.message = "NOT_MATCH";
        err.name = "Error";
        throw err;
      }
    }
    // Create Token
    const newAccessToken = await authUtils.generateAccessToken(input);
    const newRefreshToken = await authUtils.generateRefreshToken(input);

    const authToken = {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      kind: "",
    };
    return this.authModel.findOne(
      { user: find.id }
    ).then( async (existingUser: IAuth | null) => {
        if (existingUser) {
          token = await this.authModel.findOneAndUpdate(
            { user: find.id },
            authToken
          );
        } else {
          token = await this.authModel.create({
            user: find.id,
            ...authToken,
          });
        }
        return {
          user: find.user,
          name: find.name,
          accessToken: token.accessToken,
          refreshToken: token.refreshToken,
        };
      }
    );
  }
}
