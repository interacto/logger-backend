import { Injectable } from '@nestjs/common';
import { UsageDto } from './dto/usage.dto';
import { ErrorDto } from './dto/error.dto';
import * as fs from 'fs';

@Injectable()
export class ApiService {
  public static path = './logs/';
  public static usageLogsName = 'usage.json';
  public static errorLogsName = 'error.json';

  public usageLogs: Array<UsageDto> = [];
  public errorLogs: Array<ErrorDto> = [];

  constructor() {
    this.loadLogData();
  }

  /**
   * Loads the logs from previous sessions.
   */
  loadLogData() {
    fs.mkdirSync(ApiService.path, { recursive: true }); // Create logs directory if needed
    try {
      const data = fs.readFileSync(ApiService.path + ApiService.usageLogsName);
      this.usageLogs = JSON.parse(data.toString());
    } catch (err) {} // File did not exist, no data to load

    try {
      const data = fs.readFileSync(ApiService.path + ApiService.errorLogsName);
      this.errorLogs = JSON.parse(data.toString());
    } catch (err) {} // File did not exist, no data to load
  }

  /**
   * Saves the provided usage data to the usage log file.
   * @param usageDto The data to save.
   */
  async saveUsageData(usageDto: UsageDto) {
    console.log('Received usage data: ' + usageDto.id + ' at ' + usageDto.date);
    this.usageLogs.push(usageDto);
    const data = JSON.stringify(this.usageLogs, null, 4);
    await fs.promises.writeFile(
      ApiService.path + ApiService.usageLogsName,
      data,
    );
  }

  /**
   * Saves the provided error data to the error log file.
   * @param errorDto The data to save.
   */
  async saveErrorData(errorDto: ErrorDto) {
    console.log(
      'Received error data: ' + errorDto.msg + ' at ' + errorDto.date,
    );
    this.errorLogs.push(errorDto);
    const data = JSON.stringify(this.errorLogs, null, 4);
    await fs.promises.writeFile(
      ApiService.path + ApiService.errorLogsName,
      data,
    );
  }
}
