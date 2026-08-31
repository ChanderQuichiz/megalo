import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from '../src/prisma/prisma.module';
import { FieldModule } from './field/field.module';
import { FileModule } from './file/file.module';

@Module({
  imports: [PrismaModule, FieldModule, FileModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
