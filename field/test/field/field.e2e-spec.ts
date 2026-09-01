import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../../src/app.module';
import { describe, beforeEach, it, afterEach, expect } from '@jest/globals';
import { CreateFieldDto } from '../../src/field/dto/create-field.dto';
describe('AppController (e2e)', () => {
  let app: INestApplication<App>;
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true, // elimina campos no declarados en el DTO
        forbidNonWhitelisted: true, // error si mandan campos extra
        transform: true, // convierte tipo automaticamente
      }),
    );
    await app.init();
  });

  it('/field/ (POST)', () => {
    const body: CreateFieldDto = {
      name: 'Test Field',
      description: 'This is a test field',
      sport: 'Soccer',
      costPerHour: 100,
      status: 'Available',
    };

    return request(app.getHttpServer())
      .post('/api/field')
      .field('name', body.name)
      .field('description', body.description)
      .field('sport', body.sport)
      .field('costPerHour', body.costPerHour.toString())
      .field('status', body.status)
      .attach('files', 'test/fixtures/images.jpeg')
      .expect(201)
      .expect((res: { body: CreateFieldDto }) => {
        expect(res.body.name).toEqual(body.name);
      });
  });

  afterEach(async () => {
    await app.close();
  });
});
