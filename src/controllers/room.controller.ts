import { Body, Controller, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { RoomService } from '../services/room.service';
import { Room } from '../models/room.model';
import { ApiTags } from '@nestjs/swagger';
import { RoomInput } from '../interface/room.interface';
import { deUser } from '../interface/user.decorator';
@Controller('/rooms')
@ApiTags('Room')
export class RoomController {
  constructor(private readonly appService: RoomService) {}

  @Get()
  list(): any {
    return this.appService.list();
  }

  @Get('/:id')
  getRoom(@Param('id') idroom: string): any {
    return this.appService.getRoom(idroom);
  }


  @Post('/create')
  create(@deUser() username: string): Promise<Room> {
    const data = {
        player1: username,
        player2: null,
        idroom: null,
    }
    return this.appService.create(data);
  }

  @Put('/join/:id')
  join(@Param('id') idroom: string, @deUser() username: string): Promise<any> {
    const data = {
        idroom,
        player: username,
    }
    return this.appService.join(data);
  }

  @Put('/out/:id')
  out(@Param('id') idroom: string,@deUser() username: string): Promise<any> {
    const data = {
        idroom,
        player: username,
    }
    return this.appService.outRoom(data);
  }
}