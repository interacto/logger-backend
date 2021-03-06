import { Body, Controller, Delete, Get, Post } from '@nestjs/common';
import { ApiService } from './api.service';
import { LoggingData, UsageLog } from 'interacto';

@Controller('api')
export class ApiController {
  constructor(private apiService: ApiService) {}

  @Get('usage')
  getUsage(): Array<UsageLog> {
    return this.apiService.usageLogs;
  }

  @Get('err')
  getError(): Array<LoggingData> {
    return this.apiService.errorLogs;
  }

  @Post('usage')
  async usage(@Body() usageDto: UsageLog) {
    await this.apiService.saveUsageData(usageDto);
  }

  @Post('err')
  async error(@Body() errorDto: LoggingData) {
    await this.apiService.saveErrorData(errorDto);
  }

  @Delete('usage')
  async deleteUsage() {
    await this.apiService.deleteUsageData();
  }

  @Delete('err')
  async deleteError() {
    await this.apiService.deleteErrorData();
  }
}
