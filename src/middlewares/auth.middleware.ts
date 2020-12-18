// import { HttpException } from '@nestjs/common/exceptions/http.exception';
// import { NestMiddleware, HttpStatus, Injectable } from '@nestjs/common';
// import { Request, Response, NextFunction } from 'express';
// import { UserService } from '../services/user.service';
// import jwt from '../utils/jwt';

// @Injectable()
// export class AuthMiddleware implements NestMiddleware {
//   constructor(    private readonly userModel: UserService,
//     ) {}

//   async use(req: Request, res: Response, next: NextFunction) {
//     const authHeaders = req.headers.authorization;
//     if (authHeaders && (authHeaders as string).split(' ')[1]) {
//       const token = (authHeaders as string).split(' ')[1];
//       const decoded: any = await jwt.verifyJWT(token);
//       const user = await this.userModel.find(decoded.user);

//       if (!user) {
//         throw new HttpException('User not found.', HttpStatus.UNAUTHORIZED);
//       }
//       next();

//     } else {
//       throw new HttpException('Not authorized.', HttpStatus.UNAUTHORIZED);
//     }
//   }
// }

import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from '../utils/constant';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: any) {
    return { user: payload.user };
  }
}