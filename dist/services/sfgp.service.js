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
exports.SfgpService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const operators_1 = require("rxjs/operators");
const redis_service_1 = require("./redis.service");
const threshold_service_1 = require("./threshold.service");
const logger_service_1 = require("./logger.service");
const company_score_model_1 = require("../models/company-score.model");
const buffer_1 = require("buffer");
let SfgpService = class SfgpService {
    constructor(httpService, redisService, thresholdService, loggerService) {
        this.httpService = httpService;
        this.redisService = redisService;
        this.thresholdService = thresholdService;
        this.loggerService = loggerService;
        this.API_URL = process.env.SFGP_API_URL || 'https://api.safeguardprivacy.com/api/v1';
        this.API_TOKEN = process.env.SFGP_API_TOKEN;
        if (!this.API_TOKEN) {
            throw new Error('No SFGP_API_TOKEN found in environment');
        }
    }
    async updateScores() {
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
    fetchScores(domains) {
        const keyStr = domains.join(',');
        const encodedStr = buffer_1.Buffer.from(keyStr).toString('base64');
        const url = this.API_URL + '/integrations/scores?d=' + encodedStr;
        return this.httpService
            .get(url, { headers: { 'api-key': this.API_TOKEN } })
            .pipe(operators_1.map((r) => {
            const rows = r.data.data;
            return rows.map(row => Object.assign(new company_score_model_1.CompanyScore(), row));
        }));
    }
};
SfgpService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [axios_1.HttpService,
        redis_service_1.RedisService,
        threshold_service_1.ThresholdService,
        logger_service_1.LoggerService])
], SfgpService);
exports.SfgpService = SfgpService;
//# sourceMappingURL=sfgp.service.js.map