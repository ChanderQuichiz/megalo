import { PartialType } from '@nestjs/mapped-types';
import { CreateFieldDto } from './create-field.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateFieldDto extends PartialType(CreateFieldDto) {
    @IsNotEmpty()
    @IsNumber()
    id: number;
}
