import { Module } from '@nestjs/common';
import { Report } from './report.entity';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  providers: [ReportsService],
  controllers: [ReportsController],
  imports: [TypeOrmModule.forFeature([Report])],
})
export class ReportsModule {}
