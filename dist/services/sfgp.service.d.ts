import { HttpService } from '@nestjs/axios';
import { RedisService } from './redis.service';
import { Observable } from 'rxjs';
import { ThresholdService } from './threshold.service';
import { LoggerService } from './logger.service';
import { CompanyScore } from '../models/company-score.model';
export declare class SfgpService {
    private httpService;
    private redisService;
    private thresholdService;
    private loggerService;
    private API_URL;
    private API_TOKEN;
    constructor(httpService: HttpService, redisService: RedisService, thresholdService: ThresholdService, loggerService: LoggerService);
    updateScores(): Promise<any>;
    fetchScores(domains: string[]): Observable<CompanyScore[]>;
}
