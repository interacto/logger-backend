import { Test, TestingModule } from '@nestjs/testing';
import { ApiService } from './api.service';
import { rmSync } from 'fs';
import { UsageDto } from './dto/usage.dto';
import { ErrorDto } from './dto/error.dto';
import * as fs from 'fs';

describe('ApiService', () => {
  let service: ApiService;
  let usageDto: UsageDto;
  let errorDto: ErrorDto;

  beforeAll(() => {
    rmSync(ApiService.path, { recursive: true, force: true });

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
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApiService],
    }).compile();

    service = module.get<ApiService>(ApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(service.usageLogs).toHaveLength(0);
    expect(service.errorLogs).toHaveLength(0);
  });

  it('should add usage data', async () => {
    await service.saveUsageData(usageDto);
    const buffer = fs.readFileSync(ApiService.path + ApiService.usageLogsName);
    const logs = JSON.parse(buffer.toString());
    expect(logs).toHaveLength(1);
    expect(logs).toStrictEqual([usageDto]);
  });

  it('should add error data', async () => {
    await service.saveErrorData(errorDto);
    const buffer = fs.readFileSync(ApiService.path + ApiService.errorLogsName);
    const logs = JSON.parse(buffer.toString());
    expect(logs).toHaveLength(1);
    expect(logs).toStrictEqual([errorDto]);
  });
});
