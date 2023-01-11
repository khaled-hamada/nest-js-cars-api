import { AuthService } from './auth.service';
import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CurrentUserMiddleware } from './middlewares/current-user.middleware';

@Module({
  providers: [UsersService, AuthService],
  controllers: [UsersController],
  imports: [TypeOrmModule.forFeature([User])],
})
export class UsersModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CurrentUserMiddleware).forRoutes('*');
    // .exclude(
    //   { path: 'auth/signup', method: RequestMethod.POST },
    //   { path: 'auth/signin', method: RequestMethod.POST },
    // );
  }
}
