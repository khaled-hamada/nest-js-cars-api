import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (_: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    if (!request.currentUser) {
      throw new UnauthorizedException('user not authorized');
    }
    return request.currentUser;
  },
);
