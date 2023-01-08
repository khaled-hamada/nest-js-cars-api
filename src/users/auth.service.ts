import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { scrypt as _scrypt, randomBytes } from 'crypto';

import { UsersService } from './users.service';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(readonly usersService: UsersService) {}

  async signup(email: string, password: string) {
    // see if email is in use
    if ((await this.usersService.find(email))?.length) {
      throw new BadRequestException('email in use');
    }
    // hash the users password
    // 1. generate a salt
    const salt = randomBytes(8).toString('hex');
    // 2. hash both the password and the salt
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    // 3.
    const result = salt + '.' + hash.toString('hex');
    // create a new user and save it
    const user = await this.usersService.create(email, result);
    // return the user
    return user;
  }

  async signIn(email: string, password: string) {
    const [user] = await this.usersService.find(email);
    console.log('user => ', user);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    const [salt, storedHash] = user.password.split('.');
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('bad user credentials');
    }

    return user;
  }
}
