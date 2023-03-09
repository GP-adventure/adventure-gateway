import { Global, Module } from '@nestjs/common';
import { dotenvLoader, TypedConfigModule } from 'nest-typed-config';
import { RootConfig } from './configuration';

@Global()
@Module({
  imports: [
    TypedConfigModule.forRoot({
      schema: RootConfig,
      load: dotenvLoader({
        separator: '_',
      }),
      isGlobal: true,
      normalize(config) {
        config.authServiceConfig.port = parseInt(config.authServiceConfig.port, 10);
        return config;
      },
    }),
  ],
})
export class CoreModules {}
