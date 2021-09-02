import {Injectable} from '@nestjs/common';
import {Cron, CronExpression} from '@nestjs/schedule';
import {SfgpService} from '../services/sfgp.service';

@Injectable()
export class UpdateCompanyScoresJob {
    constructor(private sfgpService: SfgpService) {}

    @Cron(CronExpression.EVERY_DAY_AT_1AM)
    async run(): Promise<void> {
        await this.sfgpService.updateScores();
    }
}
