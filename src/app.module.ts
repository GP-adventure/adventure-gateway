import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { CoreModules } from './coreModules.module';
import { JwtAuthGuard } from './auth/auth.guard';

@Module({
  imports: [CoreModules, AuthModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
