import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { AuthServiceClient, AUTH_SERVICE_NAME, ValidateResponse, WhoAmIResponse } from './auth.pb';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService implements OnModuleInit {
  private svc!: AuthServiceClient;

  constructor(@Inject(AUTH_SERVICE_NAME) private readonly client: ClientGrpc) {}

  public onModuleInit(): void {
    this.svc = this.client.getService<AuthServiceClient>(AUTH_SERVICE_NAME);
  }

  public async validate(token: string): Promise<WhoAmIResponse> {
    return firstValueFrom(this.svc.whoAmI({ token }));
  }
}
