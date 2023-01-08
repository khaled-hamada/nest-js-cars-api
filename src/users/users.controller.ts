import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Session,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
// import { serializ } from 'interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './user.entity';
// import { AuthGuard } from 'guards/auth.guard';
import { AuthGuard } from '../guards/auth.guard';
import { serialize } from '../interceptors/serialize.interceptor';

@Controller('auth')
@serialize<UserDto>(UserDto)
export class UsersController {
  constructor(
    private usersService: UsersService,
    readonly authService: AuthService,
  ) {}

  @Get('/whoami')
  @UseGuards(AuthGuard)
  whoAmI(@CurrentUser() user: User) {
    return user;
  }

  @Post('/signout')
  async signOut(
    @Session()
    session: {
      [x: string]: any;
    },
  ) {
    session.userId = null;
  }

  @Post('/signup')
  async createUser(
    @Body() payload: CreateUserDto,
    @Session()
    session: {
      [x: string]: any;
    },
  ) {
    const user = await this.authService.signup(payload.email, payload.password);
    session.userId = user.id;
    return user;
  }
  @Post('/signin')
  async signIn(
    @Body() payload: CreateUserDto,
    @Session()
    session: {
      [x: string]: any;
    },
  ) {
    const user = await this.authService.signIn(payload.email, payload.password);
    session.userId = user.id;
    return user;
  }

  @Get('/:id')
  findUser(@Param('id') id: string) {
    return this.usersService.findOne(parseInt(id));
  }

  @Get()
  findAllUsers(@Query('email') email: string) {
    return this.usersService.find(email);
  }

  @Delete('/:id')
  removeUser(@Param('id') id: string) {
    return this.usersService.remove(parseInt(id));
  }

  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.usersService.update(parseInt(id), body);
  }
}
