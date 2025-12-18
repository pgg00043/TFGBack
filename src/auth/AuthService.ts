import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/domain/User';
import { LoginDto } from './dto/LoginDto';
import { RegisterDto } from './dto/RegisterDto';
import { UserOutputDto } from '../users/infrastructure/dto/UserOutputDto';
import { UserMapper } from '../users/domain/UserMapper';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  private async validateUser(username: string, password: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { username },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  async login(dto: LoginDto): Promise<{ accessToken: string; user: UserOutputDto }> {
    const user = await this.validateUser(dto.username, dto.password);

    const payload = { username: user.username, sub: user.id, rol: user.rol };
    const token = await this.jwtService.signAsync(payload);

    return {
      accessToken: token,
      user: UserMapper.toOutput(user),
    };
  }

  async register(dto: RegisterDto): Promise<UserOutputDto> {
    const existing = await this.userRepository.findOne({
      where: [{ username: dto.username }, { email: dto.email }],
    });

    if (existing) {
      throw new UnauthorizedException('Username or email already in use');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = this.userRepository.create({
      ...dto,
      password: hashedPassword,
    });

    const saved = await this.userRepository.save(user);
    return UserMapper.toOutput(saved);
  }
}
