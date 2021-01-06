import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from './user.model';
import { Room } from './room.model';
import { ApiProperty } from '@nestjs/swagger';

export type IGame = Game & mongoose.Document;
@Schema()
export class Game {
    @Prop()
    @ApiProperty()
    roomId: string;

    @Prop()
    @ApiProperty()
    result: [];

    @Prop({type: String, ref: User.name})
    @ApiProperty()
    player1: string;

    @Prop({type: String, ref: User.name})
    @ApiProperty()
    player2: string;

    @Prop()
    @ApiProperty()
    datetime: string;

    @Prop()
    @ApiProperty()
    chat: [];


}
export const gameSchema = SchemaFactory.createForClass(Game);