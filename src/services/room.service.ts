import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IRoom, Room } from '../models/room.model';
import { Model } from 'mongoose';
import { IUser, User } from '../models/user.model';

@Injectable()
export class RoomService {
  constructor(
    @InjectModel(Room.name)
    private readonly roomModel: Model<IRoom>,
    @InjectModel(User.name) private readonly userModel: Model<IUser>,

  ) {}

  async list() {
    return this.roomModel.find({isPlay: true});
  }

  async getRoom(id: string) {
    const room = await this.roomModel.findOne({
      idroom:id
    });
    if (!room) {
      throw new HttpException(
        {
          status: 404,
          error: 'ROOM_NOT_FOUND',
        },
        404,
      );
    }
    return room;
  }

  async create(input: any) {
    const player1 = await this.userModel.findOne({user: input.player1});
    if(player1) {
      const createRoom = new this.roomModel({
        player1: { "avatar": player1.image, "username": player1.user, "display_name": player1.name },
        player2: input.player2,
        viewers: input.viewers,
        public: input.public,
        password: input.password,
        viewer: [],
        chat: [],
        isPlay: true,
      });
      await createRoom.save();
      createRoom.idroom = createRoom.id.slice(19, createRoom.id.length);
      await createRoom.save();
      return createRoom;
    }

  }

  async join(input: any) {
    const iroom = await this.roomModel.findOne({
      idroom: input.idroom,
    });
    if (!iroom || iroom.password != input.password) {
      throw new HttpException(
        {
          status: 404,
          error: 'ROOM_NOT_FOUND',
        },
        404,
      );
    }
    if (iroom.player1 !== null) {
      if (iroom.player2 !== null) {
        iroom.viewers = [
          ...iroom.viewers,
          input.player,
        ];
      } else {
        iroom.player2 = input.player;
      }
    } else {
      iroom.player1 = input.player;
    }
    await iroom.save();
    return iroom;
  }

  async outRoom(input: any) {
    const iroom = await this.roomModel.findOne({
      idroom: input.idroom,
    });
    if (!iroom) {
      throw new HttpException(
        {
          status: 404,
          error: 'ROOM_NOT_FOUND',
        },
        404,
      );
    }
    if(iroom.player1 === input.player) {
        iroom.player1 = null;
    }
    else {
        iroom.player2 = null;
    }
    await iroom.save();
    if (iroom.player1 === null && iroom.player2 === null) {
        await this.roomModel.findOneAndDelete({
            idroom: input.idroom,
        })
    }
    return iroom;
  }
}
