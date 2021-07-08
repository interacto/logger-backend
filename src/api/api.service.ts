import { Injectable } from '@nestjs/common';
import { UsageDto } from './dto/usage.dto';
import { ErrorDto } from './dto/error.dto';
import * as fs from 'fs';

const path = './logs/';

@Injectable()
export class ApiService {
  async saveUsageData(usageDto: UsageDto) {
    console.log('Received usage data: ' + usageDto.id + ' at ' + usageDto.date);
    await fs.promises.mkdir(path, { recursive: true }); // Create logs directory if needed
    const data = JSON.stringify(usageDto, null, 4);
    fs.writeFile(path + 'usage.json', data, (err) => {
      if (err) {
        // If an error occurred while writing the file
        throw err;
      }
    });
  }

  async saveErrorData(errorDto: ErrorDto) {
    console.log(
      'Received error data: ' + errorDto.msg + ' at ' + errorDto.date,
    );
    await fs.promises.mkdir(path, { recursive: true }); // Create logs directory if needed
    const data = JSON.stringify(errorDto, null, 4);
    fs.writeFile(path + 'error.json', data, (err) => {
      if (err) {
        // If an error occurred while writing the file
        throw err;
      }
    });
  }
}
