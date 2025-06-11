import { Body, Controller, Get, Put } from '@nestjs/common';
import { AppService } from '../app.service';
import { HelloRequestBodyDto } from 'src/dtos/request-body.dto';
import { HelloResponseBodyInterface } from 'src/types/response-body';

@Controller('hello')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Put()
  updateHello(@Body() body: HelloRequestBodyDto): HelloResponseBodyInterface {
    return { data: 'Updated. ' + body.message };
  }
}
