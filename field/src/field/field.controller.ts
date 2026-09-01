import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  BadRequestException,
  UploadedFiles,
} from '@nestjs/common';
import { FieldService } from './field.service';
import { CreateFieldDto } from './dto/create-field.dto';
import { UpdateFieldDto } from './dto/update-field.dto';
import { FilesInterceptor } from '@nestjs/platform-express/multer/interceptors/files.interceptor';
//hola
@Controller('api/field')
export class FieldController {
  constructor(private readonly fieldService: FieldService) {}

  @Post()
  @UseInterceptors(
    FilesInterceptor('files', 5, {
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (req, file, callback) => {
        const validTypes = ['image/jpeg', 'image/png'];
        if (!validTypes.includes(file.mimetype)) {
          return callback(
            new BadRequestException('Tipo de archivo no permitido'),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  create(
    @Body() createFieldDto: CreateFieldDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.fieldService.create(createFieldDto, files);
  }

  @Get()
  findAll() {
    return this.fieldService.findAll();
  }


 @Get('info/:id')
  getInfoFielf(@Param('id') id: number) {
    return this.fieldService.getInfoField(id);
  }

@Get(':id')
  findOne(@Param('id') id: number) {
    return this.fieldService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFieldDto: UpdateFieldDto) {
    return this.fieldService.update(+id, updateFieldDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fieldService.remove(+id);
  }
}
