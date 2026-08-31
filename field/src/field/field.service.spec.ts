import { Test, TestingModule } from '@nestjs/testing';
import { FieldService } from './field.service';
import { PrismaService } from '../prisma/prisma.service';
import { jest } from '@jest/globals';
import { describe, beforeEach, it, expect } from '@jest/globals';
import { CreateFieldDto } from './dto/create-field.dto';
import { FileService } from '../file/file.service';
describe('FieldService', () => {
  let service: FieldService;
  const fileServiceMock = {
    upload: jest.fn(),
  };
  const prismaServiceMock = {
    field: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    fieldImage: {
      createMany: jest.fn(),
    },
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FieldService,
        {
          provide: PrismaService,
          useValue: prismaServiceMock,
        },
        {
          provide: FileService,
          useValue: fileServiceMock,
        },
      ],
    }).compile();

    service = module.get<FieldService>(FieldService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a field', async () => {
    const createFieldDto: CreateFieldDto = {
      name: 'Test Field',
      description: 'This is a test field',
      sport: 'Soccer',
      costPerHour: 50,
      status: 'Available',
    };

    const createFieldDtoResponse = {
      ...createFieldDto,
      id: 1,
    };

    const mockFile = {
      originalname: 'field.jpg',
      mimetype: 'image/jpeg',
      buffer: Buffer.from('fake-image'),
    } as Express.Multer.File;

    prismaServiceMock.field.create.mockResolvedValue(createFieldDtoResponse);
    fileServiceMock.upload.mockResolvedValue({
      key: 'field.jpg',
    });

    prismaServiceMock.fieldImage.createMany.mockResolvedValue({
      count: 1,
    });

    const result = await service.create(createFieldDto, [mockFile]);

    expect(result).toEqual({
      ...createFieldDtoResponse,
      imagesUrl: [`${process.env.DOMAIN_FIELD_IMAGE}/field.jpg`],
    });

    expect(prismaServiceMock.field.create).toHaveBeenCalledWith({
      data: createFieldDto,
    });
  });
});
