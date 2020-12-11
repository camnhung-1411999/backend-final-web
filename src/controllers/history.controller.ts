import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common'
import { HistoryService } from '../services/history.service';
import { History } from '../models/history.model';
import { ApiTags } from '@nestjs/swagger';

@Controller('/history')
@ApiTags('History')
export class HistoryController {
    constructor(private readonly appService: HistoryService) {}
    @Get()
    listAll(): any {
        return this.appService.listAll();
    }

    @Get('/:user')
    listByUser(@Param('user') username: string) {
        return this.appService.findByUsername(username);
    }

    @Post('/')
    create(@Body() input: History): Promise<History>{
        return this.appService.create(input);
    }

    

    

    
}