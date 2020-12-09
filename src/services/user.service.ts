import { HttpException, Injectable } from '@nestjs/common';
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

  async signup(input: User) {
    await this.userModel.findOne({
      user: input.user,
    }).then((user) => {
      if (user) {
        const err: Error = new Error();
        err.message = 'USER_EXIST';
        err.name = 'Error';
        throw err;
      }
    });
    
    const createdUser = new this.userModel({
      user: input.user,
      password: input.password,
      name: input.name,
    });
    await createdUser.save();
    return createdUser;
  }


  async login(input: any) {
    const find = await this.userModel.findOne({
      user: input.user,
    });
    if(!find) {
      throw new HttpException({
        status: 404,
        error: 'USER_NOT_FOUND',
      }, 404);
    }
    let token: any;
    if (input.password) {
      const isMatch: any = await find.comparePassword(input.password)
      if (!isMatch) {
        throw new HttpException({
          status: 422,
          error: 'PASSWORD_NOT_MATCH',
        }, 422);
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
