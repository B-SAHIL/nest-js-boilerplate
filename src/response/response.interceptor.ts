import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { of } from "rxjs";

import { catchError } from "rxjs/operators";

export interface Response<T> {
  data: T;
  status: number;
  errors: any;
}


export class ResponseTransformInterceptor<T>
  implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response = context.switchToHttp().getResponse()
    const status = response.statusCode;
    return next.handle().pipe(
      map((data) => ({
        data,
        status,
        errors: null,
      }))
    );
  }
}
