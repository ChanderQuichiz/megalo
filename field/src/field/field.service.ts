import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateFieldDto } from './dto/create-field.dto';
import { UpdateFieldDto } from './dto/update-field.dto';
import { PrismaService } from '../prisma/prisma.service';
import { FileService } from '../file/file.service';

@Injectable()
export class FieldService {
  private readonly prismaService: PrismaService;
  private readonly fileService: FileService;
  private readonly logger = new Logger(FieldService.name);
  private readonly domainFieldImage = process.env.DOMAIN_FIELD_IMAGE;
  constructor(prismaService: PrismaService, fileService: FileService) {
    this.prismaService = prismaService;
    this.fileService = fileService;
  }

  async create(createFieldDto: CreateFieldDto, files: Express.Multer.File[]) {
    const saveField = await this.prismaService.field.create({
      data: createFieldDto,
    });

    const images = await Promise.all(
      files.map(async (file) => {
        const key = await this.fileService.upload(file);

        const imageUrl = `${this.domainFieldImage}/${key.key}`;

        return {
          fieldId: saveField.id,
          imageUrl,
        };
      }),
    );

    await this.prismaService.fieldImage.createMany({
      data: images,
    });

    const imagesUrl = images.map((image) => ({
      imageUrl: image.imageUrl,
    }));

    const result = {
      id: saveField.id,
      name: saveField.name,
      description: saveField.description,
      imagesUrl: imagesUrl.map((image) => image.imageUrl),
      sport: saveField.sport,
      costPerHour: saveField.costPerHour,
      status: saveField.status,
    };

    return result;
  }

  async findAll() {
    return await this.prismaService.field.findMany();
  }

  async findOne(id: number) {
    const field = await this.prismaService.field.findUnique({
      where: { id },
    });
    if (!field) {
      throw new NotFoundException(`Field with ID ${id} not found`);
    }
    return field;
  }

  async getInfoField(id: number) {
    const result = await this.prismaService.field.findFirstOrThrow({
      where: { id },
      include: {
        images: {
          select: {
            imageUrl: true,
          },
        },
      },
    });

    return result ;
  }

  async update(id: number, updateFieldDto: UpdateFieldDto) {
    await this.findOne(id);

    return await this.prismaService.field.update({
      where: { id },
      data: updateFieldDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prismaService.field.delete({
      where: { id },
    });
  }
}
