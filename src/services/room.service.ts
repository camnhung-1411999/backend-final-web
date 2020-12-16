import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IRoom, Room } from '../models/room.model';
import { Model } from 'mongoose';

@Injectable()
export class RoomService {
  constructor(
    @InjectModel(Room.name)
    private readonly roomModel: Model<IRoom>,
  ) {}

  async list() {
    return this.roomModel.find();
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

  async create(input: Room) {
    const irooms = await this.roomModel.find();
    const idroom = irooms.length + 1000 + '';
    const createRoom = new this.roomModel({
      player1: input.player1,
      player2: input.player2,
      idroom,
    });
    await createRoom.save();
    return createRoom;
  }

  async join(input: any) {
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
    if (iroom.player1 !== null) {
      if (iroom.player2 !== null) {
        throw new HttpException(
          {
            status: 422,
            error: 'ROOM_FULL',
          },
          422,
        );
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
