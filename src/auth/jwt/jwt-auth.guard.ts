// src/auth/jwt-auth.guard.ts
import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import * as jwt from "jsonwebtoken";
import { AuthService } from '../auth.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor() {
    super();
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = extractTokenFromRequest(request);
    if (token) {
      try {
        // Verify the token
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        request.user = decodedToken;
      } catch (err) {
        throw new UnauthorizedException("Session expired, please login again");
      }
    } else {
      // Handle guest logic if no token is present
      throw new UnauthorizedException("Unauthorized");
    }

    return true;
  }

}

export function extractTokenFromRequest(request: any): string | null {
  const authHeader = request.headers.authorization;
  if (authHeader && authHeader.split(" ")[0] === "Bearer") {
    return authHeader.split(" ")[1];
  }
  return null;
}
