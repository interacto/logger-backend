import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ApiModule } from '../src/api/api.module';
import * as fs from 'fs';
import { ApiService } from '../src/api/api.service';
import { rmSync } from 'fs';
import { LoggingData, UsageLog } from 'interacto';

describe('Api (e2e)', () => {
  let app: INestApplication;
  let usageDto: UsageLog;
  let errorDto: LoggingData;

  beforeAll(() => {
    rmSync(ApiService.path, { recursive: true, force: true });
  });

  afterEach(() => {
    rmSync(ApiService.path, { recursive: true, force: true });
  });

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ApiModule],
    }).compile();

    usageDto = {
      date: 2021,
      name: 'test name',
      duration: 42,
      cancelled: false,
      sessionID: 'test session id',
      frontVersion: 'front 1.0',
    };

    errorDto = {
      type: 'ERR',
      date: 2021,
      sessionID: 'test session id',
      msg: 'test msg',
      level: 'interaction',
      stack: 'test stack',
      name: 'test name',
      frontVersion: 'front 1.0',
    };

    app = moduleFixture.createNestApplication();
    await app.init();
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
      .post('/api/error')
      .send(errorDto)
      .expect(201);

    const buffer = fs.readFileSync(ApiService.path + ApiService.errorLogsName);
    const logs = JSON.parse(buffer.toString());
    expect(logs).toHaveLength(1);
    expect(logs).toStrictEqual([errorDto]);
    return test;
  });

  it('/api/usage (GET)', async () => {
    await request(app.getHttpServer()).post('/api/usage').send(usageDto);

    return request(app.getHttpServer())
      .get('/api/usage')
      .expect(200)
      .expect([usageDto]);
  });

  it('/api/error (GET)', async () => {
    await request(app.getHttpServer()).post('/api/error').send(errorDto);

    return request(app.getHttpServer())
      .get('/api/error')
      .expect(200)
      .expect([errorDto]);
  });
});
