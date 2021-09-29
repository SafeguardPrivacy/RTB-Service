"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const axios_1 = require("@nestjs/axios");
const redis_service_1 = require("./services/redis.service");
const sfgp_service_1 = require("./services/sfgp.service");
const logger_service_1 = require("./services/logger.service");
const schedule_1 = require("@nestjs/schedule");
const update_company_scores_job_1 = require("./scheduled-jobs/update-company-scores.job");
const threshold_service_1 = require("./services/threshold.service");
const event_emitter_1 = require("@nestjs/event-emitter");
const event_service_1 = require("./services/event.service");
const fetch_score_listener_1 = require("./listeners/fetch-score.listener");
let AppModule = class AppModule {
};
AppModule = __decorate([
    common_1.Module({
        imports: [
            axios_1.HttpModule.register({
                timeout: 5000,
            }),
            schedule_1.ScheduleModule.forRoot(),
            event_emitter_1.EventEmitterModule.forRoot(),
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            sfgp_service_1.SfgpService,
            logger_service_1.LoggerService,
            redis_service_1.RedisService,
            threshold_service_1.ThresholdService,
            update_company_scores_job_1.UpdateCompanyScoresJob,
            event_service_1.EventService,
            fetch_score_listener_1.FetchScoreListener
        ],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map