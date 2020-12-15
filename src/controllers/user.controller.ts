import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';
import { ApiTags } from '@nestjs/swagger';

@Controller('/users')
@ApiTags('User')
export class UserController {
  constructor(private readonly appService: UserService) {}

  // @Get()
  // getUsers(): any {
  //   return this.appService.getUsers();
  // }
  
  @Get('/list')
  getAllUsers(): any {
    return this.appService.getAllUsers();
  }

  @Get('/online')
  getOnlineUsers(): any {
    return this.appService.getOnlineUsers();
  }

  @Post('/signup')
  signup(@Body() input: User): Promise<User> {
    return this.appService.postUsers(input);
  }

  @Post('/login')
  login(@Body() input: any): Promise<any> {
    return this.appService.login(input.data);
  }
  @Post('/social')
  loginSocial(@Body() input: User): Promise<any> {
    return this.appService
      .postUsers(input)
      .then(async (data) => {
        const user = {data:{user: data.user, password: data.password}}
        await this.appService.login(user).then((iuser) => {
          return iuser;
        });
      })
      .catch(async (err) => {
        const user = { data:{user: input.user, password: input.password}}
        await this.appService.login(user).then((iuser) => {
          return iuser;
        });
      });
  }

  @Put('/logout')
  update(@Body() input: any): Promise<any> {
    return this.appService.update(input);
  }


}
