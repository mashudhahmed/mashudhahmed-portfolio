import { IsString, IsOptional, IsUrl } from 'class-validator';

export class UpdateAboutDto {
  @IsString()
  @IsOptional()
  bio?: string;

  @IsUrl()
  @IsOptional()
  photoUrl?: string;

  @IsString()
  @IsOptional()
  education?: string;

  @IsString()
  @IsOptional()
  university?: string;

  @IsString()
  @IsOptional()
  major?: string;

  @IsString()
  @IsOptional()
  yearStart?: string;

  @IsString()
  @IsOptional()
  yearEnd?: string;

  @IsString()
  @IsOptional()
  coursework?: string;
}