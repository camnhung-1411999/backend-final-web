import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Req,
  Request,
  UseGuards,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../interface/user.guard';
import { Mailer } from '../middlewares/mailer.middleware';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from '../services/cloudinary.service';
import { diskStorage } from 'multer';
import { extname } from 'path';
@Controller('/users')
@ApiTags('User')
export class UserController {
  constructor(
    private readonly appService: UserService,
    private readonly mailer: Mailer,
    private readonly cloudinary: CloudinaryService,
  ) {}

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
  async signup(@Body() input: any): Promise<null> {
    await this.appService.postUsers(input);
    const data = {
      url:
        process.env.URL_FE +
        `checkmail?fname=${input.firstName}&lname=${input.lastName}&user=${input.user}&pwd=${input.password}`,
      ...input,
    };
    const url = '../templates/register';
    await this.mailer.send(data, url);
    return null;
  }

  @Post('/subsignup')
  subSignup(@Body() input: any): Promise<User> {
    return this.appService.create(input);
  }

  @Post('/reset')
  async resetPassword(@Body() input: any): Promise<null> {
    await this.appService.find(input.user);
    const url = '../templates/password';
    const data = {
      ...input,
      url: process.env.URL_FE + `resetpassword/${input.user}`,
    };
    await this.mailer.send(data, url);
    return null;
  }

  @Put('/resetpassword')
  password(@Body() input: any): Promise<User> {
    return this.appService.update(input);
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
        const user = {
          user: data.user,
          password: data.password,
          type: 'social',
        };
        await this.appService.login(user).then((iuser) => {
          return iuser;
        });
      })
      .catch(() => {
        return this.appService
          .login({ user: input.user, password: input.password, type: 'social' })
          .then((iuser) => {
            return iuser;
          });
      });
  }

  @Put('/')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',

        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async update(
    @Body() input: any,
    @Request() req,
    @UploadedFile() file: any,
  ): Promise<any> {
    const image = await this.cloudinary.upload(file);
    const data = {
      user: req.user.user,
      image: image.url,
      ...input,
    };
    return this.appService.update(data);
  }

  @Put('/logout')
  @UseGuards(JwtAuthGuard)
  logout(@Request() req: any): Promise<any> {
    const data = {
      user: req.user.user,
      status: false,
    };
    return this.appService.update(data);
  }

  @Get('/rank')
  getRankUsers(): any {
    return this.appService.getListRank();
  }
}
