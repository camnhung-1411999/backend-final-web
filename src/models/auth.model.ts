import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from './user.model';

export type IAuth = Auth & mongoose.Document;

  @Schema()
  export class Auth {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
    user: string;

    @Prop()
    accessToken: string;

    @Prop()
    refreshToken: string;

    @Prop()
    kind: string;
  }

export const authSchema = SchemaFactory.createForClass(Auth);
