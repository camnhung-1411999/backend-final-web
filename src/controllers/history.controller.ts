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
    listAll(): any {
        return this.appService.listAll();
    }

    @Get('/')
    @UseGuards(JwtAuthGuard)
    listByUser(@Request() req) {
        return this.appService.findByUsername(req.user.user);
    }

    @Get('/result/:id')
    findSingByRoomID(@Param('id') _id: string) {
        return this.appService.findSingByID(_id);
    }

    @Post('/')
    create(@Body() input: History): Promise<History>{
        return this.appService.create(input);
    }

}