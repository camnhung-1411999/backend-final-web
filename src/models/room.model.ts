import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from './user.model';
import { ApiProperty } from '@nestjs/swagger';

export type IRoom = Room & mongoose.Document;

  @Schema()
  export class Room {
    @Prop({ type: String, ref: User.name })
    @ApiProperty()
    player1: string;

    @Prop({ type: String, ref: User.name })
    @ApiProperty()
    player2: string;

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
    chat: {username, message}[];
  }

export const roomSchema = SchemaFactory.createForClass(Room);
