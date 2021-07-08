import { Injectable } from '@nestjs/common';
import { UsageDto } from './dto/usage.dto';
import { ErrorDto } from './dto/error.dto';
import * as fs from 'fs';

const path = './logs/';

@Injectable()
export class ApiService {
  saveUsageData(usageDto: UsageDto) {
    console.log('Received usage data: ' + usageDto.id + ' at ' + usageDto.date);
    const data = JSON.stringify(usageDto);
    fs.writeFile(path + 'usage.json', data, (err) => {
      if (err) {
        // If an error occurred while writing the file
        throw err;
      }
    });
  }

  saveErrorData(errorDto: ErrorDto) {
    console.log(
      'Received error data: ' + errorDto.msg + ' at ' + errorDto.date,
    );
    const data = JSON.stringify(errorDto);
    fs.writeFile(path + 'error.json', data, (err) => {
      if (err) {
        // If an error occurred while writing the file
        throw err;
      }
    });
  }
}
