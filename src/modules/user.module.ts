// import { Module } from '@nestjs/common';
import {MiddlewareConsumer, Module, NestModule, RequestMethod} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from '../controllers/user.controller';
import { UserService } from '../services/user.service';
import { User, userSchema } from '../models/user.model';
import { Auth, authSchema } from '../models/auth.model';
import * as bcrypt from 'bcrypt';
// import { AuthService } from '../services/auth.service'
// import {AuthMiddleware} from '../middlewares/auth.middleware';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../utils/constant';
// import { LocalStrategy } from '../middlewares/local.strategy';
import { JwtStrategy } from '../middlewares/auth.middleware';
import {LocalAuthGuard} from '../interface/auth.guard';
import { JwtAuthGuard} from '../interface//user.guard';
import { Mailer } from '../middlewares/mailer.middleware';
import { CloudinaryProvider} from '../utils/cloudinary.provider';
import { CloudinaryService } from '../services/cloudinary.service';
@Module({
  imports: [MongooseModule.forFeatureAsync([{
      name: User.name,
      useFactory: () => {
        const schema = userSchema;
        schema.pre('save', function save(this: any, next: any) {
            const user = this;
            if (!user.password) {
              return next();
            }
            bcrypt.genSalt(10, (err, salt) => {
              if (err) {
                return next(err);
              }
              bcrypt.hash(user.password, salt, (Err, hash) => {
                if (Err) {
                  return next(Err);
                }
                user.password = hash;
                next();
              });
            });
          });
        return schema;
      },
    },
    {
      name: Auth.name,
      useFactory: () => {
        return authSchema;
      }
    }]),
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '2h' },
    }),
  ],
  controllers: [UserController],
  providers: [UserService, JwtStrategy, JwtAuthGuard, LocalAuthGuard, Mailer, CloudinaryService, CloudinaryProvider],
  exports: [CloudinaryProvider, CloudinaryService],
})
export class UserModule {}
