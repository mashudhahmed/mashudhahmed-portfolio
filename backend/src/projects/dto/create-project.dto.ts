import { IsString, IsUrl, IsArray, IsOptional } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  title!: string;

  @IsString()
  description!: string;

  @IsArray()
  technologies!: string[];

  @IsUrl()
  imageUrl!: string;

  @IsUrl()
  githubUrl!: string;

  @IsUrl()
  @IsOptional()
  liveUrl?: string;
}