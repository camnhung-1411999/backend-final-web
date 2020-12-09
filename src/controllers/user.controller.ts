import { Body, Controller, Get, Post, Put } from '@nestjs/common';
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
  
  @Get('/list')
  getAllUsers(): any {
    return this.appService.getAllUsers();
  }

  @Get('/online')
  getOnlineUsers(): any {
    return this.appService.getNameOnlineUsers();
  }

  @Post('/')
  signup(@Body() input: User): Promise<User> {
    return this.appService.postUsers(input);
  }

  @Post('/login')
  login(@Body() input: any): Promise<any> {
    return this.appService.login(input);
  }

  @Post('/social')
  loginSocial(@Body() input: any): Promise<any> {
    return this.appService
      .postUsers(input)
      .then(async (user) => {
        this.appService.login(user).then((iuser) => {
          return iuser;
        });
      })
      .catch(async (err) => {
        this.appService.login(input).then((iuser) => {
          return iuser;
        });
      });
  }
  
  @Put('/')
  update(@Body() input: any): Promise<any> {
    return this.appService.update(input);
  }


}
