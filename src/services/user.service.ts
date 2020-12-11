import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IUser, User } from '../models/user.model';
import { IAuth, Auth} from '../models/auth.model';
import { Model } from 'mongoose';
import authUtils from '../utils/auth';
import { filter } from 'lodash';

@Injectable()
export class UserService {
  constructor(
  @InjectModel(User.name)
  private readonly userModel: Model<IUser>,

  @InjectModel(Auth.name)
  private readonly authModel: Model<IAuth>

  ){}
  async getUsers() {
  }

  async postUsers(input: User) {
    const user = await this.userModel.findOne({
      user: input.user,
    });
    if (user) {
      throw new HttpException({
        status: 409,
        error: 'USER_EXIST',
      }, 409);
    }
    
    const createdUser = new this.userModel({
      user: input.user,
      password: input.password,
      name: input.name,
      role: input.role,
      status: false,
    });
    await createdUser.save();

    return createdUser;
  }

  async login(input: any) {
    const find = await this.userModel.findOne({
      user: input.data.user,
    });
    if(!find) {
      throw new HttpException({
        status: 404,
        error: 'USER_NOT_FOUND',
      }, 404);
    }
    let token: any;

    if (input.data.password) {
      const isMatch: any = await find.comparePassword(input.data.password)
      if (!isMatch) {
        throw new HttpException({
          status: 422,
          error: 'PASSWORD_NOT_MATCH',
        }, 422);
      }
    }
    find.status = true;
    await find.save();
    // Create Token
    const newAccessToken = await authUtils.generateAccessToken(input.data);
    const newRefreshToken = await authUtils.generateRefreshToken(input.data);

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

  async update(input: any) {
    const iuser = await this.userModel.findOne({
      user: input.user,
    });

    if(!iuser) {
      throw new HttpException({
        status: 404,
        error: 'USER_NOT_FOUND',
      }, 404);
    }

    iuser.status = input.status ? input.status : iuser.status;
    iuser.role = input.role ? input.role : iuser.role;
    iuser.name = input.name ? input.name : iuser.name;

    if (input.password) {
      const isMatch: any = await iuser.comparePassword(input.oldPassword)
      if (!isMatch) {
        throw new HttpException({
          status: 422,
          error: 'PASSWORD_NOT_MATCH',
        }, 422);
      }
      iuser.password = input.password;
    }

    await iuser.save();

    return iuser;
  }

  async getNameOnlineUsers()
  { 
    const users = await this.userModel.find();
    let usersOnline = users.filter((user) => user.status  && user.role === 'user').map((user) => user.name);
    return usersOnline;
  }

  async getAllUsers()
  { 
    const users = await this.userModel.find();
    const listUser = users.filter((user) => user.role === 'user');

    return listUser;
  }
}
