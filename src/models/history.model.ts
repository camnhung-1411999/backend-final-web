import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from './user.model';
import { Room } from './room.model';
import { ApiProperty } from '@nestjs/swagger';

export type IHistory = History & mongoose.Document;
@Schema()
export class History {
    @Prop()
    @ApiProperty()
    result: [];

    @Prop({type: String, ref: User.name})
    @ApiProperty()
    winner: string;

    @Prop({type: String, ref: User.name})
    @ApiProperty()
    loser: string;

    @Prop()
    @ApiProperty()
    datetime: string;

    @Prop()
    @ApiProperty()
    chat: [];


}
export const historySchema = SchemaFactory.createForClass(History);