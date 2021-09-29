import { SfgpService } from './services/sfgp.service';
import { RedisService } from './services/redis.service';
import { GetScoreResponse } from './responses/get-score.response';
import { EventService } from './services/event.service';
export declare class AppController {
    private readonly sfgpService;
    private readonly redisService;
    private readonly eventService;
    constructor(sfgpService: SfgpService, redisService: RedisService, eventService: EventService);
    getScore(domain: string, law: number): Promise<GetScoreResponse>;
}
