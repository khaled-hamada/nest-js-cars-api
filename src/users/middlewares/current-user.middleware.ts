import { NestMiddleware, Injectable, NotFoundException } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { User } from 'users/user.entity';
import { UsersService } from '../users.service';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      currentUser?: User;
    }
  }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(readonly usersService: UsersService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const { userId } = req.session ?? {};
    if (userId) {
      const user = await this.usersService.findOne(userId);
      if (!user) {
        throw new NotFoundException('Un Authorized Access');
      }
      req.currentUser = user;
    }

    next();
  }
}
