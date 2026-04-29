import { IsString, IsArray, IsOptional } from 'class-validator';

export class UpdateSettingsDto {
  @IsString()
  @IsOptional()
  siteTitle?: string;

  @IsArray()
  @IsOptional()
  typewriterPhrases?: string[];

  @IsString()
  @IsOptional()
  footerText?: string;
}