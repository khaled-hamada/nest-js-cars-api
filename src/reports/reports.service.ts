import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from './report.entity';
import { CreateReportDto } from './dtos/create-report.dto';
import { User } from 'users/user.entity';
import { GetEstimateDto } from './dtos/get-estimate.dto';

@Injectable()
export class ReportsService {
  constructor(@InjectRepository(Report) readonly repo: Repository<Report>) {}
  async create(payload: CreateReportDto, user: User) {
    const report: Report = this.repo.create(payload);
    report.user = user;
    return await this.repo.save(report);
  }

  async changeApproval(id: number, approvedStatus: boolean) {
    const report = await this.repo.findOne({ where: { id } });

    if (!report) {
      throw new NotFoundException('cannot found a report with this id');
    }
    report.approved = approvedStatus;

    return await this.repo.save(report);
  }
  async getEstimate({ make, model, mileage, lat, lng, year }: GetEstimateDto) {
    return await this.repo
      .createQueryBuilder()
      .select('AVG(price)', 'price')
      .where('approved IS TRUE')
      .andWhere('make = :make', { make })
      .andWhere('model = :model', { model })
      .andWhere('model = :model', { model })
      .andWhere('lng - :lng BETWEEN -5 AND 5', { lng })
      .andWhere('lat - :lat BETWEEN -5 AND 5', { lat })
      .andWhere('year - :year BETWEEN -3 AND 3', { year })
      .orderBy('ABS(mileage - :mileage)', 'DESC')
      .setParameters({ mileage })
      .limit(3)
      .getRawOne();
  }
}
