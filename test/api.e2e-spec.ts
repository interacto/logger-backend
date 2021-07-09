import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ApiModule } from '../src/api/api.module';
import { UsageDto } from '../src/api/dto/usage.dto';
import { ErrorDto } from '../src/api/dto/error.dto';
import * as fs from 'fs';
import { ApiService } from '../src/api/api.service';
import { rmSync } from 'fs';

describe('Api (e2e)', () => {
  let app: INestApplication;
  let usageDto: UsageDto;
  let errorDto: ErrorDto;

  beforeAll(() => {
    rmSync(ApiService.path, { recursive: true, force: true });
  });

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ApiModule],
    }).compile();

    usageDto = {
      date: 2021,
      id: 'test id',
      duration: 42,
      cancel: false,
      sessionID: 'test session id',
      frontVersion: 'front 1.0',
    };

    errorDto = {
      date: 2021,
      sessionID: 'test session id',
      msg: 'test msg',
      level: 'test level',
      stack: 'test stack',
      name: 'test name',
      frontVersion: 'front 1.0',
    };

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/api/usage (GET)', () => {
    return request(app.getHttpServer())
      .get('/api/usage')
      .expect(200)
      .expect('usage');
  });

  it('/api/usage (POST)', async () => {
    const test = await request(app.getHttpServer())
      .post('/api/usage')
      .send(usageDto)
      .expect(201);

    const buffer = fs.readFileSync(ApiService.path + ApiService.usageLogsName);
    const logs = JSON.parse(buffer.toString());
    expect(logs).toHaveLength(1);
    expect(logs).toStrictEqual([usageDto]);
    return test;
  });

  it('/api/err (POST)', async () => {
    const test = await request(app.getHttpServer())
      .post('/api/err')
      .send(errorDto)
      .expect(201);

    const buffer = fs.readFileSync(ApiService.path + ApiService.errorLogsName);
    const logs = JSON.parse(buffer.toString());
    expect(logs).toHaveLength(1);
    expect(logs).toStrictEqual([errorDto]);
    return test;
  });
});
