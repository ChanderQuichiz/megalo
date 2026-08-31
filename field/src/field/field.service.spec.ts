import { Test, TestingModule } from '@nestjs/testing';
import { FieldService } from './field.service';
import { PrismaService } from '../prisma/prisma.service';
import { jest } from '@jest/globals';
import { describe, beforeEach, it, expect } from '@jest/globals';
import { CreateFieldDto } from './dto/create-field.dto';
describe('FieldService', () => {
  let service: FieldService;
  const prismaServiceMock = {
  field: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
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
      ],
    }).compile();

    service = module.get<FieldService>(FieldService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a field', async () => {
    const createFieldDto: CreateFieldDto = { name: 'Test Field', description: 'This is a test field', sport: 'Soccer', costPerHour: 50, status: 'Available' };
    prismaServiceMock.field.create.mockResolvedValue(createFieldDto);

    const result = await service.create(createFieldDto);
    expect(result).toEqual(createFieldDto);
    expect(prismaServiceMock.field.create).toHaveBeenCalledWith({
      data: createFieldDto,
    });
  });


});
