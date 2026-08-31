import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateFieldDto {
  @IsString()
  name: string = '';
  @IsNotEmpty()
  description: string = '';
  @IsNotEmpty()
  sport: string = '';
  @Type(() => Number)
  @IsNumber()
  costPerHour: number = 0;
  @IsString()
  @IsNotEmpty()
  status: string = '';
}
