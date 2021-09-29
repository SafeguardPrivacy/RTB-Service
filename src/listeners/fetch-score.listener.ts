import {Injectable} from '@nestjs/common';
import {FetchScoreEvent} from '../events/fetch-score.event';
import {OnEvent} from '@nestjs/event-emitter';
import {SfgpService} from '../services/sfgp.service';
import {RedisService} from '../services/redis.service';
import {LoggerService} from '../services/logger.service';

@Injectable()
export class FetchScoreListener {

    constructor(
        private sfgpService: SfgpService,
        private redisService: RedisService,
        private loggerService: LoggerService
    ) {}

    @OnEvent('score.fetch')
    async handleScoreFetchEvent(payload: FetchScoreEvent): Promise<void> {
        this.sfgpService.fetchScores([payload.domain]).subscribe(async (companies) => {
            for (const company of companies) {
                console.log(company);
                const key = this.redisService.formatKey(company.law, company.domain);
                const auditKey = this.redisService.formatKey(company.law, company.domain, true);
                await this.redisService.set(key, company.score.toString());
                await this.redisService.set(auditKey, company.audited.toString());
            }

            this.loggerService.log('Score DB Updated');
        }, err => {
            this.loggerService.error(err);
        });
    }

}
