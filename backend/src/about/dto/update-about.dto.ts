import { IsString, IsOptional, IsUrl } from 'class-validator';

export class UpdateAboutDto {
  @IsString()
  bio!: string;

  @IsUrl()
  @IsOptional()
  photoUrl!: string;

  @IsString()
  education!: string;

  @IsString()
  university!: string;

  @IsString()
  major!: string;

  @IsString()
  yearStart!: string;

  @IsString()
  yearEnd!: string;

  @IsString()
  coursework!: string;
}