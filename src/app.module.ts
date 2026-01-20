import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/infrastructure/UserModule';
import { TeamModule } from './team/infrastructure/TeamModule';
import { CompetitionModule } from './competition/infrastructure/CompetitionModule';
import { MatchesModule } from './matches/infrastructure/MatchModule';
import { StatsModule } from './stats/infrastructure/StatsModule';
import { AuthModule } from './auth/AuthModule';


@Module({
 imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'basket_league', 
      autoLoadEntities: true,
      synchronize: true, //solo en desarrollo
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
