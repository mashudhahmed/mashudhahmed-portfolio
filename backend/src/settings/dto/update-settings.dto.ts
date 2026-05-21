import { IsString, IsArray, IsOptional } from 'class-validator';

export class UpdateSettingsDto {
  @IsArray()
  @IsOptional()
  typewriterPhrases?: string[];

  @IsString()
  @IsOptional()
  footerText?: string;
}