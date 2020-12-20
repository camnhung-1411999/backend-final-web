import { Body, Controller, Get, Post, Put, Req, Request, UseGuards } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';
import { ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard } from '../interface/auth.guard';
import { JwtAuthGuard } from '../interface/user.guard';
@Controller('/users')
@ApiTags('User')
export class UserController {
  constructor(
    private readonly appService: UserService,
  ) { }

  @Get('/list')
  getAllUsers(): any {
    return this.appService.getAllUsers();
  }

  @Get('/')
  @UseGuards(JwtAuthGuard)
  me(@Request() req): any {
    return this.appService.find(req.user.user);
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
  // @UseGuards(LocalAuthGuard)
  login(@Body() input: any): Promise<any> {
    return this.appService.login(input.data);
  }
  @Post('/social')
  loginSocial(@Body() input: User): Promise<any> {
    return this.appService
      .postUsers(input)
      .then(async (data) => {
        const user = { user: data.user, password: data.password, type: 'social' }
        await this.appService.login(user).then((iuser) => {
          return iuser;
        });
      })
      .catch(() => {
        return this.appService.login({ user: input.user, password: input.password, type: 'social'}).then((iuser) => {
          return iuser;
        });
      });
  }

  @Put('/')
  @UseGuards(JwtAuthGuard)
  update(@Body() input: any, @Request() req): Promise<any> {
    const data = {
      user: req.user.user,
      ...input
    }
    return this.appService.update(data);
  }

  @Put('/logout')
  @UseGuards(JwtAuthGuard)
  logout(@Request() req: any): Promise<any> {
    const data = {
      user: req.user.user,
      status: false,
    }
    return this.appService.update(data);
  }

}
