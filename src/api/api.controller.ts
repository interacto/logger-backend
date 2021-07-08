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
  usage(@Body() usageDto: UsageDto) {
    this.apiService.saveUsageData(usageDto).then();
  }

  @Post('err')
  error(@Body() errorDto: ErrorDto) {
    this.apiService.saveErrorData(errorDto).then();
  }
}
