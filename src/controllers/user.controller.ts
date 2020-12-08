import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';
import { ApiTags } from '@nestjs/swagger';

@Controller('/users')
@ApiTags('User')
export class UserController {
  constructor(private readonly appService: UserService) {}

  @Get()
  getUsers(): any {
    return this.appService.getUsers();
  }

  @Post()
  createUser(@Body() input: User): Promise<User> {
    return this.appService.postUsers(input)
  }

  @Post('/signup')
  signup(@Body() input: User): Promise<User> {
    return this.appService.signup(input);
  }

  @Post('/login')
  login(@Body() input: any): Promise<any> {
;    return this.appService.login(input);
  }
}
