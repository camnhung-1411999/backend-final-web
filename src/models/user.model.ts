import * as bcrypt from 'bcrypt';
import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type IUser = User & Document;

  @Schema()
  export class User {
    @Prop()
    @ApiProperty()
    user: string;

    @Prop()
    @ApiProperty()
    password: string;

    @Prop()
    @ApiProperty()
    name: string;

    @Prop()
    @ApiProperty()
    role: string;

    @Prop()
    @ApiProperty()
    image: string;

    @Prop()
    @ApiProperty()
    status: boolean;

    @Prop()
    @ApiProperty()
    totalMatch: number;

    @Prop()
    @ApiProperty()
    wins: number;

    @Prop()
    @ApiProperty()
    cups: number;

    comparePassword: ComparePasswordFunction;
  }

type ComparePasswordFunction = (
  this: IUser,
  candidatePassword: string,
  // eslint-disable-next-line @typescript-eslint/ban-types
  cb?: (err: any, isMatch: any) => {},
) => void;

export const userSchema = SchemaFactory.createForClass(User);

const comparePassword: ComparePasswordFunction = async function (
  this: IUser,
  candidatePassword,
) {
  const result = await bcrypt.compare(candidatePassword, this.password);
  return result;
};

userSchema.methods.comparePassword = comparePassword;
