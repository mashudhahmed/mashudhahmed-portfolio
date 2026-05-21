import { IsString, IsUrl, IsOptional } from 'class-validator';

export class UpdateResumeDto {
  @IsUrl()
  url!: string;

  @IsString()
  fileName!: string;
}