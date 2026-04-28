import { IsString, IsArray, IsOptional } from 'class-validator';

export class UpdateSettingsDto {
  @IsString()
  @IsOptional()
  siteTitle?: string;

  @IsString()
  @IsOptional()
  heroGradient?: string;

  @IsArray()
  @IsOptional()
  typewriterPhrases?: string[];

  @IsString()
  @IsOptional()
  footerText?: string;
}