import { Test, TestingModule } from '@nestjs/testing';
import { FieldController } from './field.controller';
import { FieldService } from './field.service';
import { describe, beforeEach, it, expect, jest } from '@jest/globals';
import { CreateFieldDto } from './dto/create-field.dto';


describe('FieldController', () => {
  let controller: FieldController;
  const fieldServiceMock = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FieldController],
      providers: [
        {
          provide: FieldService,
          useValue: fieldServiceMock,
        }
      ],
    }).compile();

    controller = module.get<FieldController>(FieldController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a field', async () => {
    const createFieldDto: CreateFieldDto = { name: 'Test Field', description: 'This is a test field', sport: 'Soccer', costPerHour: 50, status: 'Available' };
    fieldServiceMock.create.mockResolvedValue(createFieldDto);

    const result = await controller.create(createFieldDto);
    expect(result).toEqual(createFieldDto);
    expect(fieldServiceMock.create).toHaveBeenCalledWith(createFieldDto);
  });

});
