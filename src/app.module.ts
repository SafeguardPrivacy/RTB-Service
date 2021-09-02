import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {HttpModule} from '@nestjs/axios';
import {RedisService} from './services/redis.service';
import {SfgpService} from './services/sfgp.service';
import {LoggerService} from './services/logger.service';
import {ScheduleModule} from '@nestjs/schedule';
import {UpdateCompanyScoresJob} from './scheduled-jobs/update-company-scores.job';
import {ThresholdService} from './services/threshold.service';
import {EventEmitterModule} from '@nestjs/event-emitter';
import {EventService} from './services/event.service';
import {FetchScoreListener} from './listeners/fetch-score.listener';

@Module({
    imports: [
        HttpModule.register({
            timeout: 5000,
        }),
        ScheduleModule.forRoot(),
        EventEmitterModule.forRoot(),
    ],
    controllers: [AppController],
    providers: [
        SfgpService,
        LoggerService,
        RedisService,
        ThresholdService,
        UpdateCompanyScoresJob,
        EventService,
        FetchScoreListener
    ],
})
export class AppModule {}
