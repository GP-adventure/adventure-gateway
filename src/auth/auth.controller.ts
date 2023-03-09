import {
  Body,
  Controller,
  Get,
  Inject,
  InternalServerErrorException,
  OnModuleInit,
  Post,
  Req,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom, Observable } from 'rxjs';
import { Public, ValidWithoutVerification } from './auth.decorator';
import {
  AuthServiceClient,
  AUTH_SERVICE_NAME,
  LoginRequest,
  RegisterRequest,
  RegisterResponse,
  ConfirmRequest,
  ConfirmResponse,
  ResendResponse,
  WhoAmIResponse,
  LogoutResponse,
} from './auth.pb';
import { Empty } from './google/protobuf/empty.pb';
import { Request } from 'express';
import { RequestWithUser } from './requestWithUser.interface';

@Controller()
export class AuthController implements OnModuleInit {
  private svc!: AuthServiceClient;

  @Inject(AUTH_SERVICE_NAME)
  private readonly client!: ClientGrpc;

  public onModuleInit(): void {
    this.svc = this.client.getService<AuthServiceClient>(AUTH_SERVICE_NAME);
  }

  @Post('auth/register')
  private async register(@Body() body: RegisterRequest): Promise<Observable<RegisterResponse>> {
    return this.svc.register(body);
  }

  @Post('auth/login')
  @Public()
  private async login(@Req() req: Request, @Body() body: LoginRequest): Promise<WhoAmIResponse> {
    const userWithToken = await lastValueFrom(this.svc.login(body));

    if (userWithToken.error) {
      return userWithToken;
    }

    if (userWithToken.data) {
      req.res?.setHeader('Set-Cookie', userWithToken.data.token);
      return {
        data: {
          email: userWithToken.data.email,
          isEmailConfirmed: userWithToken.data.isEmailConfirmed,
          username: userWithToken.data.username,
          id: userWithToken.data.id,
        },
      };
    }

    throw new InternalServerErrorException('Unexpected Error Occure');
  }

  @Post('auth/logout')
  private async logout(@Req() req: Request): Promise<LogoutResponse | void> {
    const emptyToken = await lastValueFrom(this.svc.logout({}));
    if (emptyToken.error) {
      return emptyToken;
    }

    if (emptyToken.data) {
      req.res?.setHeader('Set-Cookie', emptyToken.data.token);
      return;
    }
  }

  @Post('email-confirmation/confirm')
  @Public()
  private async confirm(@Body() body: ConfirmRequest): Promise<Observable<ConfirmResponse>> {
    return this.svc.confirm(body);
  }

  @Post('email-confirmation/resend-confirmation-link')
  @ValidWithoutVerification()
  private async resendConfirmationLink(@Body() body: Empty): Promise<Observable<ResendResponse>> {
    return this.svc.resend(body);
  }

  @Get('auth/whoami')
  private async whoAmI(@Req() req: RequestWithUser): Promise<WhoAmIResponse> {
    const token: string = req.headers['cookie'].split('=')[1];
    return await lastValueFrom(this.svc.whoAmI({ token }));
  }
}
