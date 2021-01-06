import { Module } from '@nestjs/common';
import { UserSocketGateway } from './user.socket.gateway';

@Module({
  imports: [],
  controllers: [],
  providers: [UserSocketGateway],
})
export class UserSocketModule {}
