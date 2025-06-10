import { Body, Controller, Get, Put } from '@nestjs/common';
import { AppService } from '../app.service';
import { HelloRequestBodyDto } from 'src/dtos/request-body.dto';

@Controller('hello')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Put()
  updateHello(@Body() body: HelloRequestBodyDto): string {
    return 'Updated. ' + body.message;
  }
}
