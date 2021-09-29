import {Injectable} from '@nestjs/common';
import {HttpService} from '@nestjs/axios';
import {map} from 'rxjs/operators';
import {RedisService} from './redis.service';
import {Observable} from 'rxjs';
import {ThresholdService} from './threshold.service';
import {LoggerService} from './logger.service';
import {CompanyScore} from '../models/company-score.model';
import {Buffer} from 'buffer';

@Injectable()
export class SfgpService {
    private API_URL = process.env.SFGP_API_URL || 'https://api.safeguardprivacy.com/api/v1';
    private API_TOKEN = process.env.SFGP_API_TOKEN;

    constructor(
        private httpService: HttpService,
        private redisService: RedisService,
        private thresholdService: ThresholdService,
        private loggerService: LoggerService,
    ) {
        if (!this.API_TOKEN) {
            throw new Error('No SFGP_API_TOKEN found in environment');
        }
    }

    async updateScores(): Promise<any> {
        const domains = await this.redisService.getDomainList();

        if (domains.length) {
            this.fetchScores(domains).subscribe(async (scores) => {
                for (const score of scores) {
                    const key = this.redisService.formatKey(score.law, score.domain);
                    const auditKey = this.redisService.formatKey(score.law, score.domain, true);
                    await this.redisService.set(key, score.score.toString());
                    await this.redisService.set(auditKey, score.audited.toString());
                }

                this.loggerService.log('Score DB Updated');
            }, (err) => {
                this.loggerService.error(err.response.data.data);
            });
        }
    }

    public fetchScores(domains: string[]): Observable<CompanyScore[]> {
        const keyStr = domains.join(',');
        const encodedStr = Buffer.from(keyStr).toString('base64');
        const url = this.API_URL + '/integrations/scores?d='+ encodedStr;

        return this.httpService
            .get(url, {headers: {'api-key': this.API_TOKEN}})
            .pipe(
                map((r) => {
                    const rows = r.data.data;
                    return rows.map(row => Object.assign(new CompanyScore(), row));
                }),
            );
    }
}
