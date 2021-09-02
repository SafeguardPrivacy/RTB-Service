import {Controller, Get, HttpException, HttpStatus, Query} from '@nestjs/common';
import {SfgpService} from './services/sfgp.service';
import {RedisService} from './services/redis.service';
import {GetScoreResponse} from './responses/get-score.response';
import {ApiOperation, ApiQuery, ApiResponse} from '@nestjs/swagger';
import {EventService} from './services/event.service';
import {ApiImplicitQuery} from '@nestjs/swagger/dist/decorators/api-implicit-query.decorator';

@Controller()
export class AppController {
    constructor(
        private readonly sfgpService: SfgpService,
        private readonly redisService: RedisService,
        private readonly eventService: EventService,
    ) {
        // this.redisService.flushAll();
    }

    @Get()
    @ApiOperation({ summary: 'Get a pass/fail score of a customer\'s SafeguardPrivacy score' })
    @ApiResponse({status: HttpStatus.OK, type: GetScoreResponse})
    @ApiResponse({status: HttpStatus.UNPROCESSABLE_ENTITY})
    @ApiImplicitQuery({
        name: 'domain',
        description: 'The domain of the customer you want to check'
    })
    @ApiImplicitQuery({
        name: 'law',
        description: 'The law you want to check'
    })
    async getScore(
        @Query('domain') domain: string,
        @Query('law') law: number
    ): Promise<GetScoreResponse> {
        if (!domain) {
            throw new HttpException('domain is required', HttpStatus.UNPROCESSABLE_ENTITY);
        }

        if (!law) {
            throw new HttpException('law is required', HttpStatus.UNPROCESSABLE_ENTITY);
        }

        const key = this.redisService.formatKey(law, domain);
        const status = await this.redisService.get(key);

        if (status === null) {
            this.eventService.fetchScore(domain);

            return new GetScoreResponse(domain, -1, 'not found');
        } else if (+status === 1) {
            return new GetScoreResponse(domain, 1, '');
        } else {
            return new GetScoreResponse(domain, 0, '');
        }
    }
}
