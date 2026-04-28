import { IsNumber, IsOptional } from 'class-validator';

export class UpdateVisitorDto {
  @IsNumber()
  @IsOptional()
  count?: number;
}