import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('status')
  getHello() {
    return {status: 'OK', message: 'API ligas funcionando', version: '1.0.0'};
  }
}
