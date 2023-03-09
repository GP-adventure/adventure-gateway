import { Global, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthServiceConfig, RootConfig } from 'src/configuration';
import { AuthController } from './auth.controller';
import { AUTH_PACKAGE_NAME, AUTH_SERVICE_NAME } from './auth.pb';
import { AuthService } from './auth.service';

@Global()
@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: AUTH_SERVICE_NAME,
        imports: [RootConfig],
        // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
        useFactory: async (authConfig: AuthServiceConfig) => {
          return {
            name: AUTH_SERVICE_NAME,
            transport: Transport.GRPC,
            options: {
              protoPath: authConfig.authProtoPath,
              url: `${authConfig.host}:${authConfig.port}`,
              package: AUTH_PACKAGE_NAME,
            },
          };
        },
        inject: [AuthServiceConfig],
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
