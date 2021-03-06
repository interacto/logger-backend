import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { LoggingData, UsageLog } from 'interacto';

@Injectable()
export class ApiService {
  public static path = './logs/';
  public static usageLogsName = 'usage.json';
  public static errorLogsName = 'error.json';

  public usageLogs: Array<UsageLog> = [];
  public errorLogs: Array<LoggingData> = [];

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
  async saveUsageData(usageDto: UsageLog) {
    console.log(
      'Received usage data: ' + usageDto.name + ' at ' + usageDto.date,
    );
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
  async saveErrorData(errorDto: LoggingData) {
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

  /**
   * Deletes the usage logs and the usage log file.
   */
  async deleteUsageData() {
    console.log('Deleting usage data');
    this.usageLogs.length = 0;
    fs.unlink(ApiService.path + ApiService.usageLogsName, function (err) {
      if (err && err.code == 'ENOENT') {
        console.info("USage log file doesn't exist, won't remove it.");
      } else if (err) {
        // other errors, e.g. maybe we don't have enough permissions
        console.error('Error occurred while trying to remove usage log file.');
      } else {
        console.info(`Removed usage log file.`);
      }
    });
  }

  /**
   * Deletes the error logs and the error log file.
   */
  async deleteErrorData() {
    console.log('Deleting error data');
    this.errorLogs.length = 0;
    fs.unlink(ApiService.path + ApiService.errorLogsName, function (err) {
      if (err && err.code == 'ENOENT') {
        console.info("Error log file doesn't exist, won't remove it.");
      } else if (err) {
        // other errors, e.g. maybe we don't have enough permissions
        console.error('Error occurred while trying to remove error log file.');
      } else {
        console.info(`Removed error logs.`);
      }
    });
  }
}
