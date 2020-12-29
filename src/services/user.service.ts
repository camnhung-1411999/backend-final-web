import { HttpException, Injectable, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IUser, User } from '../models/user.model';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<IUser>,

    private jwtService: JwtService,
  ) {}
  async find(user: string) {
    const iuser = await this.userModel.findOne({
      user,
    });
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
      throw new HttpException(
        {
          status: 409,
          error: 'USER_EXIST',
        },
        409,
      );
    }
    return user;
  }

  async create(input: User) {
    const user = await this.userModel.findOne({
      user: input.user,
    });
    if (user) {
      throw new HttpException(
        {
          status: 409,
          error: 'USER_EXIST',
        },
        409,
      );
    }

    const createdUser = new this.userModel({
      user: input.user,
      password: input.password,
      name: input.name,
      role: input.role,
      totalMatch: input.totalMatch ? input.totalMatch : 0,
      wins: input.wins ? input.wins : 0,
      cups: input.cups ? input.cups : 0,
      status: false,
      image: null,
    });
    await createdUser.save();

    return createdUser;
  }

  async login(input: any) {
    const find = await this.userModel.findOne({
      user: input.user,
    });
    if (!find) {
      throw new HttpException(
        {
          status: 404,
          error: 'USER_NOT_FOUND',
        },
        404,
      );
    }
    let token: any;

    if (input.password) {
      if (!input.type) {
        const isMatch: any = await find.comparePassword(input.password);

        if (!isMatch) {
          throw new HttpException(
            {
              status: 422,
              error: 'PASSWORD_NOT_MATCH',
            },
            422,
          );
        }
      }
      find.status = true;
      find.password = input.password;
      await find.save();
      const payload = { user: input.user };

      return {
        name: find.name,
        user: find.user,
        image: find.image,
        accessToken: this.jwtService.sign(payload),
        refreshToken: this.jwtService.sign(payload),
      };
      // return this.authModel.findOne(
      //   { user: find.id }
      // ).then(async (existingUser: IAuth | null) => {
      //   if (existingUser) {
      //     token = await this.authModel.findOneAndUpdate(
      //       { user: find.id },
      //       authToken
      //     );
      //   } else {
      //     token = await this.authModel.create({
      //       user: find.id,
      //       ...authToken,
      //     });
      //   }

      //   return {
      //     user: find.user,
      //     name: find.name,
      //     accessToken: token.accessToken,
      //     refreshToken: token.refreshToken,
      //   };
      // }
      // );
    } else {
      throw new HttpException(
        {
          status: 422,
          error: 'PASSWORD_NOT_FOUND',
        },
        422,
      );
    }
  }

  async update(input: any) {
    const iuser = await this.userModel.findOne({
      user: input.user,
    });

    if (!iuser) {
      throw new HttpException(
        {
          status: 404,
          error: 'USER_NOT_FOUND',
        },
        404,
      );
    }
    if (input.password) {
      if (input.oldPassword) {
        const isMatch: any = await iuser.comparePassword(input.oldPassword);
        if (!isMatch) {
          throw new HttpException(
            {
              status: 422,
              error: 'PASSWORD_NOT_MATCH',
            },
            422,
          );
        }
      }
      iuser.password = input.password;
      await iuser.save();
      return iuser;
    }
    const data = {
      status: input.name || input.role ? iuser.status : input.status,
      role: input.role ? input.role : iuser.role,
      name: input.name ? input.name : iuser.name,
      totalMatch: input.totalMatch ? input.totalMatch : iuser.totalMatch,
      wins: input.wins ? input.wins : iuser.wins,
      cups: input.cups ? input.cups : iuser.cups,
      image: input.image ? input.image : iuser.image,
    };
    const result = await this.userModel.findOneAndUpdate(
      {
        user: input.user,
      },
      data,
      {
        new: true,
      },
    );
    return result;
  }

  async getOnlineUsers() {
    const users = await this.userModel.find();
    let usersOnline = users
      .filter((user) => user.status && user.role === 'user')
      .map((user) => ({
        username: user.user,
        name: user.name,
        image: user.image,
      }));
    return usersOnline;
  }

  async getAllUsers() {
    const users = await this.userModel.find();
    const listUser = users.filter((user) => user.role === 'user');

    return listUser;
  }

  async getListRank() {
    const users = await this.userModel.find();
    const listUser = users
      .filter((user) => user.role === 'user')
      .map((user) => ({ name: user.name, image: user.image, cups: user.cups }))
      .sort((user1, user2) => user2.cups - user1.cups);
    return listUser;
  }
}
