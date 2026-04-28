import { IsString, IsIn, IsBoolean, IsOptional } from 'class-validator';

export class CreateSkillDto {
  @IsString()
  name!: string;

  @IsString()
  icon!: string;

  @IsIn(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'])
  level!: string;

  @IsIn(['Frontend', 'Backend & DevOps', 'Database & Tools', 'Languages'])
  category!: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}