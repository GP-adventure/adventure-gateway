import { Type } from 'class-transformer';
import { IsNumber, IsString, ValidateNested } from 'class-validator';

export class AuthServiceConfig {
  @IsNumber()
  public readonly port!: number;

  @IsString()
  public readonly host!: string;

  @IsString()
  public readonly authProtoPath!: string;
}

export class RootConfig {
  @Type(() => AuthServiceConfig)
  @ValidateNested()
  public readonly authServiceConfig!: AuthServiceConfig;
}
