import { IsString, IsEmail, IsBoolean, IsOptional } from 'class-validator';

export class UpdateContactInfoDto {
  @IsEmail()
  email!: string;

  @IsString()
  location!: string;

  @IsString()
  timezone!: string;

  @IsString()
  workingHours!: string;

  @IsString()
  responseTime!: string;

  @IsBoolean()
  @IsOptional()
  availableForWork?: boolean;
}