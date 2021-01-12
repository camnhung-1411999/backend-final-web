import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from './user.model';
import { ApiProperty } from '@nestjs/swagger';

export type IRoom = Room & mongoose.Document;

  @Schema()
  export class Room {
    @Prop({ type: Object})
    @ApiProperty()
    player1: object;

    @Prop({ type: Object})
    @ApiProperty()
    player2: object;

    @Prop()
    @ApiProperty()
    idroom: string;

    @Prop()
    @ApiProperty()
    public: string;

    @Prop()
    @ApiProperty()
    password: string | null;

    @Prop()
    @ApiProperty({ type:[]})
    viewers: string[];

    @Prop()
    @ApiProperty({ type:[]})
    chat: {username, message, avatar, display_name}[];

    @Prop()
    @ApiProperty()
    isPlay: boolean;
  }

export const roomSchema = SchemaFactory.createForClass(Room);
