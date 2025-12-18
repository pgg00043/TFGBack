import { Injectable } from '@nestjs/common';


@Injectable()
export class AppService {
  getHello(): string {
    return 'API de gestión de ligas de baloncesto funcionando ';
  }
}
