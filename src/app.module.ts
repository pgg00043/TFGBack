import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/infrastructure/UserModule';
import { TeamModule } from './team/infrastructure/TeamModule';
import { CompetitionModule } from './competition/infrastructure/CompetitionModule';
import { MatchesModule } from './matches/infrastructure/MatchModule';
import { StatsModule } from './stats/infrastructure/StatsModule';
import { AuthModule } from './auth/AuthModule';
import { join } from 'path';
import 'dotenv/config';



@Module({
 imports: [
    ServeStaticModule.forRoot({
        rootPath: join(process.cwd(), 'uploads'),
        serveRoot: '/uploads',
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: false,
    }),

    UsersModule,
    TeamModule,
    CompetitionModule,
    MatchesModule,
    StatsModule,
    AuthModule,
  
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
