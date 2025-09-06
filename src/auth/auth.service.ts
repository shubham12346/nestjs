import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(email: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.usersRepository.create({
      email,
      password: hashedPassword,
    });
    return this.usersRepository.save(user);
  }

  async login(email: string, password: string) {
    const findUser = await this.usersRepository.findOne({ where: { email } });
    if (!findUser) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const isPasswordValid = await bcrypt.compare(password, findUser.password);
    if (!isPasswordValid) {
      throw new HttpException('Invalid password', HttpStatus.UNAUTHORIZED);
    }
    const payload = { email: findUser.email, sub: findUser.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
