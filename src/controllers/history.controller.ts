import { Body, Controller, Get, Param, Post, Put, Request, UseGuards } from '@nestjs/common'
import { HistoryService } from '../services/history.service';
import { History } from '../models/history.model';
import { ApiTags } from '@nestjs/swagger';
import {JwtAuthGuard} from '../interface/user.guard';
@Controller('/history')
@ApiTags('History')
export class HistoryController {
    constructor(private readonly appService: HistoryService) {}
    @Get('/list')
    listAll(@Request() req: any): any {
        return this.appService.listAll();
    }

    @Get('/')
    @UseGuards(JwtAuthGuard)
    myHistory(@Request() req) {
        return this.appService.findByUsername(req.user.user);
    }

    @Get('/history/:user')
    @UseGuards(JwtAuthGuard)
    adminFindByUser(@Param('user') user: string) {
        return this.appService.findByUsername(user);
    }

    @Get('/find/:id')
    findSingByRoomID(@Param('id') _id: string) {
        return this.appService.findByID(_id);
    }


}