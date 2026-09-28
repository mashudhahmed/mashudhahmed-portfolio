import { IsString, IsOptional } from 'class-validator';

export class UpdateResumeDto {
  @IsString()
  @IsOptional()
  url?: string;

  @IsString()
  @IsOptional()
  fileName?: string;
}