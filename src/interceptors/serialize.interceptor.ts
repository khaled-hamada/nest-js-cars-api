import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  UseInterceptors,
} from '@nestjs/common';

import { Observable } from 'rxjs';
import { map } from 'rxjs';
import { plainToInstance } from 'class-transformer';

interface Class<T> {
  new (...args: any[]): T;
}

export function serialize<T>(dto: Class<T>) {
  return UseInterceptors(new SerializeInterceptor(dto));
}
class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: any) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map((data: any) => {
        return plainToInstance(this.dto, data, {
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
