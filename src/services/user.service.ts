import { HttpException, Injectable, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IUser, User } from '../models/user.model';
import { IAuth, Auth } from '../models/auth.model';
import { Model } from 'mongoose';
import authUtils from '../utils/jwt';
import { filter } from 'lodash';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<IUser>,

    @InjectModel(Auth.name)
    private readonly authModel: Model<IAuth>

  ) { }
  async find(user: string) {
    const iuser = await this.userModel.findOne({
      user,
    })
    if (!iuser) {
      throw new HttpException('User not found.', HttpStatus.UNAUTHORIZED);
    }
    return iuser;
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
      user: input.user,
    });
    if (!find) {
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
      // Create Token
      const newAccessToken = await authUtils.generateAccessToken(find.user);
      const newRefreshToken = await authUtils.generateRefreshToken(find.user);

      const authToken = {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,  
        kind: "",
      };
      return this.authModel.findOne(
        { user: find.id }
      ).then(async (existingUser: IAuth | null) => {
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
        find.status = true;
        find.password = input.password;
        await find.save();
        return {
          user: find.user,
          name: find.name,
          accessToken: token.accessToken,
          refreshToken: token.refreshToken,
        };
      }
      );
    }
    else {
      throw new HttpException({
        status: 422,
        error: 'PASSWORD_NOT_FOUND',
      }, 422);
    }

  }

  async update(input: any) {
    const iuser = await this.userModel.findOne({
      user: input.user,
    });

    if (!iuser) {
      throw new HttpException({
        status: 404,
        error: 'USER_NOT_FOUND',
      }, 404);
    }
    if (input.password) {
      const isMatch: any = await iuser.comparePassword(input.oldPassword)
      if (!isMatch) {
        throw new HttpException({
          status: 422,
          error: 'PASSWORD_NOT_MATCH',
        }, 422);
      }
      iuser.password = input.password;
      await iuser.save();
      return iuser;
    }
    const data = {
      status: input.name || input.role ? iuser.status : input.status,
      role: input.role ? input.role : iuser.role,
      name:input.name ? input.name : iuser.name,
    }
    const result = await this.userModel.findOneAndUpdate({
      user: input.user,
    }, data,
    { 
      new: true,
    });
    return result
  }

  async getOnlineUsers() {
    const users = await this.userModel.find();
    let usersOnline = users.filter((user) => user.status && user.role === 'user').map((user) => ({username: user.user, name: user.name}));
    return usersOnline;
  }

  async getAllUsers() {
    const users = await this.userModel.find();
    const listUser = users.filter((user) => user.role === 'user');

    return listUser;
  }
}
