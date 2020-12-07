import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from '../controllers/user.controller';
import { UserService } from '../services/user.service';
import { User, userSchema } from '../models/user.model';
import { Auth, authSchema } from '../models/auth.model';
import * as bcrypt from 'bcrypt';

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
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
