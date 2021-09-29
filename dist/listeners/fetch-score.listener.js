"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchScoreListener = void 0;
const common_1 = require("@nestjs/common");
const fetch_score_event_1 = require("../events/fetch-score.event");
const event_emitter_1 = require("@nestjs/event-emitter");
const sfgp_service_1 = require("../services/sfgp.service");
const redis_service_1 = require("../services/redis.service");
const logger_service_1 = require("../services/logger.service");
let FetchScoreListener = class FetchScoreListener {
    constructor(sfgpService, redisService, loggerService) {
        this.sfgpService = sfgpService;
        this.redisService = redisService;
        this.loggerService = loggerService;
    }
    async handleScoreFetchEvent(payload) {
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
};
__decorate([
    event_emitter_1.OnEvent('score.fetch'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fetch_score_event_1.FetchScoreEvent]),
    __metadata("design:returntype", Promise)
], FetchScoreListener.prototype, "handleScoreFetchEvent", null);
FetchScoreListener = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [sfgp_service_1.SfgpService,
        redis_service_1.RedisService,
        logger_service_1.LoggerService])
], FetchScoreListener);
exports.FetchScoreListener = FetchScoreListener;
//# sourceMappingURL=fetch-score.listener.js.map