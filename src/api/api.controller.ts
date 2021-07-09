import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsageDto } from './dto/usage.dto';
import { ErrorDto } from './dto/error.dto';
import { ApiService } from './api.service';

@Controller('api')
export class ApiController {
  constructor(private apiService: ApiService) {}

  @Get('usage')
  getUsage(): string {
    return 'usage';
  }

  @Post('usage')
  async usage(@Body() usageDto: UsageDto) {
    await this.apiService.saveUsageData(usageDto);
  }

  @Post('err')
  async error(@Body() errorDto: ErrorDto) {
    await this.apiService.saveErrorData(errorDto);
  }
}
