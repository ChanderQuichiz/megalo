import { Module } from '@nestjs/common';
import { FieldService } from './field.service';
import { FieldController } from './field.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { FileModule } from '../file/file.module';

@Module({
  controllers: [FieldController],
  providers: [FieldService],
  imports: [PrismaModule, FileModule],
})
export class FieldModule {}
