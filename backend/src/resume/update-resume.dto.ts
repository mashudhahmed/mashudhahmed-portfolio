import { IsString, IsUrl, IsOptional } from 'class-validator';

export class UpdateResumeDto {
  @IsUrl()
  @IsOptional()
  url?: string;

  @IsString()
  @IsOptional()
  fileName?: string;
}