import { IsString, IsUrl, IsBoolean, IsOptional, IsIn } from 'class-validator';

export class CreateSocialLinkDto {
  @IsIn(['github', 'linkedin', 'twitter', 'email'])
  platform!: string;

  @IsUrl()
  url!: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}