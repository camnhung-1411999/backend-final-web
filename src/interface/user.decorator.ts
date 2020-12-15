import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import jwt from '../utils/jwt';

export const deUser = createParamDecorator(
  async (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const authHeaders = request.headers.authorization;
    const token = (authHeaders as string).split(' ')[1];
    const decoded: any = await jwt.verifyJWT(token);
    return decoded.user;
  },
);
