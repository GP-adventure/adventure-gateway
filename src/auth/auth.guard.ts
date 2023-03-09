import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { IS_PUBLIC_KEY, IS_VALID_WITHOUT_VERIFICATION } from './auth.decorator';
import { AuthService } from './auth.service';
import { RequestWithUser } from './requestWithUser.interface';
import { ErrorResponse } from './auth.pb';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  public constructor(
    @Inject(AuthService) private readonly authService: AuthService,
    private reflector: Reflector,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> | never {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const req: RequestWithUser = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();
    const authorization: string = req.headers['cookie'];

    if (!authorization) {
      const errorRes: ErrorResponse = {
        error: 'Unauthorized',
        statusCode: 401,
        message: 'You are unauthorized. Please log in.',
      };
      res.status(errorRes.statusCode).json({ error: errorRes });
      throw new UnauthorizedException('You are unauthorized. Please log in.');
    }

    const baerer: string[] = authorization.split('=');

    if (!baerer || baerer.length < 2) {
      const errorRes: ErrorResponse = {
        error: 'Unauthorized',
        statusCode: 401,
        message: 'You are unauthorized. Please log in.',
      };
      res.status(errorRes.statusCode).json({ error: errorRes });
      throw new UnauthorizedException('Wrong Token');
    }

    const token: string = baerer[1];
    const response = await this.authService.validate(token);

    if (response.error) {
      const errorRes: ErrorResponse = {
        error: response.error.error,
        statusCode: response.error.statusCode,
        message: response.error.message,
      };
      res.status(errorRes.statusCode).json({ error: errorRes });
      return false;
    }

    if (response.data === undefined) {
      const errorRes: ErrorResponse = {
        error: 'Internal Server Error',
        statusCode: 500,
        message: 'Unexpected error occure',
      };
      res.status(errorRes.statusCode).json({ error: errorRes });
      return false;
    }

    const validWithoutVerification = this.reflector.getAllAndOverride<boolean>(
      IS_VALID_WITHOUT_VERIFICATION,
      [context.getHandler(), context.getClass()],
    );

    if (validWithoutVerification) {
      return true;
    }

    if (!response.data.isEmailConfirmed) {
      const errorRes: ErrorResponse = {
        error: 'Unauthorized',
        statusCode: 401,
        message: 'Confirm you email address first',
      };
      res.status(errorRes.statusCode).json({ error: errorRes });
      return false;
    }

    return true;
  }
}
