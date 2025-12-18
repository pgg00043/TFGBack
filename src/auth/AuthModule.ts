import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './AuthService';
import { AuthController } from './AuthController';
import { User } from '../users/domain/User';
import { JwtStrategy } from './JwtStrategy';
import { APP_GUARD } from '@nestjs/core';
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: 'JWT_SECRET_KEY', 
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, 
    JwtStrategy, 
    {
      provide: APP_GUARD,
      useClass: JwtStrategy,
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
