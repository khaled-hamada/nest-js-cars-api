import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateReportDto } from './dtos/create-report.dto';
import { ReportsService } from './reports.service';
import { AuthGuard } from 'guards/auth.guard';
import { CurrentUser } from 'users/decorators/current-user.decorator';
import { User } from 'users/user.entity';
import { serialize } from 'interceptors/serialize.interceptor';
import { ReportDto } from './dtos/report.dto';
import { ApproveReportDto } from './dtos/approve-report.dto';
import { AdminGuard } from '../guards/admin.gurad';
import { GetEstimateDto } from './dtos/get-estimate.dto';

@Controller('reports')
export class ReportsController {
  constructor(readonly reportsService: ReportsService) {}

  @Post()
  @UseGuards(AuthGuard)
  @serialize<ReportDto>(ReportDto)
  createReport(@Body() body: CreateReportDto, @CurrentUser() user: User) {
    return this.reportsService.create(body, user);
  }

  @Patch('/:id')
  @UseGuards(AdminGuard)
  // @serialize<ReportDto>(ReportDto)
  approveReport(@Body() body: ApproveReportDto, @Param('id') id: string) {
    return this.reportsService.changeApproval(parseInt(id), body.approved);
  }

  @Get()
  getEstimate(@Query() query: GetEstimateDto) {
    return this.reportsService.getEstimate(query);
  }
}
