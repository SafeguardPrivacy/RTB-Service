import { FetchScoreEvent } from '../events/fetch-score.event';
import { SfgpService } from '../services/sfgp.service';
import { RedisService } from '../services/redis.service';
import { LoggerService } from '../services/logger.service';
export declare class FetchScoreListener {
    private sfgpService;
    private redisService;
    private loggerService;
    constructor(sfgpService: SfgpService, redisService: RedisService, loggerService: LoggerService);
    handleScoreFetchEvent(payload: FetchScoreEvent): Promise<void>;
}
